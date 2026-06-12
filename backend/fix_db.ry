from database import SessionLocal
from models.exercise import Exercise

db = SessionLocal()
db.query(Exercise).filter(Exercise.id > 1).delete()
exercises = [
    Exercise(name='Пас в стенку', category='Передачи', age_min=6, age_max=17, duration_minutes=8, min_players=2, max_players=20, equipment='мячи', description='Игрок делает пас партнёру и получает обратно'),
    Exercise(name='Ведение через конусы', category='Ведение мяча', age_min=6, age_max=17, duration_minutes=10, min_players=4, max_players=20, equipment='мячи, конусы', description='Ведение мяча змейкой через расставленные конусы'),
    Exercise(name='Удар по воротам', category='Удары', age_min=8, age_max=17, duration_minutes=12, min_players=4, max_players=16, equipment='мячи, ворота', description='Удары по воротам с разных позиций'),
    Exercise(name='Квадрат 4v1', category='Передачи', age_min=9, age_max=17, duration_minutes=10, min_players=5, max_players=10, equipment='мячи, конусы', description='Четыре игрока делают передачи не давая пятому завладеть мячом'),
    Exercise(name='Рывки с мячом', category='Скорость', age_min=8, age_max=17, duration_minutes=8, min_players=4, max_players=20, equipment='мячи, конусы', description='Ускорение с мячом на короткие дистанции'),
    Exercise(name='Игра 1 в 1', category='Игра 1v1', age_min=8, age_max=17, duration_minutes=10, min_players=4, max_players=16, equipment='мячи, ворота', description='Один защитник против одного нападающего'),
    Exercise(name='Прыжки через барьеры', category='Координация', age_min=6, age_max=17, duration_minutes=8, min_players=4, max_players=20, equipment='барьеры', description='Прыжки через низкие барьеры на двух и одной ноге'),
    Exercise(name='Мини игра 3v3', category='ОФП', age_min=7, age_max=17, duration_minutes=15, min_players=6, max_players=12, equipment='мячи, ворота', description='Небольшая игра на маленьком поле'),
    Exercise(name='Растяжка в круге', category='ОФП', age_min=6, age_max=17, duration_minutes=5, min_players=4, max_players=30, equipment='', description='Групповая растяжка мышц в конце тренировки'),
    Exercise(name='Жонглирование мячом', category='Координация', age_min=6, age_max=17, duration_minutes=8, min_players=1, max_players=30, equipment='мячи', description='Удары по мячу не давая ему упасть на землю'),
]
for e in exercises:
    db.add(e)
db.commit()
print('Готово! Добавлено', len(exercises), 'упражнений')
db.close()