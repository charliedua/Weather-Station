import serial
import math
import MySQLdb
from datetime import datetime


# this port address is for the serial tx/rx pins on the GPIO header
SERIAL_PORT = '/dev/ttyS0'
# be sure to set this to the same rate used on the Arduino
SERIAL_RATE = 9600

R1 = 10000  # value of internal resistor on board

# steinhart-hart coeficients for thermistor
c1 = 0.001129148
c2 = 0.000234125
c3 = 0.0000000876741
query_data_buffer = []
def main():
    ser = serial.Serial(SERIAL_PORT, SERIAL_RATE)
    dbconn = MySQLdb.connect("159.89.210.147", "charlie", "asd123", "Weather_Station")

    c = dbconn.cursor()
    c.execute('SET autocommit = 0')
    dbconn.commit()
    # print(dbconn)
    try:
        while True:
            for i in range(5):
                reading = ser.readline()
                reading = reading.decode('ascii').split(';')
                Analog_temp = float(reading[3])
                R2 = R1 * (1023.0 / Analog_temp - 1.0)
                logR2 = math.log(R2)
                T = (1.0 / (c1 + c2*logR2 + c3*logR2*logR2*logR2)) - 273.15 # Temp in C
                avgTemp = (T + float(reading[1])) / 2

                f = open("threshold.number", 'r')
                values_arr = f.read().split(";")
                values_to_arduino = ""
                f.close()
                if avgTemp >= float(values_arr[0]):
                    values_to_arduino += "TON;"
                else:
                    values_to_arduino += "TOF;"
                
                if float(reading[0]) >= float(values_arr[1]):
                    values_to_arduino += "HON;"
                else:
                    values_to_arduino += "HOF;"
                
                if float(reading[2]) >= float(values_arr[2]):
                    values_to_arduino += "LON"
                else:
                    values_to_arduino += "LOF"
                
                ser.write(values_to_arduino.encode())

                query_data_buffer.append(("%.2f" % T, "%.2f" % float(reading[1]), reading[0], reading[2], datetime.now().strftime(f"%Y/%m/%d %H:%M:%S")))
                print(i, query_data_buffer, '\n')
            # c.executemany("INSERT INTO `SensorData` (`Temprature`, `Humidity`, `Light`,`DateTime`) VALUES (%s, %s, %s,%s);", query_data_buffer)
            c.executemany("INSERT INTO `logs` (`temp`, `temp2`, `humidity`, `light`, `DateTime`) VALUES (%s, %s, %s,%s, %s);", query_data_buffer)
            query_data_buffer.clear()
            dbconn.commit()
            # INSERT INTO logs (light, temp, temp2, humidity) values (%s, %s, %s, %s)
    except KeyboardInterrupt:
        print("BYE")
    finally:
        c.executemany("INSERT INTO `logs` (`temp`, `temp2`, `humidity`, `light`, `DateTime`) VALUES (%s, %s, %s,%s, %s);", query_data_buffer)
        dbconn.commit()
        dbconn.close()


if __name__ == "__main__":
    main()
