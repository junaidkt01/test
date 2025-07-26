const bcrypt = require('bcrypt');
//import bcrypt from 'bcrypt';

async function encryptString(stringToEncrypt) {
  const saltRounds = 10; // You can adjust this value for more security
  try {

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(stringToEncrypt, salt);
    return hash;
  } catch (error) {
    console.error("Error hashing stringToEncrypt :", error);
    throw error;
  }
}


async function checkEcryptString(stringToChk, hashedString) {
  try {
    const match = await bcrypt.compare(stringToChk, hashedString);
    return match;
  } catch (error) {
    console.error("Error checking password:", error);
    throw error;
  }
}

//Function to demonstrate usage
async function main() {
    const plainPassword = "mySecretPassword";
    const hashedPassword = await encryptString(plainPassword);
    console.log("Hashed password:", hashedPassword);

    const isMatch = await checkEcryptString("mySecretPassword", hashedPassword);
    console.log("Password match:", isMatch);

    const isWrongMatch = await checkEcryptString("wrongPassword", hashedPassword);
    console.log("Wrong password match:", isWrongMatch);
}

//main().catch(console.error);



//str = "Davis Kurian"

//console.log(checkEcryptString(secondString, myString))

module.exports = { encryptString, checkEcryptString}; 