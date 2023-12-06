from rest_framework.serializers import ModelSerializer
from .models import *


# class UserSerializer(ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ("username", "email", "password", "profile_picture")


class ChapterSerializer(ModelSerializer):
    class Meta:
        model = Chapters
        fields = "__all__"


class PostSerializer(ModelSerializer):
    class Meta:
        model = Posts
        fields = "__all__"
