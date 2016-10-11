var http = require('http');
var server = http.createServer(function(req,res){

});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(clt) {
    selfUser=clt;
    clt.emit('welcome', { message: 'Vous êtes connectés en temps réel, pas besoin de raffraichir la page' });
});

server.listen(3000);