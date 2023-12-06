from django.db import models
from django.contrib.auth.models import BaseUserManager, PermissionsMixin, AbstractBaseUser

# Create your models here.

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password, is_teacher=False, **extra_fields):
        if not email:
            raise ValueError("User must have email address")
        email = self.normalize_email(email)
        user = self.model(email=email, is_teacher=is_teacher, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")
        return self.create_user(email, password, True, **extra_fields)

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_teacher = models.BooleanField(default=False)
    email_active = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserAccountManager()

    def get_full_name(self):
        return self.email
    
    def get_short_name(self):
        return self.email

    def __str__(self):
        return self.email

class PasswordToBeVerified(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE, primary_key=True)
    password = models.CharField(max_length=20)

class Profile(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE, primary_key=True)
    picture = models.ImageField(upload_to="profile-pics/", default="profile-pics/default.png")
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name