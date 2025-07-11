import uuid

from django.db import models


class Book(models.Model):
    """Book read information for user"""

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    ## Fallback values in case book on third-party
    ## book library (Google Books) doesn't exist
    title = models.CharField(max_length=200)
    authors = models.CharField(max_length=200, blank=True, null=True)
    ##
    date_published = models.DateTimeField(null=True)
    date_started = models.DateTimeField(null=True)
    date_finished = models.DateTimeField(null=True)
    google_books_id = models.CharField(
        max_length=64, unique=True, blank=True, null=True
    )

    def __str__(self):
        return self.name


class Review(models.Model):
    # We might want to preserve the review even if the book gets deleted.
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    title = models.CharField(max_length=70)
    text = models.TextField()
    content = models.JSONField(blank=True, null=True, default=list)

    def __str__(self):
        return self.text
