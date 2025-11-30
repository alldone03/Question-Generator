from app import create_app
from seeder.user_seeder import run

app = create_app()

with app.app_context():
    run()