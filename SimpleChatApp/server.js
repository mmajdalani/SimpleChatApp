const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
//const secure = require('express-force-https')


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(secure)
app.use(express.static('public'))


app.get('*', function (req, res) {
    res.redirect('https://' + req.headers.host + req.url);
})

app.get('/', function (req, res) {   // Allows access to login page
    res.render('login');

});
app.get('/', (req, res) => {
    res.render('index')
})


app.post('/login', function (req, res) {
    res.render('index')
})

//routes
app.get('/', (req, res) => {
    res.render('index')
})

//Listen on port 
server = app.listen(port)



//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {
    socket.broadcast.emit('connection', 'A new user has connected');
    socket.on('disconnect', function (dis) {
        socket.broadcast.emit('connection', 'a user has disconnected');

    });

    


    //console.log('New user connected')

    //default username
    socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', { message: data.message, username: socket.username });
    })

    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', { username: socket.username })
    })
})