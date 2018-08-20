let BrowserExtensionAPI = require('../lib/browser-extension');

function showNews(msg, args, command, client){
    let posts = BrowserExtensionAPI.getPosts();
    if (args[0] === "blame") {
        msg.channel.send("Most recent news uploaded by: " + BrowserExtensionAPI.getBlame().split(".")[0]);
        return;
    }
    if (args[0] === "count") {
        msg.channel.send("There are " + posts.length + " news articles on the first page");
        return;
    }
    if (args[0] === "all") {
        let out = "All news on the first page:\n";
        for (let post of posts) {
            out += "\n" + post.title;
        }
        msg.channel.send(out);
        return;
    }


    msg.channel.send({
        "embed": {
            "description": `[${posts[0].title}](${posts[0].link})`,
            "color": 1234643,
            "footer": {
                "text": posts[0].time
            },
            "author": {
                "name": "News and Announcements",
                "url": "https://www.swancraftmc.com/forum/m/39419318/viewforum/7509935"
            },
            "fields": [
                {
                    "name": posts[0].author,
                    "value": posts[0].content
                }
            ]
        }
    })
}

module.exports = showNews;