from django.http import HttpResponseRedirect

def login_required_middleware(get_response):
    def middleware(request):
        # Проверяем, не находимся ли мы на странице логина или регистрации
        if request.path in ['/login/', '/register/']:
            return get_response(request)

        # Проверяем наличие токена в куках
        print(request.COOKIES.get('access_token'))
        if not request.COOKIES.get('access_token'):
            return HttpResponseRedirect('/login/')  # перенаправляем на страницу авторизации
        
        return get_response(request)

    return middleware
