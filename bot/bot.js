const Discord = require("discord.js");
const client = new Discord.Client();
let ms = require(./minestat);
let prefix = ".";

client.on("ready", () => {
  console.log("Logged in as ${client.user.tag}");
});

client.on("message", (message) => {

 const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
 const command = args.shift().toLowerCase();
 
  if (command === "server") {
    ms.init('198.50.141.83', 25565, function(result)
{
  console.log("Minecraft server status of " + ms.address + " on port " + ms.port + ":");
  if(ms.online)
  {
    /*console.log("Server is online running version " + ms.version + " with " + ms.current_players + " out of " + ms.max_players + " players.");
    console.log("Message of the day: " + ms.motd);*/
    msg.channel.send("**Server status**: online\nServer version: ${ms.version}")
  }
  else
  {
    console.log("Server is offline!");
  }
});
  }
});

client.login("token");
