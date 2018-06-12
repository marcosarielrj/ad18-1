var irc = require('irc');
var amqp = require('amqplib/callback_api');

var proxies = {}; // mapa de proxys
var amqp_conn;
var amqp_ch;
var irc_clients = {};
var servidoratual;

// Conexão com o servidor AMQP
amqp.connect('amqp://localhost', function(err, conn) {
	
	conn.createChannel(function(err, ch) {
		
		amqp_conn = conn;
		amqp_ch = ch;
		
		inicializar();
	});
});

function inicializar() {
	
	receberDoCliente("registro_conexao", function (msg) {
		
		console.log('irc-proxy.js: recebeu registro de conexão');
		
		var id       = msg.id;
		var servidor = msg.servidor;
		var nick     = msg.nick;
		var canal    = msg.canal;
		
		irc_clients[id] = new irc.Client(
			servidor, 
			nick,
			{channels: [canal]}
		);		
		
		irc_clients[id].addListener('message'+canal, function (from, message) {
			
			console.log(from + ' => '+ canal +': ' + message);
			
			enviarParaCliente(id, {
				"timestamp": Date.now(), 
						   "nick": from,
				 "msg": message
			});
		});
		
		irc_clients[id].addListener('error', function(message) {
			console.log('error: ', message);
		});

		irc_clients[id].addListener('motd', function(motd) {
			// console.log('motd: ', motd);

			enviarParaCliente(id, {
				"timestamp": Date.now(),
				"msg": motd});
			
		});

		irc_clients[id].addListener('nick', function(oldnick, newnick, channels, message) {
		
			//ws.emit(	"message", {
			//"msg":oldnick + " is now known as " + newnick} );

			enviarParaCliente(id, {
				"timestamp": Date.now(),
				"msg": oldnick + " is now known as " + newnick});
			
			//irc_client.send("NAMES", channels[0])
		});

		irc_clients[id].addListener('whois', function(info) {
			
			//console.log('mode: ', whois);
			
			servidoratual = info.server;

			enviarParaCliente(id, {
				"timestamp": Date.now(),
				"msg": JSON.stringify(info)});
				
		});
		irc_clients[id].addListener('names', function(channel, nicks) {
			var lista = channel+JSON.stringify(nicks);
			//console.log('listagem de nicks do canal: '+lista);
			//ws.emit("names", {
			//	"msg":lista} );
			enviarParaCliente(id, {
				"timestamp": Date.now(),
				"msg": lista});
		});
		irc_client.addListener('raw', function(time) {
		

			//console.log(time.command);
			if (time.command === "rpl_time"){
			console.log(time);
			ws.emit(	"message", {
				"msg":time.args[2]} );
			}
		});
		irc_client.addListener('quit', function(nick, reason, channels, message) {

			//ws.emit(	"message", {
			//	"msg":nick + " has left " + channels[0]} );
				
			irc_client.send("NAMES", channels[0])
			
		});
		irc_clients[id].addListener('join', function(channel, nick, message) {
		
			//ws.emit(	"message", {
			//	"msg":nick + " has join to " + channel} );
				
			irc_clients[id].send("NAMES", channel)
		});
		
		proxies[id] = irc_clients[id];
	});
	
	receberDoCliente("gravar_mensagem", function (msg) {
		
		irc_clients[msg.id].say(msg.canal, msg.msg);
	});
}

function receberDoCliente (canal, callback) {
	
	amqp_ch.assertQueue(canal, {durable: false});
	
	console.log(" [irc] Waiting for messages in "+canal);
	
	amqp_ch.consume(canal, function(msg) {
		
		console.log(" [irc] Received %s", msg.content.toString());
		callback(JSON.parse(msg.content.toString()));
		
	}, {noAck: true});
}

function enviarParaCliente (id, msg) {
	
	msg = new Buffer(JSON.stringify(msg));
	
	amqp_ch.assertQueue("user_"+id, {durable: false});
	amqp_ch.sendToQueue("user_"+id, msg);
	console.log(" [irc] Sent to ID "+id+ ": "+msg);
}




