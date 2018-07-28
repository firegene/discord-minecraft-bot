const Discord = require("discord.js");
const client = new Discord.Client();
let ms = require("./minestat");
const snekfetch = require('snekfetch');
let prefix = "!";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

});

client.on("message", async (msg) => {
 if (msg.author.bot) return;
 if (msg.content.indexOf(prefix) !== 0) return;
 const args = msg.content.slice(prefix.length).trim().split(/ +/g);
 const command = args.shift().toLowerCase();
  
  if (command === "botping") {msg.channel.send('Pinging...').then(sent => {
    sent.edit(`:ping_pong: Pong! Took ${sent.createdTimestamp - msg.createdTimestamp}ms`);
});
};
 
  if (command === "server") {
    ms.init('198.50.141.83', 25565, function(result)
{
  console.log("Minecraft server status of " + ms.address + " on port " + ms.port + ":");
  if(ms.online)
  { 
    msg.channel.send({
  "embed": {
    "url": "https://discordapp.com",
    "color": 1234643,
    "thumbnail": {
      "url": "https://api.minetools.eu/favicon/198.50.141.83/25565"
    },
    "author": {
      "name": "SwancraftMC",
      "url": "https://www.swancraftmc.com/"
    },
    "fields": [
      {
        "name": "Server status",
        "value": "Online ✓"
      },
      {
        "name": "Server IP",
        "value": "play.swancraftmc.com"
      },
      {
        "name": "Server version",
        "value": ms.version
      },
      {
        "name": "Players",
        "value": `${ms.current_players}/${ms.max_players}`
      }
    ]
  }
});
  }
  else
  {
    msg.channel.send("Server is offline. Please try again later.");
  }
});
  };

if(command === "phistory") {
  const res = await snekfetch.get(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`);
  let id = res.body.id
  const his = await snekfetch.get(`https://api.mojang.com/user/profiles/${id}/names`);
  let map = his.body.reverse().map(o => o.name + ' : [' + (o.changedToAt === undefined ? 'ORIGINAL NAME' : new Date(o.changedToAt).toDateString()) + ']')
  let newmap = map.join('\n')
  msg.channel.send({
  "embed": {
    "color": 1234643,
    "fields": [
      {
        "name": `${args[0]}'s name history`,
        "value": newmap 
      }
    ]
  }
})

    .catch(error => {
    msg.channel.send("The username provided is incorrect.")
  });
};
  
if(command === "vote") {
msg.channel.send({
  "embed": {
    "color": 1234643,
    "author": {
      "name": "SwancraftMC Voting",
      "url": "https://www.swancraftmc.com/vote"
    },
    "fields": [
      {
        "name": "Vote links",
        "value": "[Planet Minecraft](https://planetminecraft.com/server/swancraft-3882768/vote/)\n[Minecraft Servers](http://minecraftservers.org/vote/410424)\n[Minecraft Server List](http://minecraft-server-list.com/server/389267/vote/)\n[TopG](http://topg.org/Minecraft/in-449700)\n[Minecraft-Server](https://goo.gl/VeyXyQ)\n[Minecraft MP](http://minecraft-mp.com/server/145239/vote/)\n[Minecraft Forum](https://minecraftservers.biz/servers/73758/)"
      }
    ]  
  }
})
}
  
if (command === 'ban') {
let argMember; 
try{
   argMember = await msg.guild.fetchMember(args[0])
} catch(err) {
    msg.channel.send("That user can not be found")
    return;
};

  if(msg.member.hasPermission('BAN_MEMBERS') && argMember.bannable && msg.member.highestRole.comparePositionTo(argMember.highestRole) > 0) {
    msg.guild.ban(argMember);
  } else {
    msg.channel.send("Someone doesn't have enough permissions :thinking:");
};
}
  
if (command === 'kick') {
let argMember; 
try{
   argMember = await msg.guild.fetchMember(args[0])
} catch(err) {
    msg.channel.send("That user can not be found.")
    return;
};

  if(msg.member.hasPermission('KICK_MEMBERS') && argMember.kickable && msg.member.highestRole.comparePositionTo(argMember.highestRole) > 0) {
    msg.channel.send(`I have kicked ${argMember.displayName}.`)
    argMember.kick();
  } else {
    msg.channel.send("Someone doesn't have enough permissions :thinking:");
};
}
});

client.login('token');
