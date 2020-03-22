module.exports = (msg, args, command, client) => {
  msg.channel.send(
    //change from here
    {
      "embed": {
        "color": 1234643,
        "author": {
          "name": "SwancraftMC Voting",
          "url": "https://www.swancraftmc.com/vote"
        },
        "fields": [
          {
            "name": "Vote links",
            "value": "[Planet Minecraft](https://planetminecraft.com/server/swancraft-3882768/vote/)\n" +
              "[Minecraft Servers](http://minecraftservers.org/vote/410424)\n" +
              "[Minecraft Server List](http://minecraft-server-list.com/server/389267/vote/)\n" +
              "[TopG](http://topg.org/Minecraft/in-449700)\n" +
              "[Minecraft-Server](https://goo.gl/VeyXyQ)\n" +
              "[Minecraft MP](http://minecraft-mp.com/server/145239/vote/)\n" +
              "[Minecraft Forum](https://minecraftservers.biz/servers/73758/)"
          }
        ]
      }
    }
    //to here if you add more vote links
  )
};