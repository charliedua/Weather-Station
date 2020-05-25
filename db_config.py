from app import app
from flaskext.mysql import MySQL

mysql = MySQL()

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'charlie'
app.config['MYSQL_DATABASE_PASSWORD'] = 'asd123'
app.config['MYSQL_DATABASE_DB'] = 'Weather_Station'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql.init_app(app)
