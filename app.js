'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')

const config = require('./config')
const dataService = require('./services/dataService')

const LunchCrew = require('./models/LunchCrew')

const app = express()

app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/', (request, response) => {
  response.send('lunchlotto')
})

app.get('/lunchCrew', (request, response) => {
  dataService.getLunchCrews()
    .then(lunchCrews => {
      response.send(lunchCrews)
    })
    .catch(error => {
      response.status(500).send(error)
    })
})

app.post('/lunchCrew', (request, response) => {
  var lunchCrew = new LunchCrew(request.body)

  if (!lunchCrew.validate()) {
    response.status(400).send(`Failed to validate ${JSON.stringify(request.body)}.`)
    return
  }

  dataService.insertLunchCrew(lunchCrew)
    .then(() => {
      response.sendStatus(200)
    })
    .catch(error => {
      response.status(500).send(error)
    })
})

dataService.connect(config.dbUrl)
  .then(listen)
  .catch(error => {
    console.error(error)
  })

function listen (port) {
  app.listen(port, () => {
    console.log(`App running on port ${port}`)
  })
}
