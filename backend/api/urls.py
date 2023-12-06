from django.urls import path
from . import views

urlpatterns = [
    path("routes/", views.get_routes, name="get-routes"),
    path("chapters/", views.get_chapters, name="get-chapters"),
    path("chapters/<str:pk>", views.get_chapter, name="get-chapter"),
    path("chapters/create/", views.create_chapter, name="create-chapter"),
    path("chapters/<str:pk>/update/", views.update_chapter, name="update-chapter"),
    path("chapters/<str:pk>/delete/", views.delete_chapter, name="delete-chapter"),
    path("chapters/<str:pk>/post/", views.create_post, name="create-post"),
    path("chapters/<str:pk>/posts/", views.get_posts, name="get-posts"),
    path("download/", views.download_file, name="download-file")
]
