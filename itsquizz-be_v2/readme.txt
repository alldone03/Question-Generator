rm -r migrations
flask db init
flask db migrate -m "initial tables" # Generate migration otomatis
flask db upgrade # terapkan database


#unitest
python -m unittest discover -s tests
python run_seeeder.py
python run_seeder_2.py
python app.py




# migration
flask db init # only first action
flask db migrate -m "add feedback to module"
flask db upgrade
python -m seeders.run

flask db downgrade -1 #jika salah
#check status
flask db current
flask db history


#seeder
python -m seeders.run