from django.http import HttpResponseRedirect

def login_required_middleware(get_response):
    def middleware(request):
        # Проверяем наличие токена в куках
        token = request.COOKIES.get('access_token')
        
        # Если токен есть, значит пользователь авторизован
        if token:
            
            # Проверяем, не находимся ли мы на странице логина или регистрации
            if request.path in ['/login/', '/register/']:
                return HttpResponseRedirect('/')  # Перенаправляем на главную страницу или другую

            # Здесь вы можете добавить логику декодирования токена, если нужно
            # Например, получить информацию о пользователе
            
        else:
            
            # Если токена нет, проверяем, не находимся ли мы на странице логина или регистрации
            if request.path in ['/login/', '/register/']:
                return get_response(request)
            else:
                return HttpResponseRedirect('/login/')  # перенаправляем на страницу авторизации
        
        return get_response(request)

    return middleware
