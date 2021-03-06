/*
 * minestat.js - A Minecraft server status checker
 * Copyright (C) 2016 Lloyd Dilley
 * http://www.dilley.me/
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

// For use with Node.js

const NUM_FIELDS = 6;   // number of values expected from server
let address = null;
let port = null;
let online = null;          // online or offline?
let version = null;         // server version
let motd = null;            // message of the day
let current_players = null; // current number of players online
let max_players = null;     // maximum player capacity

module.exports =
{
  init: function(address, port, callback)
  {
    this.address = address;
    this.port = port;

    const net = require('net');
    const client = net.connect(port, address, () =>
    {
      var buff = new Buffer([ 0xFE, 0x01 ]);
      client.write(buff);
    });

    // Set timeout to 5 seconds
    client.setTimeout(5000);

    client.on('data', (data) =>
    {
      if(data != null && data != '')
      {
        var server_info = data.toString().split("\x00\x00\x00");
        if(server_info != null && server_info.length >= NUM_FIELDS)
        {
          this.online = true;
          this.version = server_info[2].replace(/\u0000/g,'');
          this.motd = server_info[3].replace(/\u0000/g,'');
          this.current_players = server_info[4].replace(/\u0000/g,'');
          this.max_players = server_info[5].replace(/\u0000/g,'');
        }
        else
        {
          this.online = false;
        }
      }
      callback();
      client.end();
    });

    client.on('timeout', () =>
    {
      callback();
      client.end();
      process.exit();
    });

    client.on('end', () =>
    {
      // nothing needed here
    });

    client.on('error', (err) =>
    {
      // Uncomment the lines below to handle error codes individually. Otherwise,
      // call callback() and simply report the remote server as being offline.

      /*
      if(err.code == "ENOTFOUND")
      {
        console.log("Unable to resolve " + this.address + ".");
        return;
      }
      if(err.code == "ECONNREFUSED")
      {
        console.log("Unable to connect to port " + this.port + ".");
        return;
      }
      */

      callback();

      // Uncomment the line below for more details pertaining to network errors.
      //console.log(err);
     });
  }
};

