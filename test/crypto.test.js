import { encrypt, decrypt, generateX25519KeyPair, getX25519KeyPair } from "@cyberfly-io/client";


const sender_keyPair = generateX25519KeyPair()
const receiver_Keypair = generateX25519KeyPair()


const msg = "mytopsecret"

const encryptedMsg = encrypt(msg, receiver_Keypair.publicKey, sender_keyPair.privateKey)

console.log(`Encrypted msg: ${encryptedMsg}`)

const decryptedMsg = decrypt(encryptedMsg, sender_keyPair.publicKey, receiver_Keypair.privateKey)


console.log(`Decrypted msg: ${decryptedMsg}`)
