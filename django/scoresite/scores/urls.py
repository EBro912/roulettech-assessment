from django.urls import path
from .views import ScoreList, ScoreRemove

# define endpoints
urlpatterns = [
    path('scores/', ScoreList.as_view(), name='list-scores'),
    path('scores/delete/<int:score>/', ScoreRemove.as_view(), name='delete-score')
]