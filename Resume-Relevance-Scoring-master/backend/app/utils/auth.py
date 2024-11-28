import jwt
from django.conf import settings
from app.models import Task
from rest_framework import authentication
from rest_framework import exceptions
from django.contrib.auth.models import AnonymousUser

class Authentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        try:
            token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1] 

            if not token:
                raise exceptions.AuthenticationFailed('Unauthenticated')

            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            except jwt.InvalidSignatureError:
                raise exceptions.AuthenticationFailed('Invalid token')
            except jwt.ExpiredSignatureError:
                raise exceptions.AuthenticationFailed('Expired token')

            try:
                task_id = payload.get('id')
                task = Task.objects.get(id=task_id)
            except Task.DoesNotExist:
                raise exceptions.AuthenticationFailed('Task does not exist')
            except Exception as e:
                raise exceptions.AuthenticationFailed(f'Error retrieving task: {str(e)}')

            request.task_id = task_id
            user = AnonymousUser()
            user.is_active = True
            return (user, None)
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))
