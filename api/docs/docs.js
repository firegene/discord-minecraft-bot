const readFile = require('../../bot/lib/FileReader.js')
const express = require('express')
const app = express()

app.get('/docs', async function(req, res){
  try {
  res.send(await readFile.read('./docs.html')) } catch(e){console.log(e)}
})

module.exports = app