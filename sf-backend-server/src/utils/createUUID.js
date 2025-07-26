
 const uuidByString = require('uuid-by-string');

function getUUID(seedString){
    const uuid = uuidByString(seedString + new Date().getTime());
    console.log(uuid);
    return uuid;
 }

 
module.exports = { getUUID };

