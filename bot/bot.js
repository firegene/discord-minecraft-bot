const Discord = require("discord.js");
const client = new Discord.Client();
const express = require('express');
const prefix = "!";
let nsfw = ["pornhub.com/", "rule34.xxx/", "xhamster.com/"]

// IMPORT COMMANDS HERE
const minecraftServerCommands = require('./commands/server');
const command_playerMcNameHistory = require('./commands/phistory');
const command_voteLinks = require('./commands/vote');
const selfCommands = require('./commands/discordSelf');
const moderationCommands = require('./commands/discordModeration');
const nicknameCommands = require('./commands/discordNames');
const command_news = require('./commands/news');
const safeEval = require('./commands/highlySafeEval');
const FileReader = require('./lib/FileReader');
const command_options = require('./commands/options');
const optionsApp = require('./lib/options').express;
const NSFW = require('./lib/nsfw-filter');

const BrowserExtensionAPI = require('./lib/browser-extension.js')
const NewsAPI = require('../api/news/news');
const docs = require('../api/docs/docs.js')

let keys = process.env.BROWSER_API_KEYS.split(" ")
for(let key of keys){
  BrowserExtensionAPI.addApiKey(key); // Here
}


// region express
  var app = express();
  app.get('/', async function(req, res){
    try {
      res.send(await FileReader.read('./site/restart.html'))
    } catch(e){
      console.error(e);
    }
  });
  app.get('/ping', function (req, res) {
      res.send('I am running!');
  });

  /** Disable caching to make sure updates to the code show up in the browser*/
  app.use("/", (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
  app.get('/restart', async function (req, res) {
    try {
      res.send(await FileReader.read('./site/restart.html'))
    } catch(e){
      console.error(e);
    }
  });

  app.use("/extension", BrowserExtensionAPI.app);
  app.use("/options", optionsApp);
  app.use("/api/news", NewsAPI);
  app.use('/', docs)

  app.listen(process.env.PORT, function(){
      console.log(`Express listening on ${process.env.PORT}`)
  });
// endregion express


// region discord
  client.on("ready", () => {
      console.log(`Logged in as ${client.user.tag}`);
  });

  client.on("message", async (msg) => {
      // Ignore the bot's own messages
      if (msg.author.bot) return;

      // Instaban any users who post NSFW
      let msgContainsBlacklistedWord = nsfw.some(word => msg.content.toLowerCase().includes(word));
      if (msg.author.bannable && msgContainsBlacklistedWord) {
        msg.delete();
        msg.guild.ban(msg.author);
        return;
      }
      let clarifaiRating = 0;
      let embeds = msg.embeds.filter(e => e.type === 'image').map(e => e.url).concat(msg.attachments.map(a => a.url));
      if (embeds.length > 0) {
        let ratings = await NSFW(embeds);
        clarifaiRating = Math.max.apply(this, ratings);
      }
      if(clarifaiRating > 0.5){
        // TODO: Inform the admins or something;
      }
      // Ignore any messages that don't start with the prefix
      if (msg.content.indexOf(prefix) !== 0) return;

  // Available commands
  const commands = {
    "userid": (msg) => {
      msg.channel.send(msg.author.id);
    },
    "server": minecraftServerCommands.serverStatus,
    "phistory": command_playerMcNameHistory,
    "vote": command_voteLinks,

    "options": command_options,
    "botping": selfCommands.ping,
    "leave": selfCommands.leave,
    "eval": safeEval,

    "ban": moderationCommands.banPlayer,
    "kick": moderationCommands.kickPlayer,
    "warn": moderationCommands.warnPlayer,
    "view-warns": moderationCommands.showWarns,
    "delwarn": moderationCommands.removeWarn,
    "delallwarns": moderationCommands.removeAllWarns,

    "setname": nicknameCommands.setName,
    "name": nicknameCommands.getName,

    "news all": command_news.all,
    "news article": command_news.article,
    "news blame": command_news.blame,
    "news count": command_news.count,
    "restart": minecraftServerCommands.restartTime,

    // ADD COMMANDS HERE

    "listcommands": (msg) => msg.channel.send(`\`\`\`${Object.keys(commands).join("\n")}\`\`\``),
    "help": (msg) => {
      msg.channel.send({
        "embed": {
          "color": 1234643,
          "author": {
            "name": "Help Menu"
          },
          "fields": [
            {
              "name": "Server Commands",
              "value":
                "**server** - gives current info about the server.\n" +
                "**phistory <name>** - lists every name a player has used\n" +
                "**news** - gets the most recent post from news and announcements\n" +
                "**vote** - gives all voting links\n" +
                "**name <@user>** - views the users set ingame name\n" +
                "**setname** - sets the users ingame name",
                "**restart** - gives the time until next server restart"
            },
            {

              "name": "Bot Commands",
              "value":
                "**botping** - gives the current ping of the bot\n" +
                "**leave <@user>** - If @user is the bot itself, leaves the server\n" +
                "**help** - Shows this help page\n" +
                "**listcommands** - Lists all the commands that are registered, useful for debugging if the **help** text is out of date",
            },
            {
              "name": "Moderation Commands ",
              "value":
                "**kick <id>** - kicks a user from the discord\n" +
                "**ban <id>** - bans a user from the discord\n" +
                "**warn <@user>** - warns the mentioned user\n" +
                "**view-warns <@user>** - views the mentioned user's warnings\n" +
                "**delwarn <@user> <warn number>** - deletes the specified warning from the mentioned user\n" +
                "**delallwarns** - deletes all warns for the mentioned user"
            }
          ]
        }
      })
    }
  };

  // Separate the message into command and arguments parts
  const message = msg.content.slice(prefix.length).trim();

  let key = "";
  for(let candidate of Object.keys(commands)){
    let isCommand = (message.startsWith(candidate+" ") || message === candidate);
    let isLonger = key.length < candidate.length;
    if(isCommand && isLonger){
      key = candidate;
    }
  }
  let args = message.slice(key.length+1).split(/ +/g);

  // Run the command
  let handler = commands[key];
  if (handler === undefined) { // Unless it didn't match anything
    return;
  }
  handler(msg, args, key, client);

});
// endregion discord

client.login(process.env.DISCORD_API_TOKEN);