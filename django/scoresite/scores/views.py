from rest_framework import generics
from .models import Score
from .serializers import ScoreSerializer

# Create your views here.

# endpoint for handling listing and creating scores
class ScoreList(generics.ListCreateAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer

# endpoint for handling deleteing scores
# a problem with this is that it should handle when there are duplicate scores
# also it should lookup more than just the score field in a production environment
class ScoreRemove(generics.DestroyAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
    lookup_field = 'score'