from django.urls import re_path
from .consumers import CodeRoomConsumer

websocket_urlpatterns = [
    re_path(r"ws/room/(?P<room_id>[0-9a-f-]+)/$", CodeRoomConsumer.as_asgi()),
]
