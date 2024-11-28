from django.urls import path
from .views import create_task, upload_files, run_task, serve_file

urlpatterns = [
    path('create-task/', create_task, name='create_task'),
    path('upload-files/', upload_files, name='upload_files'),
    path('run-task/', run_task, name='run_task'),
    path('serve-resume/<str:file_name>/', serve_file, name='serve_file'),
]
