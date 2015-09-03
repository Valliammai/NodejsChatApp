var express = require('express'),
    app = express(),
	server = require ('http').createServer(app),
	io = require ('socket.io').listen(server),
	path = require('path'),
	sqlite3 = require('sqlite3').verbose(),
	nicknames = [];
	
var db = new sqlite3.Database('chat.db');
db.serialize(function() {
db.run("CREATE TABLE IF NOT EXISTS chat (nick TEXT, msg TEXT, time TEXT)");
});

app.use(express.static(path.join(__dirname,'public')));

server.listen(3000);
console.log('Listening on port 3000');

function format(d){
	   var dd = d.getDate()
	   if ( dd < 10 ) dd = '0' + dd
	   var mm = d.getMonth()+1
	   if ( mm < 10 ) mm = '0' + mm
	   var yyyy = d.getFullYear() 
	   if ( yyyy < 10 ) yyyy = '0' + yyyy
	   var hours = d.getHours()
	   var minutes = d.getMinutes()
	   if ( minutes < 10 ) minutes = '0' + minutes
	   var ampm = hours < 12 ? "AM" : "PM";
	   
	   return dd+'.'+mm+'.'+yyyy+' '+hours+':'+minutes+''+ampm
	   }	  
       
var d = new Date(); 

io.sockets.on('connection',function(socket){
	db.all("SELECT nick, msg, time FROM chat", function(err, rows) {
        if (err) throw err;
		socket.emit ('load old msgs', rows)
		});
	socket.on('new user',function(data, callback){
		if (nicknames.indexOf(data) != -1){
			callback(false);
		} else{
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			updateNicknames();
		}
	});
	
	function updateNicknames(){
		io.sockets.emit('usernames',nicknames);
	}
	
	socket.on('send message', function(data){		
		var stmt = db.prepare("INSERT INTO chat VALUES (?,?,?)");
        stmt.run(socket.nickname, data, format(d));
		stmt.finalize();
		io.sockets.emit('new message', {msg: data, nick: socket.nickname, time: format(d)});
	});
	
	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();
	});
});
