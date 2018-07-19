const Discord = require("discord.js");
const client = new Discord.Client();
let ms = require("./minestat");
let prefix = ".";

client.on("ready", () => {
  console.log("Logged in as ${client.user.tag}");
});

client.on("message", (msg) => {

 const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
 const command = args.shift().toLowerCase();
 
  if (command === "server") {
    ms.init('198.50.141.83', 25565, function(result)
{
  console.log("Minecraft server status of " + ms.address + " on port " + ms.port + ":");
  if(ms.online)
  {
    msg.channel.send("**Server status:** online\n**Server version:** ${ms.version}\n**Players:** ${ms.current_players}/${ms.max_players}")
  }
  else
  {
    msg.channel.send("Server is offline!");
  }
});
  }
});

client.login("token");
