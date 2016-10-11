/*jslint node: true*/
"use strict";
var util = require('util');
exports.logger = function (filename) {
    //Préparation du logger
    var log4js = require('log4js');
    log4js.configure({
            appenders: [
                {type: 'console'},
             
                {
                    type: 'dateFile',
                    filename: '/var/node/meteo/logs_deamon/viewer.log',
                    "pattern": "-yyyy-MM-dd",
                    "alwaysIncludePattern": true
                }

            ],
            replaceConsole: true,
            path: '/var/node/meteo/logs_deamon/viewer.log'
        });

    var log_f = filename.split('/').reverse().slice(0, 2).reverse().join('/');
    var logger = log4js.getLogger(log_f);

    log4js.loadAppender('file');
    log4js.addAppender(log4js.appenders.file("/var/node/meteo/logs_deamon/viewer.log"), log_f);

    logger.util = function () {
        var tmpArray = [];

        for (var index in arguments) {
            tmpArray.push(util.inspect(arguments[index], {colors: true, showHidden: true, depth: 5}));
        }

        logger.debug.apply(this, tmpArray);
    };

    return logger;
};
