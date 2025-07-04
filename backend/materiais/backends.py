from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if not isinstance(username, str) or not username:
            return None
        try:
            user = UserModel.objects.get(email__iexact=username)
        except UserModel.DoesNotExist:
            return None
        else:
            if password is not None and user.check_password(password) and self.user_can_authenticate(user):
                return user
        return None