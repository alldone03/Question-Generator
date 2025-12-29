rm -r migrations
flask db init
flask db migrate -m "initial tables" # Generate migration otomatis
flask db upgrade # terapkan database


#unitest
python -m unittest discover -s tests
python run_seeeder.py
python run_seeder_2.py
python app.py