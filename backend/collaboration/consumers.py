# collaboration/consumers.py

import json

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from .room_state import active_rooms
from .utils import is_owner, session_active
from workspaces.models import Workspace   # assumes this exists


class CodeRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.group_name = f"room_{self.room_id}"
        self.user = self.scope["user"]

        # Reject unauthenticated users
        if not self.user.is_authenticated:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        # Initialize room state if first user
        if self.room_id not in active_rooms:
            workspace = await sync_to_async(Workspace.objects.get)(
                id=self.room_id
            )

            active_rooms[self.room_id] = {
                "code": workspace.code,
                "owner_id": workspace.owner_id,
                "session_active": True,
            }

        # Send current code to new joiner
        await self.send(text_data=json.dumps({
            "code": active_rooms[self.room_id]["code"]
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        room = active_rooms.get(self.room_id)

        if not room:
            return

        # END SESSION (owner only)
        if data.get("end_session"):
            if not is_owner(room, self.user):
                return

            room["session_active"] = False

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "session_end"
                }
            )
            return

        # BLOCK EDITS IF SESSION ENDED
        if not session_active(room):
            return

        # CODE UPDATE
        if "code" in data:
            room["code"] = data["code"]

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "code_update",
                    "code": data["code"]
                }
            )

    async def code_update(self, event):
        await self.send(text_data=json.dumps({
            "code": event["code"]
        }))

    async def session_end(self, event):
        await self.send(text_data=json.dumps({
            "ended": True
        }))
