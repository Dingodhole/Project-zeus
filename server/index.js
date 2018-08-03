import { logErrors, errorHandler } from './error'
import express from 'express'
import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import api from './api'
import fs from 'fs'
import http from 'http'
import https from 'https'

const app = express()
// const PORT = process.env.PORT || 5000
const DOMAIN = process.env.DOMAIN

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/${DOMAIN}/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/${DOMAIN}/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/${DOMAIN}/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
}

// setup the logger
app.use(morgan('tiny'))

// Priority serve static files.
app.use(express.static(path.join(__dirname, '../front-end/build')))

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Handling errors
app.use(logErrors)
app.use(errorHandler)

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use('/api', api)

// For everything else return React so react can do extra routing
app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../front-end/build', 'index.html'))
})

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
})

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
})
