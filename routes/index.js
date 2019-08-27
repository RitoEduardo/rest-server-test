const express = require('express');
const app = express();

app.use(require('../routes/user'));
app.use(require('../routes/login'));
app.use(require('../routes/category'));

module.exports = app;