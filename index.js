const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var routes = require('./src/routes/searchRoute');
var controller = require('./src/controllers/searchController');
let fs = require('fs');
let workableData;
const PORT = 3213;

//For CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, searchterm');
    next();
});

//For accessing body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


routes(app);

app.get('/', (req, res) =>
    res.send(`Node & express server are running on port ${PORT}`)
);

const server = app.listen(PORT, () => {
    controller.loadData();
    console.log(`Your server is running on ${PORT}`);
    console.log(`sending ready--------------------------------------------`);
    process.send('ready');
});

process.on('SIGINT', () => {
    // process.send('SIGTERM');
    server.close(() => {
        console.log(`--------------------------------------------exiting process`);
        // process.exit(0);
    });
});
