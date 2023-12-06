from __future__ import annotations
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
import os
import uuid


# Create your models here.

class Posts(models.Model):
    text = models.CharField(max_length=200, null=True)
    file = models.FileField(upload_to="notes-and-classified", null=True)
    chapter_id = models.ForeignKey("Chapters", on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)


class Chapters(models.Model):
    name = models.CharField(max_length=50)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField(auto_now_add=True)


@receiver(models.signals.post_delete, sender=Posts)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)