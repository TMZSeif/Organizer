from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import FileResponse
from .models import *
from .serializers import *

# Create your views here.


@api_view(["GET"])
def get_routes(request):
    data = [
        {
            "endpoint": "/chapters/",
            "methods": ["GET"],
            "body": None,
            "description": "Get list of all chapters",
        },
        {
            "endpoint": "/chapters/id",
            "methods": ["GET"],
            "body": None,
            "description": "Get data of one chapter",
        },
        {
            "endpoint": "/chapters/create",
            "methods": ["POST"],
            "body": {"name": ""},
            "description": "Create a chapter",
        },
        {
            "endpoint": "/chapters/id/update",
            "methods": ["PUT"],
            "body": {"name": ""},
            "description": "Update an existing chapter",
        },
        {
            "endpoint": "/chapters/id/delete",
            "methods": ["DELETE"],
            "body": None,
            "description": "delete an existing chapter",
        },
        {
            "endpoint": "/chapters/id/post",
            "methods": ["POST"],
            "body": {"text": "", "file": "", "chapter": ""},
            "description": "Post a new announcement, note, or classified file in a chapter",
        },
        {
            "endpoint": "/chapters/id/posts",
            "methods": ["GET"],
            "body": None,
            "description": "Get list of all posts in chapter",
        },
        {
            "endpoint": "/accounts/id",
            "methods": ["GET"],
            "body": None,
            "description": "Get data of existing user",
        },
        {
            "endpoint": "/accounts/register",
            "methods": ["POST"],
            "body": {
                "student_or_teacher": "",
                "username": "",
                "email": "",
                "password1": "",
                "password2": "",
                "school_code": "",
            },
            "description": "Create a User",
        },
        {
            "endpoint": "/user/id/update",
            "methods": ["PUT"],
            "body": {"username": "", "email": "", "profile_picture": ""},
            "description": "Update your profile",
        },
        {
            "endpoint": "/user/id/delete",
            "methods": ["DELETE"],
            "body": None,
            "description": "Delete your account",
        },
    ]

    return Response(data)


@api_view(["GET"])
def get_chapters(request):
    chapters = Chapters.objects.all().order_by("date")
    serializer = ChapterSerializer(chapters, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def get_chapter(request, pk):
    chapter = Chapters.objects.get(id=pk)
    serializer = ChapterSerializer(chapter)

    return Response(serializer.data)


@api_view(["POST"])
def create_chapter(request):
    data = request.data
    chapter = Chapters.objects.create(name=data["name"])
    serializer = ChapterSerializer(chapter)

    return Response(serializer.data)


@api_view(["PUT"])
def update_chapter(request, pk):
    data = request.data
    chapter = Chapters.objects.get(id=pk)
    chapter.name = data["name"]
    chapter.save()
    serializer = ChapterSerializer(chapter)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_chapter(request, pk):
    chapter = Chapters.objects.get(id=pk)
    chapter.delete()

    return Response("Chapter is deleted")


@api_view(["POST"])
def create_post(request, pk):
    text = request.POST["text"]
    if request.FILES:
        file = request.FILES["file"]
    else:
        file = None
    chapter = Chapters.objects.get(id=pk)
    if text == "": text = None
    post = Posts.objects.create(
        text=text, file=file, chapter_id=chapter
    )
    serializer = PostSerializer(post)

    return Response(serializer.data)


@api_view(["GET"])
def get_posts(request, pk):
    chapter = Chapters.objects.get(id=pk)
    posts = chapter.posts_set.all()
    serializer = PostSerializer(posts, many=True)

    return Response(serializer.data)

def download_file(request):
    return FileResponse(open(request.GET["url"][1:], "rb"), as_attachment=True)