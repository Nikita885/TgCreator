from django.http import HttpResponseRedirect
import logging

def redirect_on_404(get_response):
    def middleware(request):
        response = get_response(request)
        if response.status_code == 404:
            return HttpResponseRedirect('/')  # Перенаправляем на главную страницу
        return response
    return middleware
def login_required_middleware(get_response):
    def middleware(request):
        token = request.COOKIES.get('access_token')

        # Если токен есть, значит пользователь авторизован
        if token:
            if request.path in ['/login/', '/register/']:
                return HttpResponseRedirect('/')  # Перенаправляем на главную страницу
        else:
            if request.path in ['/login/', '/register/']:
                return get_response(request)
            else:
                return HttpResponseRedirect('/login/')  # Перенаправляем на страницу авторизации
        
        return get_response(request)

    return middleware
