const options = require('../lib/options');
function optionsCommand(msg, args, command, client){
    let subcommand = args[0];
    let namespace = args[1];
    let name = args[2];
    let value = args[3];
    console.log(options);
    switch(subcommand){
        case 'list':
            let message = ["."];
            for(let key of options.all()){
                message.push(`**${key}**`);
                for(let subkey of options(key).list()){
                    message.push(`${subkey}: ${JSON.stringify(options(key).get(subkey))}`)
                }
            }
            msg.channel.send(message.join("\n"));
            return;

        case 'set':
            try{
                options(namespace).set(name, JSON.parse(value));
                msg.channel.send("Option set successfully");
            } catch (e) {
                msg.channel.send(`Could not set option: ${e}`);
            }
            return;

        case 'get':
            msg.channel.send(`Current value is: ${JSON.stringify(options(namespace).get(name))}`);
            return;
    }
}
module.exports = optionsCommand;