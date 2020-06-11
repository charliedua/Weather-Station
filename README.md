# Weather-Station

## Sensors
In our system, we make use of two temperature sensors, a humidity sensor and a light sensor. Data from these sensors is being sent to the Arduino to be processed by its Sketch.

## Components
Components in the hardware system include a Fan and multiple LEDs. These components will be activated based on whether the value of data given by a particular sensor is above or below a threshold value set by the user on the frontend. The threshold value is being stored in the raspberry pi device as a .txt file, and can be modified by the user through the frontend where individual thresholds for temperature, humidity and light sensors can be changed and overwritten.
In particular, the Fan will turn on when the temperature threshold is exceeded. A bright LED will turn on when the luminosity threshold isn’t being met, and another LED will turn on (in place of a dehumidifier) when the humidity threshold is met.

## Arduino
The Arduino is responsible for reading input from sensors, as well as controlling attached hardware components, such as the fan, based on instructions from raspberry pi. Essentially, the Arduino is acting as a mediator between the sensors, components and raspberry pi. 

As the Arduino receives values from its sensors, the Arduino will then forward that data to the Raspberry Pi via serial communication. Once the Raspberry Pi has finished processing that information, going through the stored value of threshold.txt, frontend and API, it will then potentially receive instructions from Raspberry Pi to turn on various components or not. If instructions were given from Raspberry Pi, it will then turn on the components such as Fan or LEDs.

## Raspberry Pi
This is where the brain of the entire circuit is, where data is sent to and then processed further. The Raspberry Pi communicates with almost everything in this IoT system except for sensors and components.

The raspberry Pi's main purpose is to serve the API and the frontend as well as hold the threshold file. It sends requests to API and also inserts information into the SQL server. It connects to the SQL server directly and inserts data into the database. We’ve also created a Flask Web Server which hosts the API which is served by the Raspberry PI. As well as a web interface which also displays the main weather station data and information in a user-friendly way.

## SQL Server (Cloud Virtual Machine)
We’ve created a virtual machine hosted by DigitalOcean which is responsible for serving our SQL server. This was done as it was the expectation to have our database hosted in the cloud. In the virtual machine, we’ve created a MariaDB database which contains all of our data and is the location we read and write to when dealing with data. We have a static IP provided by DigitalOcean which we use so that we can access the server’s database remotely.

## API
The API is responsible for providing information to the frontend, where the data is being displayed. We have created a Flask server which logs into an SQL server using the credentials that we provided it with. Once that is done, we have access to the database of the Weather Station. We have also created endpoints which display the data from the database, and these can be accessed externally.

## Frontend
The frontend was coded using javascript, here we’ve used a javascript chart library which helped in the development of the graphs displayed. In the frontend, it's sending requests to the API to receive existing data from the database in the SQL server. We also use the API to handle modifying of the threshold.txt which stores the value of threshold(s).

## Threshold files
Here in the threshold files, there is a simple text file which holds threshold values, which are read by the Raspberry Pi to determine if it should instruct the Arduino to turn on (or off) various components. The threshold text file is acting like a database which holds a set of small values that can be overwritten by the API.

