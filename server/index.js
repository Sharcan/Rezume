require('./config/config'); //Configuration
require('./models/db'); //Connexion à la bdd
require('./config/passportConfig'); //Passport configuration

//On appelle les modules qu'on va utiliser
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsRegistration = require('./routes/registration.router');
const rtsStudent = require('./routes/student.router');
const rtsCompany = require('./routes/company.router');
const rtsCv = require('./routes/cv.router');
const rtsPost = require('./routes/post.router');
const rtsHashtag = require('./routes/hashtag.router');
const rtsMessage = require('./routes/message.router');

var app = express();
var server = require('http').createServer(app);

//On dit à l'application ce qu'on va utiliser
app.use(bodyParser.json());
app.use(express.static('uploads'));
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsRegistration, rtsStudent, rtsCompany, rtsCv, rtsPost, rtsHashtag, rtsMessage); // define URL '/api' to call the router

// error handler
app.use((err, req, res, next) => {
    if(err.name == 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }
});


//IO

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Room = mongoose.model('Room');
const Message = mongoose.model('Message');
const Company = mongoose.model('Company');
const Student = mongoose.model('Student');

var io = require('socket.io').listen(server);
var connectedUsers = [];

io.on('connection', (socket) => {

    socket.emit('newUser');

    socket.on('changeChannel', (infos) => {
        Room.findOne({ $and: [ {"_id_users.student": infos.studentId}, {"_id_users.company": infos.companyId}]}, (err, room) => {
            if(!room || room.length <= 0) {
                var newRoom = new Room();
                newRoom._id_users = { student: infos.studentId, company: infos.companyId };
                newRoom.save();

                _joinRoom(newRoom, infos);
            } else {
                _joinRoom(room, infos);
                Message.updateMany({_id_room: socket.channel}, {$set: {status: 1}},
                    (err, result) => {
                    if(!result) {
                        return false;
                    } else {

                        Message.find({_id_room: socket.channel},
                            (err, messages) => {

                                if(!messages){
                                    return false;

                                } else {
                                    socket.emit('oldMessages', messages);
                                }
                        });
                    }
                })
            }
        })
    })

    socket.on('newMessage', (content, sender, status) => {
        if(socket.channel) {
            Room.findOne({_id: socket.channel}, (err, room) => {
                if(room) {
                    var message = new Message();
                    message._id_room = socket.channel;
                    message.sender = sender;
                    if(status == "student") { 
                        Student.findOne({_id: room._id_users.student}, (err, student) => {
                            if(student) {

                                message.receiver = room._id_users.company;
                                message.sender_name = student.firstName + ' ' + student.lastName.toUpperCase();
                                message.content = content;
                                message.status = 0;
                                message.save();

                                socket.broadcast.to(socket.channel).emit('newMessageAll', content, message.sender_name);
                            }
                        })
                    } else if (status == "company") {
                        Company.findOne({_id: room._id_users.company}, (err, company) => {
                            if(company) {   

                                message.receiver = room._id_users.student;
                                message.sender_name = company.company_name;
                                message.content = content;
                                message.status = 0;
                                message.save();

                                socket.broadcast.to(socket.channel).emit('newMessageAll', content, message.sender_name);
                            }
                        })
                    }
                }
            })

        } else {
            return false;
        }
    })

    function _joinRoom(room, infos) {
        var previousChannel = '';
        var newChannel = '';

        if(infos.status == "student") {
            newChannel = room._id_users.company;
        } else if(infos.status == "company") {
            newChannel = room._id_users.student;
        }

        if(socket.channel) {
            Room.findOne({_id: socket.channel}, (err, previousRoom) => {   
                if(!previousRoom) {
                    return false;
                } else {
                    if(infos.status == "student") {  
                        previousChannel = previousRoom._id_users.company;
                    } else if(infos.status == "company") {
                        previousChannel = previousRoom._id_users.student;
                    }
                    socket.emit('emitChannel', {previousChannel: previousChannel, newChannel: newChannel})
                }
            })
        } else {
            socket.emit('emitChannel', {newChannel: newChannel})
        }

        socket.leaveAll();
        socket.join(room._id);
        socket.channel = room._id;
    }

})


// start server
server.listen(process.env.PORT, () => console.log('Server started at port : ' + process.env.PORT));

