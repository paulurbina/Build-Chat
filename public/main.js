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
        var socket = io.connect('http://127.0.0.1:3000');

        // check for connection
        if(socket !== undefined) {
            console.log('>>Connected Socket.io...');

            // handle output
            socket.on('output', (data) => {
                console.log(data);
                if(data.length) {
                    for(var x=0; x < data.length; x++) {
                        // build out message div
                        var message = document.createElement('div');
                        message.setAttribute('class', 'chat-message');
                        message.textContent = data[x].name + ": " + data[x].message;
                        messages.appendChild(message);
                        messages.insertBefore(message, messages.firstChild);
                    }
                }
            });

            //get status from server
            socket.on('status', (data) => {

                //get message status
                setStatus((typeof data === 'object') ? data.message : data);

                // if status is clear , clear text
                if(data.clear) {
                    textarea.value = '';
                }
            });

            // handle input
            textarea.addEventListener('keydown', (event) => {
                if(event.which === 13 && event.shiftKey == false) {
                    socket.emit('input', {
                        name: username.value,
                        message: textarea.value
                    });
                    event.preventDefault();
                }
            });

            // handle clear button
            clearBtn.addEventListener('click', () => {
                socket.emit('clear');
            });

            // clear message
            socket.on('cleared', () => {
                messages.textContent = '';
            });
        }
})();