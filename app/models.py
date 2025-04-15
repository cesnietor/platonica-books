import uuid
from django.db import models


class Book(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")
    google_books_id = models.CharField(
        max_length=64, unique=True, blank=True, null=True
    )

    def __str__(self):
        return self.name


class Review(models.Model):
    # We might want to preserve the review even if the book gets deleted.
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return self.text
