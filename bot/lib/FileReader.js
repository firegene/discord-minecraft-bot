const fs = require('fs');
/**
* Reads the contents of a file into a string
* @param filename - The name of the file (specified as a relative path)
* @param encoding - Which encoding to parse the file as (by default we assume UTF-8)
*/
async function readIntoString(filename, encoding='utf8'){
  let p = new Promise(function(resolve, reject){
    fs.readFile(filename, encoding, function (err,data) {
      if (err) {
        reject(err)
      }
      resolve(data);
    });
  });
  return p;
}


module.exports.read = readIntoString;