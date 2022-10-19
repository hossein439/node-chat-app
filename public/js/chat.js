const socket = io();

// Elements
const form = document.querySelector('#form');
const btnForm = form.querySelector('#btn');
const inputForm = form.querySelector('#input');
const locationBtn = document.querySelector('.location');
const messageCnt = document.querySelector('#message-cnt');
const chatPlace = document.querySelector('#chat-place');
const chatSidebar = document.querySelector('#chat-sidebar');


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;


// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// const auz

socket.on('message', (msg, color) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        message: msg.text,
        date: moment(msg.createAt).format('h:mm a'),
        color,
        username: msg.username,
        currnet: 'cureent-user'
    });
    messageCnt.insertAdjacentHTML('beforeend', html);
    // autoscroll();
    chatPlace.scrollTo(0, Number(chatPlace.scrollHeight));
});

socket.on('locationMessage', (location, color) => {
    console.log(color)
    const html = Mustache.render(locationTemplate, {
        link: location.url,
        date: moment(location.createAt).format('h:mm a'),
        color,
        username: location.username
    });
    messageCnt.insertAdjacentHTML('beforeend', html);
    // autoscroll()
    chatPlace.scrollTo(0, Number(chatPlace.scrollHeight));
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        users,
        room,
    });
    chatSidebar.innerHTML = html;
});

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // autoscroll()
    // chatPlace.scrollTo(0, Number(chatPlace.scrollHeight));

    const message = inputForm.value;
    btnForm.setAttribute('disabled', 'disabled');

    socket.emit('sendMessage', message, (error) => {

        btnForm.removeAttribute('disabled')
        inputForm.value = '';
        inputForm.focus();

        if (error) {
            return alert(error);
        }
        console.log('message delivered');
    });
});


locationBtn.addEventListener('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    locationBtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            locationBtn.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
});


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
})