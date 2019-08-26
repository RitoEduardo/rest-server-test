require('../config/config');

const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(require('../routes/user'));

const port = process.env.PORT;

var db = mongoose.connection;
mongoose.connect(process.env.MONGO_DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("Connection MongoDB successful !!!")
});

app.listen(port, () => {
    console.log("Listening in port:" + port);
});