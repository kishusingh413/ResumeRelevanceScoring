import os
import jwt
import json
from django.conf import settings
from django.http import JsonResponse, FileResponse
from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny

from .models import Task, ResumeFile
from .serializers import ResumeFileSerializer
from .utils.extraction import extract_details
from .utils.scoring import score_resume_details
from .utils.auth import Authentication

@api_view(['POST'])
@permission_classes([AllowAny])
def create_task(request):
    try:
        task = Task.objects.create()

        exp = datetime.now() + timedelta(hours=24)
        payload = {'id': str(task.id), 'exp': exp.timestamp()}
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return JsonResponse({'message': 'Task created successfully', 'access_token': token}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['POST'])
@authentication_classes([Authentication])
def upload_files(request):
    try:
        task_id = getattr(request, 'task_id', None)
        task = Task.objects.get(id=task_id)
        files = request.FILES.getlist('files')
        for file in files:
            ResumeFile.objects.create(task=task, file=file)
        return JsonResponse({'message': 'Files uploaded successfully'}, status=201)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task does not exist'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['DELETE'])
@authentication_classes([Authentication])
def delete_file(request, file_id):
    try:
        file_to_delete = ResumeFile.objects.get(id=file_id, task_id=request.task_id)
        file_to_delete.delete()

        return JsonResponse({'message': 'File deleted successfully'}, status=204)
    except ResumeFile.DoesNotExist:
        return JsonResponse({'error': 'File does not exist'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def serve_file(request, file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, 'resumes', file_name)
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'), content_type='application/pdf')
    else:
        return JsonResponse({'error': 'The requested pdf was not found'}, status=404)

@api_view(['PUT'])
@authentication_classes([Authentication])
def run_task(request):
    try:
        task_id = getattr(request, 'task_id', None)
        task = Task.objects.get(id=task_id)
        task.role = request.data.get('role')
        task.description = request.data.get('description')
        task.save()
        resume_files = ResumeFile.objects.filter(task=task)

        for resume_file in resume_files:
            if not resume_file.details:
                details = extract_details(resume_file.file.path)
                resume_file.details = json.dumps(details)
            else:
                details = json.loads(resume_file.details)
            
            resume_details = score_resume_details(task.role, task.description, details)
            resume_file.relevance_score = json.loads(resume_details)['relevance_score']
            resume_file.details = resume_details
            resume_file.save()

        serialized_files = ResumeFileSerializer(resume_files, many=True)
        return JsonResponse(serialized_files.data, safe=False, status=200)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task does not exist'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
