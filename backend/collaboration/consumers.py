import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from workspaces.models import Workspace, SavedWorkspace

class CodeRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.group_name = f"room_{self.room_id}"

        # Enforce websocket auth + membership
        user = self.scope.get("user")
        if not user or not getattr(user, "is_authenticated", False):
            await self.close(code=4401)  # unauthorized
            return

        workspace = await sync_to_async(Workspace.objects.filter(id=self.room_id).first)()
        if not workspace:
            await self.close(code=4404)  # not found
            return

        is_member = await sync_to_async(
            SavedWorkspace.objects.filter(user=user, workspace_id=self.room_id).exists
        )()
        if not is_member:
            await self.close(code=4403)  # forbidden
            return

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        # Send current room state to the joining user
        await self.send(text_data=json.dumps({
            "type": "init",
            "code": workspace.code or "",
            "language": workspace.language,
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data["type"] == "code":
            await sync_to_async(
                Workspace.objects.filter(id=self.room_id).update
            )(code=data["code"])

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "broadcast_code",
                    "code": data["code"],
                }
            )

        if data["type"] == "language":
            await sync_to_async(
                Workspace.objects.filter(id=self.room_id).update
            )(language=data["language"])

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "broadcast_language",
                    "language": data["language"],
                }
            )

    async def broadcast_code(self, event):
        await self.send(text_data=json.dumps({
            "type": "code",
            "code": event["code"],
        }))

    async def broadcast_language(self, event):
        await self.send(text_data=json.dumps({
            "type": "language",
            "language": event["language"],
        }))
