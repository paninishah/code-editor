# CodeEditor/routing.py

from django.urls import re_path
from collaboration.consumers import CodeRoomConsumer

websocket_urlpatterns = [
    re_path(r"ws/room/(?P<room_id>\w+)/$", CodeRoomConsumer.as_asgi()),
]
