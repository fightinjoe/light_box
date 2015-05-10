#include <Wire.h>
#include "Adafruit_TCS34725.h"

/* Example code for the Adafruit TCS34725 breakout library */

/* Connect SCL    to analog 5
   Connect SDA    to analog 4
   Connect 3v3    to digital 7 or 8
   Connect GROUND to common ground */

int sensorA = 7;  // digital pin 7 powers sensor A
int sensorB = 8;  // digital pin 8 powers sensor B

const int switchPin = 12;
const int ledPin = 13;

int switchState = 0;

void setup(void) {
  Serial.begin(9600);
  pinMode(sensorA, OUTPUT);  // set pin to power sensorA
  pinMode(sensorB, OUTPUT);  // set pin to power sensorB

  pinMode(ledPin, OUTPUT);
  pinMode(switchPin, INPUT);
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
      sensorON(tcs, pin, j);
      // delay(1000);
    }
    
    digitalWrite(pin, LOW);
}

bool checkSwitch() {
    switchState = digitalRead(switchPin);
    digitalWrite( ledPin, switchState );
    return switchState == HIGH;
}

// create function to call the sensor depending on the pin desired
void sensorON(Adafruit_TCS34725 tcs, int pin, int index){
  uint16_t clear, red, green, blue;

  delay(60);  // takes 50ms to read 
  
  tcs.getRawData(&red, &green, &blue, &clear);

  // Figure out some basic hex code for visualization
  uint32_t sum = clear;
  float r, g, b;
  r = red; r /= sum;
  g = green; g /= sum;
  b = blue; b /= sum;
  r *= 256; g *= 256; b *= 256;
  
  if( checkSwitch() ) {
      Serial.println("partymode");
  } else if(index == 1) { 
      Serial.print("rgb ");Serial.print(pin);Serial.print(index);Serial.print(": ");
      Serial.print((int)r);Serial.print(",");
      Serial.print((int)g);Serial.print(",");
      Serial.print((int)b);
      Serial.println();
  }

}
