#include <Wire.h>
#include "Adafruit_TCS34725.h"

/* Example code for the Adafruit TCS34725 breakout library */

/* Connect SCL    to analog 5
   Connect SDA    to analog 4
   Connect VDD    to 3.3V DC
   Connect GROUND to common ground */
   
/* Initialise with default values (int time = 2.4ms, gain = 1x) */
// Adafruit_TCS34725 tcs = Adafruit_TCS34725();

/* Initialise with specific int time and gain values */
//Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_700MS, TCS34725_GAIN_1X);

uint16_t r, g, b, c, colorTemp, lux = 0;  // define values for color sensor readings, initialize to 0

int sensorA = 7;  // digital pin 7 powers sensor A
int sensorB = 8;  // digital pin 8 powers sensor B

void setup(void) {
  Serial.begin(9600);
  pinMode(sensorA, OUTPUT);  // set pin to power sensorA
  pinMode(sensorB, OUTPUT);  // set pin to power sensorB
}

void loop(void) {
  loopSensor(sensorA);
  loopSensor(sensorB);
}

void loopSensor(int pin) {
    Serial.print("Sensor "); Serial.print(pin); Serial.println("");
    digitalWrite(pin, HIGH);
    Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_700MS, TCS34725_GAIN_1X);
    for(int j = 0; j < 10; j++){
      sensorON(tcs, j);
    }
    digitalWrite(pin, LOW);
}

// create function to call the sensor depending on the pin desired
void sensorON(Adafruit_TCS34725 tcs, int index){
  uint16_t r, g, b, c, colorTemp, lux;
  // "pin" is determined in the main loop, and is the pin for the sensor that is getting powered on

  // initialize sensor values each time the function gets called
  // Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_700MS, TCS34725_GAIN_1X);

  // collect data from color sensor
  tcs.getRawData(&r, &g, &b, &c);
//  colorTemp = tcs.calculateColorTemperature(r, g, b);
//  lux = tcs.calculateLux(r, g, b);
  
  // display data
  
  /*  Serial.print("Color Temp: "); Serial.print(colorTemp, DEC); Serial.print(" K - ");
  Serial.print("Lux: "); Serial.print(lux, DEC); Serial.print(" - ");
  Serial.print("R: "); Serial.print(r, DEC); Serial.print(" ");
  Serial.print("G: "); Serial.print(g, DEC); Serial.print(" ");
  Serial.print("B: "); Serial.print(b, DEC); Serial.print(" ");
  Serial.print("C: "); Serial.print(c, DEC); Serial.print(" ");
  Serial.println(" ");*/

  if(index > 1) {
    Serial.print("#"); Serial.print(r,HEX); Serial.print(g,HEX); Serial.print(b,HEX); Serial.println("");
  }

}
