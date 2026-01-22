from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Workspace, SavedWorkspace


# =============================
# ROOM CREATION / JOIN
# =============================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_workspace(request):
    workspace = Workspace.objects.create(
        owner=request.user,
        name=request.data.get("name", "Untitled Room"),
        code="",
        language="javascript",
    )

    SavedWorkspace.objects.create(
        user=request.user,
        workspace=workspace,
        role="owner",
    )

    return Response({
        "id": str(workspace.id),
        "name": workspace.name,
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_workspace(request):
    room_id = request.data.get("roomId")

    try:
        workspace = Workspace.objects.get(id=room_id)

        SavedWorkspace.objects.get_or_create(
            user=request.user,
            workspace=workspace,
            defaults={"role": "collaborator"},
        )

        return Response({
            "id": str(workspace.id),
            "name": workspace.name,
            "owner": workspace.owner.username,
        })

    except Workspace.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)


# =============================
# DASHBOARD
# =============================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_dashboard(request):
    saved = (
        SavedWorkspace.objects
        .filter(user=request.user)
        .select_related("workspace", "workspace__owner")
    )

    return Response([
        {
            "id": str(s.workspace.id),
            "name": s.workspace.name,
            "owner": s.workspace.owner.username,
            "role": s.role,
            "created_at": s.workspace.created_at,
        }
        for s in saved
        if s.workspace
    ])


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_from_dashboard(request):
    room_id = request.data.get("roomId")

    deleted, _ = SavedWorkspace.objects.filter(
        user=request.user,
        workspace_id=room_id
    ).delete()

    if deleted == 0:
        return Response({"error": "Room not found"}, status=404)

    return Response({"message": "Removed from dashboard"})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_room(request, room_id):
    workspace = Workspace.objects.filter(id=room_id).first()

    if not workspace:
        return Response({"error": "Room not found"}, status=404)

    if workspace.owner != request.user:
        return Response({"error": "Not allowed"}, status=403)

    workspace.delete()
    return Response({"message": "Room deleted"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def rename_room(request, room_id):
    name = request.data.get("name", "").strip()

    if not name:
        return Response({"error": "Name required"}, status=400)

    workspace = Workspace.objects.filter(id=room_id).first()

    if not workspace:
        return Response({"error": "Room not found"}, status=404)

    if workspace.owner != request.user:
        return Response({"error": "Not allowed"}, status=403)

    workspace.name = name
    workspace.save()

    return Response({
        "id": str(workspace.id),
        "name": workspace.name,
    })

# =============================
# ROOM STATE (CODE + LANGUAGE)
# =============================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_room_state(request, room_id):
    try:
        workspace = Workspace.objects.get(id=room_id)

        return Response({
            "code": workspace.code or "",
            "language": workspace.language,
        })

    except Workspace.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_room_state(request, room_id):
    try:
        workspace = Workspace.objects.get(id=room_id)

        if "code" in request.data:
            workspace.code = request.data["code"]

        if "language" in request.data:
            workspace.language = request.data["language"]

        workspace.save()

        return Response({"message": "Saved"})

    except Workspace.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)

