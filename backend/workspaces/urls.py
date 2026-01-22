from django.urls import path
from .views import (
    create_workspace,
    join_workspace,
    list_dashboard,
)

urlpatterns = [
    path("create/", create_workspace),
    path("join/", join_workspace),
    path("", list_dashboard),

]
