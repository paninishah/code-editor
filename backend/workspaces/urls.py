from django.urls import path
from .views import (
    create_workspace,
    join_workspace,
    list_dashboard,
    remove_from_dashboard,
    delete_room,
    get_room_state,
    save_room_state,
    rename_room,
)

urlpatterns = [
    path("create/", create_workspace),
    path("join/", join_workspace),

    path("", list_dashboard),
    path("remove/", remove_from_dashboard),
    path("delete/<uuid:room_id>/", delete_room),

    path("<uuid:room_id>/state/", get_room_state),
    path("<uuid:room_id>/state/save/", save_room_state),
    path("<uuid:room_id>/rename/", rename_room),

]
