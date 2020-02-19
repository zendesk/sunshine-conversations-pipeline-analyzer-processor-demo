'use strict';

// Imports
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Analyzer = require('./analyzer');

let analyzer = new Analyzer();

express()
    .use(express.static('public'))
    .use(bodyParser.json()).get('/', function(req, res) {
        res.sendFile(__dirname + '/public/workbench.html');
    })
    //Pipeline processor
    .post('/analysis', analyze)
    //UNHANDLED POST
    .post('/*', function(req, res) {
        var payload = JSON.stringify(req.body, null, 4);
        console.log('webhook PAYLOAD:\n', payload);
        res.send('Gotcha');
    })
    .listen(process.env.PORT || 8008);
    

// Receive a message to analyze
async function analyze(req, res) {
    console.log('Reading message...');
    try {
        analyzer.analyze(req.body);
        return res.status(200).end();
    } catch (error) {
        console.error('Error dispatching messages', error);
        return res.status(500).end();
    }
}