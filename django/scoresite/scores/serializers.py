from rest_framework import serializers
from .models import Score

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ['rank', 'score', 'max_combo', 'max_possible_combo', 'perfect', 'great', 'okay', 'miss']