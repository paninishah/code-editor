import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CodeEditor.settings")

import django
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import collaboration.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            collaboration.routing.websocket_urlpatterns
        )
    ),
})
