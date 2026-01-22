from django.db import models
from django.contrib.auth.models import User
import uuid


class Workspace(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, default="Untitled Room")

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owned_workspaces"
    )

    # Canonical room state
    code = models.TextField(blank=True, null=True)
    language = models.CharField(max_length=20, default="javascript")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.owner.username}"


class SavedWorkspace(models.Model):
    ROLE_CHOICES = (
        ("owner", "Owner"),
        ("collaborator", "Collaborator"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    class Meta:
        unique_together = ("user", "workspace")

    def __str__(self):
        return f"{self.user.username} → {self.workspace.name} ({self.role})"
