/*
  Example for different sending methods
  
  http://code.google.com/p/rc-switch/
  
*/

#include <RCSwitch.h>
#include <OneWire.h>

const int humidite = 1;
const int ana_temp=0;
OneWire  ds(2);  // on pin 10 (a 4.7K resistor is necessary)
RCSwitch mySwitch = RCSwitch();
const int vent = 3;
volatile int compteur = 0;
volatile int tmp = 0;
int efficientData = 1;
int temps = 0;

void setup() {

  Serial.begin(9600);
  pinMode(humidite, INPUT);
  // Transmitter is connected to Arduino Pin #10  
  mySwitch.enableTransmit(10);

  // Optional set pulse length.
  // mySwitch.setPulseLength(320);
  
  // Optional set protocol (default is 1, will work for most outlets)
   mySwitch.setProtocol(2);
  
  // Optional set number of transmission repetitions.
  // mySwitch.setRepeatTransmit(15);
  pinMode(vent, INPUT);
  attachInterrupt(1,callback,CHANGE);
}
void callback() {
  if (tmp >=1) {
    compteur +=1;
          tmp = 0;
        } else
          tmp ++;
      
}
float Temperature() {
  
      boolean debug = false;
      byte i;
      byte present = 0;
      byte type_s;
      byte data[12];
      byte addr[8];
      float celsius, fahrenheit;
      
      if ( !ds.search(addr)) {
        /*
        if(debug)
        {
        Serial.println("No more addresses.");
        Serial.println();
        }
        */
        ds.reset_search();
        delay(250);
        return -666;
      }
      
      /*
      if(debug)
      {
      
        Serial.print("ROM =");
        for( i = 0; i < 8; i++) {
          Serial.write(' ');
          Serial.print(addr[i], HEX);
        }
    
      }
      */
      if (OneWire::crc8(addr, 7) != addr[7]) {
          Serial.println("CRC is not valid!");
          return -666;
      }
      Serial.println();
     
      // the first ROM byte indicates which chip
      if(debug)
      {
      
          switch (addr[0]) {
            case 0x10:
              Serial.println("  Chip = DS18S20");  // or old DS1820
              type_s = 1;
              break;
            case 0x28:
              Serial.println("  Chip = DS18B20");
              type_s = 0;
              break;
            case 0x22:
              Serial.println("  Chip = DS1822");
              type_s = 0;
              break;
            default:
              Serial.println("Device is not a DS18x20 family device.");
              return -666;
          } 
      }
      ds.reset();
      ds.select(addr);
      ds.write(0x44, 1);        // start conversion, with parasite power on at the end
      
      delay(1000);     // maybe 750ms is enough, maybe not
      // we might do a ds.depower() here, but the reset will take care of it.
      
      present = ds.reset();
      ds.select(addr);    
      ds.write(0xBE);         // Read Scratchpad
    
      if(debug)
      {
        Serial.print("  Data = ");
        Serial.print(present, HEX);
        Serial.print(" ");
      }
      for ( i = 0; i < 9; i++) {           // we need 9 bytes
        data[i] = ds.read();
        if(debug)
        {
          Serial.print(data[i], HEX);
          Serial.print(" ");
        }
      }
      if(debug)
      {
        Serial.print(" CRC=");
        Serial.print(OneWire::crc8(data, 8), HEX);
        Serial.println();
      }
      // Convert the data to actual temperature
      // because the result is a 16 bit signed integer, it should
      // be stored to an "int16_t" type, which is always 16 bits
      // even when compiled on a 32 bit processor.
      int16_t raw = (data[1] << 8) | data[0];
      if (type_s) {
        raw = raw << 3; // 9 bit resolution default
        if (data[7] == 0x10) {
          // "count remain" gives full 12 bit resolution
          raw = (raw & 0xFFF0) + 12 - data[6];
        }
      } else {
        byte cfg = (data[4] & 0x60);
        // at lower res, the low bits are undefined, so let's zero them
        if (cfg == 0x00) raw = raw & ~7;  // 9 bit resolution, 93.75 ms
        else if (cfg == 0x20) raw = raw & ~3; // 10 bit res, 187.5 ms
        else if (cfg == 0x40) raw = raw & ~1; // 11 bit res, 375 ms
        //// default is 12 bit resolution, 750 ms conversion time
      }
      celsius = (float)raw / 16.0;
      celsius=celsius-2;
      fahrenheit = celsius * 1.8 + 32.0;
     if(debug)
     {
      Serial.print("  Temp = ");
      Serial.print(celsius);
     }
     else
     {
      Serial.print("D");
      Serial.print(celsius);
      Serial.print("F"); 
      //Serial.print(bcl);
      return celsius;
       
       
     }
      

}
void intToBinary(int nb,char* ptTmp, char tmpDestination[12]) {
  int i = 10;
  int cpt = 0;
  while (i >= 0) {
   if ((nb >> i) & 1) {
    tmpDestination[cpt] = '1';
   } else {

   tmpDestination[cpt] = '0';
   }
   -- i;
   cpt++;
   
  }
  tmpDestination[11] = '\0';
  printf("%s",ptTmp);
  printf("\n");
}

void loop() {
  temps++;
  if (temps >= 38) {
       efficientData = compteur;
       compteur = 0;
       temps = 0; 
        
  }
  if (compteur > 999) {
       efficientData = compteur;
       compteur = 0;
       temps = 0; 

  }
  
  float chaleur = Temperature();
  delay(2000);
  if(chaleur > -500) {
    chaleur += 100;
    
    char tmpDestination[12];
    char* ptTmp1 = tmpDestination;
    int toTransmit = (chaleur + 1000)*100;
    intToBinary(chaleur, ptTmp1, tmpDestination);
    
    mySwitch.send(tmpDestination);
    
  }
  int valeurH = analogRead(humidite) +200;
  char tmpDestination2[12];
  char* ptTmp2 = tmpDestination2;
  intToBinary(valeurH, ptTmp2, tmpDestination2);
  
  char tmpDestination3[12];
  char* ptTmp3 = tmpDestination3;
  if(efficientData < 6) efficientData = 5;
  intToBinary((efficientData + 1000), ptTmp3, tmpDestination3);
  

  delay(2000);
  
  mySwitch.send(tmpDestination2);
  delay(2000);
  
  mySwitch.send(tmpDestination3);
  delay(2000);
  
  /* Same switch as above, but using binary code */
  
 }
