
var util = require("util");
var mongojs=require("mongojs");
var moment = require("moment");
var currentStatus = "";
var db = mongojs("127.0.0.1/test", ['meteo']);
var rpi433    = require('rpi-433'),
    rfSniffer = rpi433.sniffer({
      pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13) 
      debounceDelay: 100,          //Wait 500ms before reading another code 
      
});
 currentTemperature = 10000;
 currentHumidity = null;
 currentStatus = null;
 next_save = moment().unix();
// Receive (data is like {code: xxx, pulseLength: xxx}) 
rfSniffer.on('data', function (data) {
  console.log("curT",currentTemperature,"currentHumidity",currentHumidity);
  if (data.code === 666) {
    currentStatus = "H";
  } else if (data.code === 6666) {
    currentStatus = "T";
  } else {
    if (currentStatus === "H"){
      currentHumidity = data.code;
      console.log("h set à ", data.code);
    }
    if (currentStatus === "T"){
      currentTemperature = data.code;
       console.log("t set à ", data.code);
    }
  }

  if (currentTemperature !== null && currentHumidity !== null && currentTemperature !== undefined && currentHumidity !== undefined) {
    if(currentTemperature < 60) {
        if (moment().unix() > this.next_save) {
          //J'ai les 2 informations, je sauvegarde en base Mongo
          console.log("J'ai les 2 infos temp et humi", currentTemperature, currentHumidity);
          var objDt=new Date();
          var row = {};
          row.temperature = currentTemperature + 2;
          row.humidity = currentHumidity;
          row.date_created = moment().format("YYYY-MM-DD HH:mm:ss");
          row.stamp = moment().unix();
          var cinq_minutes= 1000 * (300);
          next_save = row.stamp + cinq_minutes;
          var date_next_save = moment(next_save).format("YYYY-MM-DD HH:mm:ss");
          row.next_save = next_save;
          row.date_next_save = date_next_save;
          db.meteo.save(row,{w: 1},function(err){
              if(err!==null)
              {
                 console.log(err);
                 //couveuse.log.error("ERR : " + err);
              } 
              currentHumidity = null;
              currentTemperature = null;
              currentStatus = "";

          });
        } else {
          //
            currentHumidity = null;
            currentTemperature = null;
            currentStatus = "";
            console.log("Pas de save car date = ", moment().format("YYYY-MM-DD HH:mm:ss"), ", prochaine dt = ", moment(next_save).format("YYYY-MM-DD HH:mm:ss"));
        }
   } else {
      currentTemperature = null;
   }
  }

  console.log('Code received: ' + data.code +' pulse length : ' + data.pulseLength);
});
 
