import jwt
from django.conf import settings
from django.http import HttpResponseRedirect
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

def redirect_on_404(get_response):
    def middleware(request):
        response = get_response(request)
        # Проверяем, что 404 страница не для конкретных маршрутов, например для динамических URL с проектами
        if response.status_code == 404 and not request.path.startswith('/projects/'):
            return HttpResponseRedirect('/projects/')  # Перенаправляем на главную страницу

        return response
    return middleware

def login_required_middleware(get_response):
    def middleware(request):
        token = request.COOKIES.get('access_token')
        #print(token)
        if token:
            try:
                if token.startswith('Bearer '):
                    token = token.split('Bearer ')[1]

                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                request.idusers = decoded_token['user_id']
                #print(decoded_token)
                # Если токен декодирован успешно, проверяем путь
                if request.path in ['/login/', '/register/']:
                    return HttpResponseRedirect('/projects/')  # Перенаправляем на главную страницу

            except ExpiredSignatureError:
                # Если пользователь уже на странице логина, не перенаправляем
                if request.path != '/login/':
                    return HttpResponseRedirect('/login/')  # Перенаправляем на страницу логина

            except InvalidTokenError:
                if request.path != '/login/':
                    return HttpResponseRedirect('/login/')

            except Exception:
                if request.path != '/login/':
                    return HttpResponseRedirect('/login/')

        else:
            # Если токена нет и пользователь пытается попасть на защищённые страницы
            if request.path not in ['/login/', '/register/']:
                return HttpResponseRedirect('/login/')  # Перенаправляем на страницу авторизации

        return get_response(request)

    return middleware
