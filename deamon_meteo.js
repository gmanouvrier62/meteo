
var util = require("util");
var events = require("events");
var mongojs=require("mongojs");
var moment = require("moment-timezone");
var sleep = require("sleep");
var logger = require('./logger_deamon.js').logger("gm.txt");

var currentStatus = "";
var numbers = 0;

var rpi433 = require('rpi-433');
function deamon_meteo(){

  this.rfSniffer = rpi433.sniffer({
      pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13) 
      debounceDelay: 200          //Wait 500ms before reading another code 
  });
  
  this.numbers = 0;
  this.mongoConnection = "127.0.0.1/test";

  this.currentTemperature = null;
  this.currentHumidity = null;
  this.currentStatus = null;
  this.currentVent = null;
  this.next_save = moment().toDate().getTime(); //pour permettre un enregistrement immédiat lors du lancement
  var offset = moment.tz.zone('Europe/Paris').offset(moment().toDate().getTime());
  this.offset = Math.abs(offset) * 60 * 1000; //converti en secondes
  this.p_stamp = moment().toDate().getTime() + offset;
  this.p_format = moment(moment().toDate().getTime() + offset).format("YYYY-MM-DD HH:mm:ss");
  self = this;
 
  this.rfSniffer.on('data', function (data) {
      logger.warn(data);
      //self me permets de garder une variable avec le contexte 'anterieur' c a d l'objet deamon_meteo
      self.emit("raw",data);
      //Définition de la date actuelle
      now_stamp = moment().toDate().getTime() + self.offset;//offset pour traiter en heure FR
      now_format = moment(moment().toDate().getTime() + self.offset).format("YYYY-MM-DD HH:mm:ss");
      cinq_minutes= 1000 * (300);
      // 
      //console.log("now = ", now_format, " stamp : ", now_stamp);
      //console.log("p = ", self.p_format, " stamp : ", self.p_stamp, " next_save : ", self.next_save);
      //console.log("T° = ", self.currentTemperature, "Humidity = ", self.currentHumidity,"Vent = ", self.currentVent, "offset = ", self.offset);
      //console.log("V = ", self.currenture, "Humidity = ", self.currentHumidity, "offset = ", self.offset);
      
      //interprétation
      if (data.code < 200) {
        //température -100
        self.currentTemperature = data.code - 100;
      }
      if (data.code >= 200 && data.code < 1000) {
        //humidité -100
        self.currentHumidity = data.code - 200;
      }
      if(data.code > 1000) {
        //vent
        self.currentVent = data.code - 1000;
      }
      

      if (self.currentTemperature !== null && self.currentHumidity !== null && self.currentTemperature !== undefined && self.currentHumidity !== undefined && self.currentVent !== undefined && self.currentVent !== null) {
            if (now_stamp > self.p_stamp) {
              //J'ai les 2 informations, je sauvegarde en base Mongo
              var db = mongojs(self.mongoConnection, ['meteo']);
              //console.log("J'ai les  infos temp et humi", self.currentTemperature, self.currentHumidity);
              var objDt=new Date();
              var row = {
                temperature: 0, 
                humidity:0, 
                vent:0, 
                date_created:'', 
                stamp:0,
                next_save:'',
                date_next_save:''
                };
              row.temperature = self.currentTemperature + 2;
              row.humidity = self.currentHumidity;
              row.vent = self.currentVent;
              row.date_created = now_format;
              row.stamp = now_stamp;
              self.p_stamp = moment().toDate().getTime() + self.offset + cinq_minutes;
              self.p_format = moment(moment().toDate().getTime() + self.offset + cinq_minutes).format("YYYY-MM-DD HH:mm:ss");
     
              self.next_save = self.p_stamp;
              var date_next_save = self.p_format;
              row.next_save = self.next_save;
              row.date_next_save = date_next_save;
              self.emit("getinfos",row);
              console.log("row : ", row);
              db.meteo.save(row,{w: 1},function(err){
                  if(err!==null)
                  {
                     console.log(err);
                     self.emit("error",err);
                    
                  }

                  self.currentHumidity = null;
                  self.currentTemperature = null;
                  self.currentVent = null;
                  self.currentStatus = "";
                  var db = null;
              });
            } else {
                self.currentHumidity = null;
                self.currentTemperature = null;
                self.currentVent = null;
                self.currentStatus = "";
                console.log("Pas de save car date = ", now_format, ", prochaine dt = ", self.p_format);
                var db = null;
            }
       
      }

      //console.log('Code received: ' + data.code +' pulse length : ' + data.pulseLength);
    });
};
deamon_meteo.prototype.__proto__ = events.EventEmitter.prototype;
module.exports = deamon_meteo();



var met = new deamon_meteo();

met.on("getinfos", function(datas){

console.log("how!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", datas);

});
