
require('../config/config');

console.log("change ==>", process.env.PORT );

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function (req, res) {
  res.send('Hello');
});
 
app.get('/users', function (req, res) {
  res.send('Get Users');
});

app.post('/users', function (req, res) {
  let body = req.body;
  if( body.name === undefined ){
    res.status(400).json({
      resp : false,
      msg : "The name is necesary"
    });
  }
  res.json({
    body,
    resp : 'Post Users'
  });
});

app.put('/users/:id', function (req, res) {
  let id = req.params.id;
  res.json({
    id,
    'resp' : 'Put Users'
  });
});

app.delete('/users/:id', function (req, res) {
  res.send('Delete Users');
});

app.listen(port, () =>{
    console.log("Init Port "+port);
});