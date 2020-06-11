import MySQLdb
from app import app
from flask import jsonify
from flask import flash, request
from werkzeug.security import generate_password_hash, check_password_hash


@app.route('/')
def index():
    return "Welcome to the Weather API! Add more stuff in here? potentially what endpoints to use?"

@app.route('/logs')
def logs():
    try:
        conn = MySQLdb.connect('159.89.210.147', 'charlie', 'asd123', 'Weather_Station')
        cursor = conn.cursor()
        cursor.execute('SET autocommit = 0')
        cursor.execute("SELECT * FROM logs limit 50;")
        rows = cursor.fetchall()
        resp = jsonify(rows)
        resp.status_code = 200
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close()

@app.route('/logs/getData', methods=['GET'])
def getData():
    start_datetime = request.args.get("start_datetime")
    end_datetime = request.args.get("end_datetime")

    query = "SELECT * FROM `logs` WHERE `DateTime` BETWEEN '" + start_datetime + "' AND '" + end_datetime + "' ORDER BY `DateTime` DESC LIMIT 2500;"
    try:
        conn = MySQLdb.connect('159.89.210.147', 'charlie', 'asd123', 'Weather_Station')
        cursor = conn.cursor()
        cursor.execute('SET autocommit = 0')
        cursor.execute(query)
        rows = cursor.fetchall()
        resp = jsonify(rows)
        print(jsonify(rows))
        resp.status_code = 200
        resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close()
    
    return resp

@app.route('/setThreshold', methods=['GET'])
def setThreshold():
    threshold = request.args.get("threshold")
    f = open("/home/pi/threshold.number", "w")
    f.write(threshold)
    f.close()
    resp = jsonify(r'\{\}')
    resp.status_code = 200
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp

# @app.route('/logs/add', methods=['POST'])
# def add_Log():
#     try:
#         _json = request.json
#         print(_json)
#         _light = _json['light']
#         _temp = _json['temp']
#         _temp2 = _json['temp2']
#         _humidity = _json['humidity']


#         # validate the received values
#         if _light and _temp and _temp2 and _humidity and request.method == 'POST':
#             sql = "INSERT INTO logs (light, temp, temp2, humidity) values (%s, %s, %s, %s)"
#             data = (_light, _temp, _temp2, _humidity)

#             conn = mysql.connect()
#             cursor = conn.cursor()
#             cursor.execute(sql, data)
#             conn.commit()
#             resp = jsonify('Log added successfully!')
#             resp.status_code = 200
#             return resp
#         else:
#             return not_found()
#     except Exception as e:
#         print(e)
#     finally:
#         cursor.close()
#         conn.close()

@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Not Found: ' + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404

    return resp
        
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
