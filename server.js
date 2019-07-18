const mongo = require('mongodb').MongoClient;

const client = require('socket.io').listen(5050).sockets;

// Connect  db mongo
mongo.connect('mongodb://chat-socket-paul:buildchat2019@ds253017.mlab.com:53017/build-chat-socket-io', { useNewUrlParser: true})
    .then(db => {
        console.log('>>Connected Mongodb..');

        // Connected socket.io
        client.on('connection', () => {
            let chat = db.collection('chats');

            //create functo send status
            let sendStatus = s => {
                socket.emit('status', s);
            }
            // get chats  from mongo collection
            chat.find().limit(100).sort({ _id: -1 }).toArray((err, res) => {
                if (err) {
                    throw err;
                } else {
                    
                    //emit the messages
                    socket.emit('output', res);
                }
            });

            // handlees inputs events
            socket.on('input', (data) => {
                let name = data.name;
                let message = data.message;

                //check for name and message
                if(name == '' || message == '') {
                    // send error status
                    sendStatus('Please enter message and name');
                } else {
                    //insert messsage
                    chat.insert({
                        name: name,
                        message: message
                    }, () => {
                        client.emit('output', [data]);

                        //send status object
                        sendStatus({
                            message: 'Message send',
                            clear: true
                        });
                    });
                }
            });

            // handle clear
            socket.on('clear', (data) => {
                // remove all chat collection
                chat.remove({}, () => {
                    //emit cleared
                    socket.emit('cleared');
                });
            });

        });

    })
    .catch(err => {
        console.log(err);
        throw err;
    });