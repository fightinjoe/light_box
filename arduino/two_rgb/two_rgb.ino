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
    
    for(int j = 0; j < 2; j++){
      sensorON(tcs, j);
      // delay(1000);
    }
    
    digitalWrite(pin, LOW);
}

// create function to call the sensor depending on the pin desired
void sensorON(Adafruit_TCS34725 tcs, int index){
  //uint16_t r, g, b, c, colorTemp, lux;
  uint16_t clear, red, green, blue;

//  tcs.getRawData(&r, &g, &b, &c);

//  if(index > 1) {
//    Serial.print("#"); Serial.print(r,HEX); Serial.print(g,HEX); Serial.print(b,HEX); Serial.println("");
//  }

  delay(60);  // takes 50ms to read 
  
  tcs.getRawData(&red, &green, &blue, &clear);

  // Figure out some basic hex code for visualization
  uint32_t sum = clear;
  float r, g, b;
  r = red; r /= sum;
  g = green; g /= sum;
  b = blue; b /= sum;
  r *= 256; g *= 256; b *= 256;
  
  Serial.print(index);Serial.print(": ");
  Serial.print((int)r);Serial.print(",");
  Serial.print((int)g);Serial.print(",");
  Serial.print((int)b);
  Serial.println();

}
