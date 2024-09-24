from django.http import HttpResponseRedirect
import logging

logger = logging.getLogger(__name__)

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
        
        # Пропускаем запросы к статическим файлам
        if request.path.startswith('/static/') or request.path.startswith('/admin/'):
            #print(request.path)
            logger.debug("Пропускаем запрос к статическому файлу.")
            return get_response(request)

        # Если токен есть, значит пользователь авторизован
        if token:
            if request.path in ['/login/', '/register/']:
                logger.debug("Пользователь авторизован, перенаправление на главную.")
                return HttpResponseRedirect('/')  # Перенаправляем на главную страницу
        else:
            if request.path in ['/login/', '/register/']:
                return get_response(request)
            else:
                logger.debug("Токена нет, перенаправление на страницу логина.")
                return HttpResponseRedirect('/login/')  # Перенаправляем на страницу авторизации
        
        return get_response(request)

    return middleware
