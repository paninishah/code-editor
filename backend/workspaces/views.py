from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Workspace, SavedWorkspace


# ✅ CREATE ROOM
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_room(request):
    workspace = Workspace.objects.create(owner=request.user)

    SavedWorkspace.objects.create(
        user=request.user,
        workspace=workspace
    )

    return Response({
        "roomId": workspace.id
    })


# ✅ JOIN ROOM
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_room(request):
    room_id = request.data.get("roomId")

    workspace = Workspace.objects.filter(id=room_id).first()

    if not workspace:
        return Response({"error": "Room not found"}, status=404)

    return Response({
    "roomId": workspace.id
})



# ✅ SAVE ROOM (bookmark)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_room(request):
    room_id = request.data.get("roomId")

    workspace = Workspace.objects.filter(id=room_id).first()
    if not workspace:
        return Response({"error": "Room not found"}, status=404)

    SavedWorkspace.objects.get_or_create(
        user=request.user,
        workspace=workspace
    )

    return Response({"success": True})


# ✅ LIST DASHBOARD ROOMS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_dashboard_rooms(request):
    saved = SavedWorkspace.objects.filter(user=request.user)

    data = []
    for item in saved:
        data.append({
            "roomId": item.workspace.id,
            "owner": item.workspace.owner.username,
            "created_at": item.workspace.created_at
        })

    return Response(data)


# ✅ REMOVE FROM DASHBOARD
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_dashboard(request):
    room_id = request.data.get("roomId")

    deleted, _ = SavedWorkspace.objects.filter(
        user=request.user,
        workspace_id=room_id
    ).delete()

    if deleted == 0:
        return Response(
            {"error": "Room not found in dashboard"},
            status=404
        )

    return Response({"message": "Room removed from dashboard"})

# ✅ DELETE ROOM (OWNER ONLY)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_room(request, room_id):
    workspace = Workspace.objects.filter(id=room_id).first()

    if not workspace:
        return Response({"error": "Room not found"}, status=404)

    if workspace.owner != request.user:
        return Response({"error": "Not allowed"}, status=403)

    workspace.delete()
    return Response({"message": "Room deleted"})
