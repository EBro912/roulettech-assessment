from django.db import models

# Create your models here.

class Score(models.Model):
    rank = models.CharField(max_length = 1, default = 'F')
    score = models.IntegerField()
    max_combo = models.IntegerField()
    max_possible_combo = models.IntegerField()
    perfect = models.IntegerField()
    great = models.IntegerField()
    okay = models.IntegerField()
    miss = models.IntegerField()

    def __str__(self):
        return f'{self.rank},{self.score},{self.max_combo},{self.max_possible_combo},{self.perfect},{self.great},{self.okay},{self.miss}'
