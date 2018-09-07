const browserApi = require('../../bot/lib/browser-extension');
const express = require('express')
const app = express()

app.get('/all', async function(req, res){
    try {
      res.send(browserApi.getPosts())
    } catch(e){
      console.error(e);
    }
  });

app.get('/:page', async function(req, res){
    try {
      if(!req.params.page.isInteger) {
        res.sendStatus
      }
      let posts = browserApi.getPosts();
      var post = posts[req.params.page];
      res.send(post)
    } catch(e){
      console.error(e);
    }
  });

module.exports = app;