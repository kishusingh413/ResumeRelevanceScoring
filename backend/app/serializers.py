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
            del representation['details']
            for key, value in details.items():
                representation[key] = value
        return representation