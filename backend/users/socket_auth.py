from urllib.parse import parse_qs

from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async


@database_sync_to_async
def get_user(token):
    try:
        if not token:
            return AnonymousUser()
        if token.startswith("Bearer "):
            token = token.split(" ", 1)[1].strip()
        validated_token = JWTAuthentication().get_validated_token(token)
        return JWTAuthentication().get_user(validated_token)
    except Exception:
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()

        headers = dict(scope["headers"])
        token = None

        # 1) Authorization header: "Bearer <jwt>"
        if b'authorization' in headers:
            try:
                token = headers[b'authorization'].decode().split(" ")[1]
            except IndexError:
                pass

        # 2) Query param: ?token=<jwt> (useful for browser WebSocket)
        if not token:
            try:
                qs = parse_qs(scope.get("query_string", b"").decode())
                token = (qs.get("token") or [None])[0]
            except Exception:
                token = None

        if token:
            scope["user"] = await get_user(token)
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
