from django.urls import path
from .views import (
    create_room,
    join_room,
    save_room,
    list_dashboard_rooms,
    remove_from_dashboard,
    delete_room
)

urlpatterns = [
    path("create/", create_room),                 # POST
    path("join/", join_room),                     # POST
    path("save/", save_room),                     # POST
    path("", list_dashboard_rooms),               # GET
    path("remove/", remove_from_dashboard),       # POST
    path("delete/<int:room_id>/", delete_room),   # DELETE
]
