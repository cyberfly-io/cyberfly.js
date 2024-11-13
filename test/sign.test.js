import { CyberflySDK } from "@cyberfly-io/client";


const client  =new  CyberflySDK('https://node.cyberfly.io')

const keyPair = client.generateKeyPair();

client.setSecretKey(keyPair.secretKey)

const msg = {"hello":"world"}

const sig = client.signing.signData(msg)
console.log(sig)

console.log(client.signing.verifySignature(msg, sig, keyPair.publicKey))
