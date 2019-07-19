(function () {
        var element = (id) => {
            return document.getElementById(id);
        }

        //get elementts
        var status = element('status');
        var messages = element('messages');
        var textarea = element('textarea');
        var username = element('username');
        var clearBtn = element('clearBtn');

        //set default status
        var statusDefault = status.textContent;

        var setStatus = (s) => {
            //set status
            status.textContent = s;

            if(s != statusDefault) {
                var delay = setTimeout(() => {
                    setStatus(statusDefault)
                }, 4000);
            }
        }

        // connected a socket.io
        var socket = io.connect('http://127.0.0.1:5050');

        // check for connection
        if(socket != undefined) {
            console.log('>>Connected Socket.io...');

            socket.on('output', (data) => {
                console.log(data);
                if(data.lenght) {
                    for(var x=0; x < data.lenght; x++) {
                        // build out message div
                        var message = document.createElement('div');
                        message.setAttribute('class', 'chat-message');
                        message.textContent = data[x].name + ": " + data[x].message;
                        messages.appendChild(message);
                        messages.insertBefore(message, messages.firstChild);
                    }
                }
            });
        }
})();