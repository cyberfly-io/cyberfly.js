import { generateX25519FromMnemonic, generateX25519KeyPair, encrypt, decrypt } from "@cyberfly-io/client";

const sender_keyPair = generateX25519FromMnemonic("torch future dress cotton chunk inject peanut chunk oblige search ghost torch");

const receiver_Keypair = generateX25519KeyPair()

console.log("Sender keypair: ", sender_keyPair) 
console.log("Receiver keypair: ", receiver_Keypair)


const msg = "mytopsecret"

const encryptedMsg = encrypt(msg, receiver_Keypair.publicKey, sender_keyPair.privateKey)

console.log(`Encrypted msg: ${encryptedMsg}`)

const decryptedMsg = decrypt(encryptedMsg, sender_keyPair.publicKey, receiver_Keypair.privateKey)


console.log(`Decrypted msg: ${decryptedMsg}`)