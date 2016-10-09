var moment = require("moment-timezone");
var tz = require("timezone-names");
console.log(moment().tz("Europe/Paris").toDate().getTime());
console.log(tz.getAll());

console.log(moment.tz.zone('Europe/Paris').offset(moment().toDate().getTime()));

console.log(Math.abs(-120));
