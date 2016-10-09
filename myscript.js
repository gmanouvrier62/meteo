
var util = require("util");
var mongojs=require("mongojs");
var moment = require("moment-timezone");
var sleep = require("sleep");
var currentStatus = "";
var db = mongojs("127.0.0.1/test", ['meteo']);
var rpi433    = require('rpi-433'),
    rfSniffer = rpi433.sniffer({
      pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13) 
      debounceDelay: 40,          //Wait 500ms before reading another code 
      
});
    
 rfSniffer.currentTemperature = null;
 rfSniffer.currentHumidity = null;
 rfSniffer.currentStatus = null;

 rfSniffer.next_save = moment().toDate().getTime();
 offset = moment.tz.zone('Europe/Paris').offset(moment().toDate().getTime());
 offset = Math.abs(offset) * 60 * 1000; //converti en secondes
 rfSniffer.p_stamp = moment().toDate().getTime() + offset;
 rfSniffer.p_format = moment(moment().toDate().getTime() + offset).format("YYYY-MM-DD HH:mm:ss");
 
  // Receive (data is like {code: xxx, pulseLength: xxx}) 
 
 rfSniffer.on('data', function (data) {
  
  //Définition des dates
   now_stamp = moment().toDate().getTime() + offset;//offset pour traiter en heure FR
   now_format = moment(moment().toDate().getTime() + offset).format("YYYY-MM-DD HH:mm:ss");
   cinq_minutes= 1000 * (300);
  // 
  console.log("now = ",now_format," stamp : ", now_stamp);
  console.log("p = ",this.p_format," stamp : ", this.p_stamp, " next_save : ", rfSniffer.next_save);
  console.log("T° = ",rfSniffer.currentTemperature,"Humidity = ",rfSniffer.currentHumidity, "offset = ", offset);
  if (data.code === 666) {
    rfSniffer.currentStatus = "H";
  } else if (data.code === 6666) {
    rfSniffer.currentStatus = "T";
  } else {
    if (rfSniffer.currentStatus === "H"){
      rfSniffer.currentHumidity = data.code;
      console.log("h set à ", data.code);
    }
    if (rfSniffer.currentStatus === "T"){
      rfSniffer.currentTemperature = data.code;
       console.log("t set à ", data.code);
    }
  }

  if (rfSniffer.currentTemperature !== null && rfSniffer.currentHumidity !== null && rfSniffer.currentTemperature !== undefined && rfSniffer.currentHumidity !== undefined) {
    if(rfSniffer.currentTemperature < 60) {
        if (now_stamp > rfSniffer.p_stamp) {
          //J'ai les 2 informations, je sauvegarde en base Mongo
          console.log("J'ai les 2 infos temp et humi", rfSniffer.currentTemperature, rfSniffer.currentHumidity);
          var objDt=new Date();
          var row = {};
          row.temperature = rfSniffer.currentTemperature + 2;
          row.humidity = rfSniffer.currentHumidity;
          row.date_created = now_format;
          row.stamp = now_stamp;
          rfSniffer.p_stamp = moment().toDate().getTime() + offset + cinq_minutes;
          rfSniffer.p_format = moment(moment().toDate().getTime() + offset + cinq_minutes).format("YYYY-MM-DD HH:mm:ss");
 
          rfSniffer.next_save = rfSniffer.p_stamp;
          var date_next_save = rfSniffer.p_format;
          row.next_save = rfSniffer.next_save;
          row.date_next_save = date_next_save;
          db.meteo.save(row,{w: 1},function(err){
              if(err!==null)
              {
                 console.log(err);
                 //couveuse.log.error("ERR : " + err);
              } 
              rfSniffer.currentHumidity = null;
              rfSniffer.currentTemperature = null;
              rfSniffer.currentStatus = "";

          });
        } else {
          //
            rfSniffer.currentHumidity = null;
            rfSniffer.currentTemperature = null;
            rfSniffer.currentStatus = "";
            console.log("Pas de save car date = ", now_format, ", prochaine dt = ", rfSniffer.p_format);
        }
   } else {
      rfSniffer.currentTemperature = null;
   }
  }

  console.log('Code received: ' + data.code +' pulse length : ' + data.pulseLength);
});
 
