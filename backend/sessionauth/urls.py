from django.urls import path
from .views import *

urlpatterns = [
    path("register/", sign_up, name="sign-up"),
    path("csrf_cookie/", get_csrf_token, name="get-csrf-token"),
    path("authenticated/", check_authenticated, name="check-authenticated"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("delete/", delete_account, name="delete-account"),
    path("user/", get_user, name="get-user"),
    path("picture/", get_profile_picture, name="get-profile-picture"),
    path("activate/<uidb64>/<token>/", activate, name="activate"),
    path("resendActivationLink/", resend_activation_link, name="resend-activation-link"),
    path("update/", update_profile, name="update-profile"),
    path("change-email/", change_email, name="change-email"),
    path("change-password/", change_password, name="change-password"),
    path("verify/<uidb64>/<token>/", verify_change, name="verify"),
    path("resendVerificationLink/", resend_verification_link, name="resend-verification-link"),
    path("reset-password/", reset_password, name="reset-password"),
    path("reset/<uidb64>/<token>/", verify_reset, name="reset"),
    path("resendResetLink/", resend_reset_link, name="resend-reset-link")
]