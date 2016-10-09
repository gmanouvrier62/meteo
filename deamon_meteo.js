
var util = require("util");
var events = require("events");
var mongojs=require("mongojs");
var moment = require("moment-timezone");
var sleep = require("sleep");
var currentStatus = "";
var db = mongojs("127.0.0.1/test", ['meteo']);
var rpi433 = require('rpi-433');
function deamon_meteo(){

  this.rfSniffer = rpi433.sniffer({
      pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13) 
      debounceDelay: 40          //Wait 500ms before reading another code 
  });

  this.currentTemperature = null;
  this.currentHumidity = null;
  this.currentStatus = null;
  this.next_save = moment().toDate().getTime(); //pour permettre un enregistrement immédiat lors du lancement
  var offset = moment.tz.zone('Europe/Paris').offset(moment().toDate().getTime());
  this.offset = Math.abs(offset) * 60 * 1000; //converti en secondes
  this.p_stamp = moment().toDate().getTime() + offset;
  this.p_format = moment(moment().toDate().getTime() + offset).format("YYYY-MM-DD HH:mm:ss");
  self = this;
  
  this.rfSniffer.on('data', function (data) {
      //self me permets de garder une variable avec le contexte 'anterieur' c a d l'objet deamon_meteo
      self.emit("raw",data);
      //Définition de la date actuelle
      now_stamp = moment().toDate().getTime() + self.offset;//offset pour traiter en heure FR
      now_format = moment(moment().toDate().getTime() + self.offset).format("YYYY-MM-DD HH:mm:ss");
      cinq_minutes= 1000 * (300);
      // 
      console.log("now = ", now_format, " stamp : ", now_stamp);
      console.log("p = ", self.p_format, " stamp : ", self.p_stamp, " next_save : ", self.next_save);
      console.log("T° = ", self.currentTemperature, "Humidity = ", self.currentHumidity, "offset = ", self.offset);
      if (data.code === 666) {
        self.currentStatus = "H";
      } else if (data.code === 6666) {
        self.currentStatus = "T";
      } else {
        if (self.currentStatus === "H"){
          self.currentHumidity = data.code;
          console.log("h set à ", data.code);
        }
        if (self.currentStatus === "T"){
          self.currentTemperature = data.code;
           console.log("t set à ", data.code);
        }
      }

      if (self.currentTemperature !== null && self.currentHumidity !== null && self.currentTemperature !== undefined && self.currentHumidity !== undefined) {
        if(self.currentTemperature < 60) {
            if (now_stamp > self.p_stamp) {
              //J'ai les 2 informations, je sauvegarde en base Mongo
              console.log("J'ai les 2 infos temp et humi", self.currentTemperature, self.currentHumidity);
              var objDt=new Date();
              var row = {};
              row.temperature = self.currentTemperature + 2;
              row.humidity = self.currentHumidity;
              row.date_created = now_format;
              row.stamp = now_stamp;
              self.p_stamp = moment().toDate().getTime() + self.offset + cinq_minutes;
              self.p_format = moment(moment().toDate().getTime() + self.offset + cinq_minutes).format("YYYY-MM-DD HH:mm:ss");
     
              self.next_save = self.p_stamp;
              var date_next_save = self.p_format;
              row.next_save = self.next_save;
              row.date_next_save = date_next_save;
              self.emit("getinfos",row);
              db.meteo.save(row,{w: 1},function(err){
                  if(err!==null)
                  {
                     console.log(err);
                     self.emit("error",err);
                     //couveuse.log.error("ERR : " + err);
                  }

                  self.currentHumidity = null;
                  self.currentTemperature = null;
                  self.currentStatus = "";
              });
            } else {
                self.currentHumidity = null;
                self.currentTemperature = null;
                self.currentStatus = "";
                console.log("Pas de save car date = ", now_format, ", prochaine dt = ", self.p_format);
            }
       } else {
          self.currentTemperature = null;
       }
      }

      console.log('Code received: ' + data.code +' pulse length : ' + data.pulseLength);
    });
};
deamon_meteo.prototype.__proto__ = events.EventEmitter.prototype;
module.exports = deamon_meteo();



var met = new deamon_meteo();

met.on("getinfos", function(datas){

console.log("how!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", datas);

});
