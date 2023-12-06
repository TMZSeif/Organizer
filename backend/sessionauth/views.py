from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.http import FileResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status
from rest_framework.response import Response
import os
from .models import UserAccount, Profile, PasswordToBeVerified

# Create your views here.


@api_view(["GET"])
@csrf_protect
def check_authenticated(request):
    user = request.user
    isAuthenticated = user.is_authenticated

    try:
        if isAuthenticated and user.email_active:
            return Response({"isAuthenticated": "success"})
        else:
            return Response({"IsAuthenticated", "error"}, status=status.HTTP_403_FORBIDDEN)
    except:
        return Response({"error": "Something went wrong checking authentication"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
@csrf_protect
def sign_up(request):
    data = request.data

    name = data["name"]
    email = data["email"]
    password = data["password"]
    re_password = data["re_password"]
    is_teacher = data["is_teacher"]
    school_code = data["school_code"]

    try:
        if password == re_password:
            if UserAccount.objects.filter(email=email).exists():
                return Response({"error": "User already exists with that email"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if Profile.objects.filter(name=name).exists():
                    return Response({"error": "User already exists with that name"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    if is_teacher and school_code == "ABCDEFt":
                        user = UserAccount.objects.create_user(email=email, password=password, is_teacher=is_teacher)
                        user_profile = Profile(user=user, name=name)
                        user_profile.save()
                    elif not is_teacher and school_code == "ABCDEF":
                        user = UserAccount.objects.create_user(email=email, password=password, is_teacher=is_teacher)
                        user_profile = Profile(user=user, name=name)
                        user_profile.save()
                    else:
                        return Response({"error": "School code does not match"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"error": "Something went wrong registering"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    login(request, user)
    subject = "Activate your account"
    message = render_to_string("sessionauth/acc_activate_email.html", {
        "user": user_profile,
        "domain": "192.168.8.145:3000",
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "token": default_token_generator.make_token(user)
    })
    to_email = user.email
    send_mail(subject, message, None, [to_email], fail_silently=False)
    return Response({"success": "User created successfully"}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
@csrf_protect
def resend_activation_link(request):
    user = request.user
    profile = user.profile
    subject = "Activate your account"
    message = render_to_string("sessionauth/acc_activate_email.html", {
        "user": profile,
        "domain": "192.168.8.145:3000",
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "token": default_token_generator.make_token(user)
    })
    to_email = user.email
    send_mail(subject, message, None, [to_email], fail_silently=False)
    return Response({"success": "User created successfully"}, status=status.HTTP_200_OK)

@api_view(["GET"])
def resend_verification_link(request):
    user = request.user
    subject = "Verify password change"
    message = render_to_string("sessionauth/acc_verify_password_change.html", {
        "user": user.profile,
        "domain": "192.168.8.145:3000",
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "token": default_token_generator.make_token(user)
    })
    to_email = user.email
    send_mail(subject, message, None, [to_email], fail_silently=False)
    return Response({"success": "Verification link was sent"}, status=status.HTTP_200_OK)

@api_view(["GET"])
def resend_reset_link(request):
    user = request.user
    subject = "Verify password reset"
    message = render_to_string("sessionauth/acc_verify_password_reset.html", {
        "user": user.profile,
        "domain": "192.168.8.145:3000",
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "token": default_token_generator.make_token(user)
    })
    to_email = user.email
    send_mail(subject, message, None, [to_email], fail_silently=False)
    return Response({"success": "Verification link was sent"}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
@csrf_protect
def activate(request, uidb64, token):
    uid = urlsafe_base64_decode(uidb64).decode()
    user = UserAccount.objects.filter(pk=uid).exists()
    if user:
        user = UserAccount.objects.get(pk=uid)
        if default_token_generator.check_token(user, token):
            user.email_active = True
            user.save()
            return Response({"success": "Your account has been activated"})
        else:
            return Response({"error": "Activation link is invalid"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Activation link is invalid"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
@csrf_protect
def verify_change(request, uidb64, token):
    uid = urlsafe_base64_decode(uidb64).decode()
    user = UserAccount.objects.filter(pk=uid).exists()
    print(user)
    if user:
        user = UserAccount.objects.get(pk=uid)
        if default_token_generator.check_token(user, token):
            user.set_password(PasswordToBeVerified.objects.get(user=user).password)
            user.save()
            PasswordToBeVerified.objects.get(user=user).delete()
            return Response({"success": "Your password has been changed"})
        else:
            return Response({"error": "Verification link is invalid"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Verification link is invalid"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
@csrf_protect
def verify_reset(request, uidb64, token):
    uid = urlsafe_base64_decode(uidb64).decode()
    user = UserAccount.objects.filter(pk=uid).exists()
    print(user)
    if user:
        user = UserAccount.objects.get(pk=uid)
        if default_token_generator.check_token(user, token):
            user.set_password(PasswordToBeVerified.objects.get(user=user).password)
            user.save()
            PasswordToBeVerified.objects.get(user=user).delete()
            return Response({"success": "Your password has been changed"})
        else:
            return Response({"error": "Verification link is invalid"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Verification link is invalid"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
@csrf_protect
def login_view(request):
    data = request.data

    email = data["email"]
    password = data["password"]

    user = authenticate(email=email, password=password)

    try:
        if user is not None:
            login(request, user)
            return Response({"success": "User authenticated", "email": email})
        else:
            return Response({"error": "invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"error": "Something went wrong logging in"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def logout_view(request):
    try:
        logout(request)
        return Response({"success": "Logged Out"})
    except:
        return Response({"error": "Something went wrong logging out"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def update_profile(request):
    data = request.POST

    profile_picture = request.FILES["picture"]
    name = data["name"]
    teacher = data["teacher"] == "true"
    code = data["code"]
    profile = request.user.profile

    print(profile.picture.name, "profile-pics/"+profile_picture.name)

    if Profile.objects.filter(name=name).count() > 1:
        return Response({"error": "User already exists with that name"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if teacher and code == "ABCDEFt":
            user = request.user
            profile = user.profile
            user.is_teacher = teacher
            if profile.picture.name != "profile-pics/"+profile_picture.name: profile.picture = profile_picture
            profile.name = name
            user.save()
            profile.save()
        elif not teacher and code == "ABCDEF":
            user = request.user
            profile = user.profile
            user.is_teacher = teacher
            if profile.picture.name != "profile-pics/"+profile_picture.name: profile.picture = profile_picture
            profile.name = name
            user.save()
            profile.save()
        else:
            return Response({"error": "School code does not match"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"success", "Profile has been successfully updated"})

@api_view(["POST"])
def change_email(request):
    user = request.user
    new_email = request.data["email"]
    if UserAccount.objects.filter(email=new_email).exists():
        return Response({"error": "User already exists with that email"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        user.email = new_email
        user.email_active = False
        user.save()
        subject = "Activate your account"
        message = render_to_string("sessionauth/acc_activate_email.html", {
            "user": user.profile,
            "domain": "192.168.8.145:3000",
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": default_token_generator.make_token(user)
        })
        to_email = user.email
        send_mail(subject, message, None, [to_email], fail_silently=False)
        return Response({"success": "Email has been successfully updated"})

@api_view(["POST"])
def change_password(request):
    user = request.user
    password = request.data["password"]
    re_password = request.data["rePassword"]

    if password == re_password:
        password = PasswordToBeVerified(password=password, user=user)
        password.save()
        subject = "Verify password change"
        message = render_to_string("sessionauth/acc_verify_password_change.html", {
            "user": user.profile,
            "domain": "192.168.8.145:3000",
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": default_token_generator.make_token(user)
        })
        to_email = user.email
        send_mail(subject, message, None, [to_email], fail_silently=False)
        return Response({"success": "password has been stored"})
    else:
        return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
@csrf_protect
def reset_password(request):
    data = request.data

    email = data["email"]
    password = data["password"]
    re_password = data["rePassword"]

    user = UserAccount.objects.filter(email=email).exists()
    if user:
        user = UserAccount.objects.get(email=email)
        if password == re_password:
            password = PasswordToBeVerified(user=user, password=password)
            password.save()
            subject = "Verify password reset"
            message = render_to_string("sessionauth/acc_verify_password_reset.html", {
                "user": user.profile,
                "domain": "192.168.8.145:3000",
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "token": default_token_generator.make_token(user)
            })
            to_email = user.email
            send_mail(subject, message, None, [to_email], fail_silently=False)
            return Response({"success": "password has been stored"})
        else:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
def delete_account(request):
    try:
        user = request.user
        if user.profile.picture.name != "profile-pics/default.png": os.remove(user.profile.picture.path)
        user.delete()
        return Response({"success": "User deleted successfully"})
    except:
        return Response({"error": "Something went wrong deleting user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_user(request):
    try:
        user = request.user
        profile = user.profile
        return Response({"email": user.email, "name": profile.name, "isTeacher": user.is_teacher, "picture": profile.picture.url})
    except:
        return Response({"error": "Something went wrong getting user information"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_profile_picture(request):
    profile = request.user.profile
    return FileResponse(open(profile.picture.path, "rb"), as_attachment=False)

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({"success": "CSRF Cookie Set"})
