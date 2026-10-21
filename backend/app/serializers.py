from rest_framework import serializers
from .models import Task, ResumeFile
import json
import os

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class ResumeFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeFile
        fields = ['id', 'file', 'details']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation['file']:
            file_path = representation['file']
            filename = os.path.basename(file_path)
            representation['file'] = filename

        if representation['details']:
            details = json.loads(representation['details'])
            if isinstance(details, str):
                details = json.loads(details)
            del representation['details']
            if isinstance(details, dict):
                for key, value in details.items():
                    representation[key] = value
        representation['relevance_score'] = representation.get('relevance_score', instance.relevance_score)
        return representation