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
    path('create/', create_room),
    path('join/', join_room),
    path('save/', save_room),
    path('', list_dashboard_rooms),
    path('remove/<int:room_id>/', remove_from_dashboard),
    path('delete/<int:room_id>/', delete_room),
]
