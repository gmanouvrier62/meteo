/**
* Meteo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    _id : { type: 'string' },

    temperature : { type: 'int' },

    humidity : { type: 'int' },

    stamp : { type: 'int' },

    next_save : { type: 'int' },

    date_created : { type: 'string' },
	
	  date_next_save : { type: 'string' }
  }
};

