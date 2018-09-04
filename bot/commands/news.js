let BrowserExtensionAPI = require('../lib/browser-extension');
let moment = require('moment');

function showNews(msg, args, command, client) {
  let posts = BrowserExtensionAPI.getPosts();
  if (args[0] === "blame") {
    msg.channel.send("Most recent news uploaded by: " + BrowserExtensionAPI.getBlame().split(".")[0] + " " + moment(BrowserExtensionAPI.getBlameDate()).fromNow());
    return;
  }
  if (args[0] === "count") {
    msg.channel.send("There are " + posts.length + " news articles on the first page");
    return;
  }
  if (args[0] === "all") {
    let out = "All news on the first page:\n";
    let index = 1;
    for (let post of posts) {
      out += `\n**[${index}]** ${post.title.replace("\n", "")}`;
      index++
    }
    msg.channel.send(out);
    return;
  }
  if (args[0] === "article") {
    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    if (Number.isInteger(args[1])) {
      msg.channel.send('Please specify which article to display.');
      return;
    }
    let index = Number(args[1]) - 1;
    if (args[1] < 1 || posts.length < args[1]) {
      msg.channel.send(`Please specify a valid article to display. There are currently ${posts.length} news articles on the first page.`);
      return;
    }


    if (isNaN(index)) {
      msg.channel.send(`Please specify a valid article to display. There are currently ${posts.length} news articles on the first page.`)
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
    return;
  }
}

module.exports = showNews;