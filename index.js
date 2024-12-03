const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const port = 5000;
const app = express();
const url = 'mongodb://localhost:27017/contact-data';
const bodyParser = require('body-parser')
const router = require('./router/router')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(url);
try {
    console.log('connection successful to database')
} catch (error) {
    console.error('database connection failed', error);
}

app.use(cors())
app.use('/api', router);



app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});