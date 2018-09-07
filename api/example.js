const express = require('express')
const app = express()

app.get('/html', async function(req, res){
  res.send("<html><head><style src=mystyle.css/></head><body><div>test</div></body></html>")
  res.end();
});

app.get('/mystyle.css', async function(req, res){
  res.send("* {border: 2px dashed red; width: 64px; height:64px}");
  res.end()  
});

module.exports = app;