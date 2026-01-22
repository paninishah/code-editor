from channels.routing import ProtocolTypeRouter, URLRouter
from users.socket_auth import JWTAuthMiddleware
import collaboration.routing

application = ProtocolTypeRouter({
    "websocket": JWTAuthMiddleware(
        URLRouter(collaboration.routing.websocket_urlpatterns)
    ),
})
