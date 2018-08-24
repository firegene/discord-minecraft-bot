function safeEval(msg, args, command, client) {
  if (msg.author.id !== '236448694172516353') return;

const content = msg.content.split(' ').slice(1).join(' ');
const result = new Promise((resolve, reject) => resolve(eval(content)));

return result.then(output => {
 if (typeof output !== 'string') output = require('util').inspect(output, {
 depth: 0
 });
 if (output.includes(client.token)) output = output.replace(client.token, 'Not for your eyes');
 if (output.length > 1990) console.log(output), output = 'Too long to be printed (content got console logged)';

 return msg.edit(output, {code: 'js'});
}).catch(err => {
 console.error(err);
 err = err.toString();

 if (err.includes(client.token)) err = err.replace(client.token, 'Not for your eyes');

 return msg.edit(err, {code: 'js'});
});
}

module.exports = safeEval