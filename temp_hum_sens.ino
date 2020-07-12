#include "DHT.h"
#define P_RESISTOR A0 // Photoresistor at Arduino analog pin A0
#define KY013 A1 // Analog temp sensor at A1
#define Motor 7
DHT dht;

String incoming = "";

int photo_value;
int analog_temp_value;
float humidity;
float temperature;

int val;

void setup()
{
  Serial.begin(9600);
  dht.setup(8); // data pin 8
  pinMode(P_RESISTOR, INPUT);// Set photo Resistor - A0 pin as an input
  pinMode(KY013, INPUT);// Set Analog Temp sensor - A1 pin as an input
  pinMode(Motor, OUTPUT);
  pinMode(12, OUTPUT);
  digitalWrite(Motor, LOW);
  // digitalWrite(12, HIGH);
}

void loop()
{
  delay(2000);
  
  photo_value = analogRead(P_RESISTOR);
  analog_temp_value = analogRead(KY013);
  humidity = dht.getHumidity();
  temperature = dht.getTemperature();
  
  Serial.print(
      String(humidity) + ';' + 
      String(temperature) + ';' + 
      String(photo_value) + ';' + 
      String(analog_temp_value)+ ';' + '\n');

  delay(1000); // 1 second for the response
  
  if (Serial.available() > 0) {
    incoming = Serial.readString();
    if(incoming.substring(0,3) == "TON")
    {
      digitalWrite(Motor, HIGH);
    }
    else
    {
      digitalWrite(Motor, LOW);
    }
    if(incoming.substring(4,7) == "HON")
    {
        digitalWrite(12, HIGH);
    }
    else
    {
        digitalWrite(12, LOW);
    }

    if(incoming.substring(8,11) == "LON")
    {
        //Serial.write("DEBUG LIGHT");
        analogWrite(A3, 1023);
        analogWrite(A4, 1023);
        analogWrite(A5, 1023);
    }
    else
    {
        analogWrite(A3, 0);
        analogWrite(A4, 0);
        analogWrite(A5, 0);
    }
  }
}
