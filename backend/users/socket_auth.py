from urllib.parse import parse_qs

from django.contrib.auth.models import AnonymousUser, User
from django.db import close_old_connections
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async


@database_sync_to_async
def get_user(token):
    try:
        validated_token = JWTAuthentication().get_validated_token(token)
        return JWTAuthentication().get_user(validated_token)
    except Exception:
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()

        headers = dict(scope["headers"])
        token = None

        if b'authorization' in headers:
            try:
                token = headers[b'authorization'].decode().split(" ")[1]
            except IndexError:
                pass

        if token:
            scope["user"] = await get_user(token)
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
