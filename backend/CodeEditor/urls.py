from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT AUTH
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User auth
    path('auth/', include('users.urls')),

    # Workspace APIs
    path('api/workspace/', include('workspaces.urls')),

    # Execution
    path('api/execution/', include('execution.urls')),
]
