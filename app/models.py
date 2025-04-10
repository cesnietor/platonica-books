from django.db import models


class Book(models.Model):
    name = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")

    def __str__(self):
        return self.name


class Review(models.Model):
    # We might want to preserve the review even if the book gets deleted.
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return self.text
