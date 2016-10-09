/**
 * MonitorController
 *
 * @description :: Server-side logic for managing monitors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var util = require("util");
var moment = require('moment');
var logger = require('../services/logger.init.js').logger("tom.txt");
var mongojs=require("mongojs");
var moment = require("moment-timezone");
var db = mongojs("127.0.0.1/test", ['meteo']);

module.exports = {
	
	home: function(req,res) {

			var result = "oki";
			var tom = "okokok";
			return res.render ('meteo/home',{'nom': 'Manouvrius', 'prenom': 'Gillus','tplMenu': tom,'datas': result});
 
	
	},

	get_last_meteo: function(req, res) {

		sails.models.meteo.find({ limit: 10, sort: 'stamp DESC' },function (err,results) {
	  		if (err !== undefined && err !== null) logger.util(err);
			logger.util(results);
			res.send(results);
		});
	}
};
