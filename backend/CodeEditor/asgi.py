"""
ASGI config for CodeEditor project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""



import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from users.socket_auth import JWTAuthMiddleware
import CodeEditor.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CodeEditor.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),   # ← YOU MISSED THIS
    "websocket": JWTAuthMiddleware(
        URLRouter(CodeEditor.routing.websocket_urlpatterns)
    ),
})

