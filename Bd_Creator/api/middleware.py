from django.shortcuts import redirect

class AuthenticatedRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Получаем токен из куки
        auth_token = request.COOKIES.get('auth_token')

        # Проверяем, если токен есть и пользователь пытается зайти на /login/ или /register/
        if auth_token and request.path in ['/login/', '/register/']:
            return redirect('/')  # Перенаправляем на главную или другую страницу

        response = self.get_response(request)
        return response
