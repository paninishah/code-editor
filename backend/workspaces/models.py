# Create your models here.
from django.db import models
from django.contrib.auth.models import User


class Workspace(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    code = models.TextField(blank=True, null=True)


    def __str__(self):
        return f"Workspace {self.id}"


class SavedWorkspace(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'workspace')

