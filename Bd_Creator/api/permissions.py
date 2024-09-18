from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow users to access and modify their own data.
    """

    def has_object_permission(self, request, view, obj):
        # Разрешаем безопасные методы (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Разрешаем доступ только если пользователь работает со своей моделью
        return obj == request.user
