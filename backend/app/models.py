from django.db import models

class Task(models.Model):
    role = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

class ResumeFile(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    file = models.FileField(upload_to='resumes/')
    details = models.TextField(blank=True, null=True)
    relevance_score = models.FloatField(default=0.0)

