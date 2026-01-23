import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CodeEditor.settings")

import django
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import collaboration.routing
from users.socket_auth import JWTAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(
            collaboration.routing.websocket_urlpatterns
        )
    ),
})
