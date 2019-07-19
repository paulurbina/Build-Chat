const mongoClient = require('mongodb').MongoClient;
// const mongoose = require('mongoose');

const client = require('socket.io').listen(5050).sockets;
const urlMlab = 'mongodb://userchat:buidlchat2019@ds253017.mlab.com:53017/buildchatnode';
const urlNative = 'mongodb://127.0.0.1:27017/mongochat';
//suport promise
// mongoose.Promise = global.Promise;

// Connect  db mongo
mongoClient.connect(urlNative, { useNewUrlParser:true }, function(err, db) {
    if(err) {
        throw err;
    }
        console.log('>> Connected db...');

        client.on('connection', (socket) => {
            let chat = db.collection('chats');

            //create function  send status
            let sendStatus = (status) => {
                socket.emit('status', status);
            }

            //get chat mongodb from collections
            chat.find().limit(100).sort({ _id: -1 }).toArray((err, res) => {
                if(err) {
                    throw err
                } else {
                    //emit messages
                    socket.emit('output', res);
                }
            });

            // handles inputs events
            socket.on('input', (data) => {
                let name = data.name || '';
                let message = data.message || '';

                //check message and name
                if(name == '' || message == '') {
                    sendStatus('Please enter name and message');
                } else {
                    // insert messages
                    chat.insert({
                        name: name,
                        message: message
                    }, () => {
                        client.emit('output', [data]);

                        // send status object
                        sendStatus({
                            message: 'Message send',
                            clear: true
                        });
                    });
                }
            });

            //handle clear
            socket.on('clear', (data) => {
                // remove all chat collection
                chat.remove({}, () => {
                    //emit chat remove
                    socket.emit('cleared');
                });
            });
        });
    
});

