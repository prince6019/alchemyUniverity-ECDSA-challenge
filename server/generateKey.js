const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils.js");

const privKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privKey, true);
console.log("privateKey: ", toHex(privKey));
console.log("publicKey: ", toHex(publicKey));
