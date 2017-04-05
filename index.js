const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisClient = require('redis').createClient();
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const shortid = require('shortid');

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: 'main'
});

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//redisClient.flushall();

io.on('connection', client => {});

// Seperate databases for messages, users, rooms?
// Or single database with seperate hashes?

// Messages: 0001: {
// Body : bodytext
// Author : authorUsername
// Room posted in : roomName
//}

//username can't be duplicated
// Users
// Username : username

// Rooms: roomname: {
// Messages : [messages]
//}
// messages:
//    {
//      uniqueID: shortid {
//       body: this is my text,
//       author: sam01,
//       room: room1
//}
//
//     },
//     00002: {
//       body: something,
//       author: username,
//       room: roomName
//     }
//   }
//

// Will this work for setting/gettingo our data?
// HSET messages, uniqueid.body, "Hello", uniqueid.author, "anon", uniqueid.room, "cats"
//
// hget messages uniqueid.body, uniqueid.author, uniqueid.room

// users:
//   {
//     username:username,
//     username:username,
//     sam01:sam01
//   }
//
// rooms:
//   {
//     roomname: {
//       messagekey: messagekey
//       messagekey: messagekey
//     },
//   }

//hashkey contains all information:
//

app.get('/', (req, res) => {
  res.render('index');

  redisClient.hmget(
    'messages',
    'uniqueID',
    'message',
    'username',
    'roomName',
    (err, results) => {
      console.log(results);
    }
  );
});

app.post('/', (req, res) => {
  let newMessage = req.body.message;
  let messageID = shortid.generate();

  // DON'T FORGET TO CHANGE THESE GEEEEEZE
  let user = 'anon';
  let room = 'cats';

  //Currently just rewriting the messages hash every time
  redisClient.hmset(
    'messages',
    'uniqueID',
    messageID,
    'message',
    newMessage,
    'username',
    user,
    'roomName',
    room
  );

  // messages: {
  //   uniqueid: blah,
  //   message:blah,
  //   username:blah,
  //   roomname:blah,
  //   uniqueid:
  // }

  redisClient.hmset('rooms', 'roomName');
  //hmset hash key value key value key value
  //   redisClient.hmset(
  //     uniqueID,
  //     'uniqueID',
  //     uniqueID,
  //     'creationTime',
  //     creationTime,
  //     'url',
  //     req.body.userURL,
  //     'count',
  //     0,
  //     (err, results) => {
  //       redisClient.hgetall(uniqueID, (err, results) => {
  //         console.log(results);
  //       });
  //     }
  //   );
});

// app.get('/', (req, res) => {
//   var allKeys = [];
//
//   var p = new Promise() {
//     redisClient.keys('*', (err, results) => {
//       results.forEach(function(key) {
//         redisClient.hgetall(key, (err, results) => {
//           allKeys.push(results);
//         });
//       });
//     });
//   }
//   p.then(res.render('index', { allKeys });)
//
//
//
// });
//
// app.get('/:uniqueID', (req, res) => {
//   let hashedURL = req.params.uniqueID;
//
//   redisClient.hget(hashedURL, 'count', (err, results) => {
//     redisClient.hincrby(hashedURL, 'count', 1, (err, results) => {
//       io.emit('new count', results, hashedURL.uniqueID);
//
//       redisClient.hget(hashedURL, 'url', (err, results) => {
//         console.log(results);
//         res.redirect(`http://www.${results}`);
//       });
//     });
//   });
// });
//
// app.post('/', (req, res) => {
//   var uniqueID = shortid.generate(req.body.userURL);
//   var d = new Date();
//   var creationTime = d.toString();
//
//   redisClient.hmset(
//     uniqueID,
//     'uniqueID',
//     uniqueID,
//     'creationTime',
//     creationTime,
//     'url',
//     req.body.userURL,
//     'count',
//     0,
//     (err, results) => {
//       redisClient.hgetall(uniqueID, (err, results) => {
//         console.log(results);
//       });
//     }
//   );
//
//   res.redirect('back');
// });

server.listen(3000);
