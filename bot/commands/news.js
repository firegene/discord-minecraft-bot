let BrowserExtensionAPI = require('../lib/browser-extension');
let moment = require('moment');

function news_blame(msg, args, command, client){
  msg.channel.send("Most recent news uploaded by: " + BrowserExtensionAPI.getBlame().split(".")[0] + " " + moment(BrowserExtensionAPI.getBlameDate()).fromNow());
}
function news_count(msg, args, command, client){
  let posts = BrowserExtensionAPI.getPosts();
  msg.channel.send("There are " + posts.length + " news articles on the first page");
}
function news_all(msg, args, command, client){
  let posts = BrowserExtensionAPI.getPosts();
    let out = "All news on the first page:\n";
    let index = 1;
    for (let post of posts) {
      out += `\n**[${index}]** ${post.title.replace("\n", "")}`;
      index++
    }
    msg.channel.send(out);
}
function news_article(msg, args, command, client){
    let posts = BrowserExtensionAPI.getPosts();
    let articleNr = args[0];
    if (Number.isInteger(articleNr)) {
      msg.channel.send('Please specify which article to display.');
      return;
    }
    let index = Number(articleNr) - 1;
    if (isNaN(index) || articleNr < 1 || posts.length < articleNr) {
      msg.channel.send(`Please specify a valid article to display. There are currently ${posts.length} news articles on the first page.`);
      return;
    }

    var post = posts[index];
    msg.channel.send({
      "embed": {
        "description": `[${post.title}](${post.link})`,
        "color": 1234643,
        "footer": {
          "text": post.time
        },
        "author": {
          "name": "News and Announcements",
          "url": "https://www.swancraftmc.com/forum/m/39419318/viewforum/7509935"
        },
        "fields": [{
          "name": post.author,
          "value": post.content
        }]
      }
    });
}


module.exports = {
  all: news_all,
  article: news_article,
  blame: news_blame,
  count: news_count
};