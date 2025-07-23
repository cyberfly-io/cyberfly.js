import { binToHex, hexToBin } from '@kadena/cryptography-utils';
import nacl from 'tweetnacl';

export const generateX25519KeyPair = ()=> {
    const keyPair = nacl.box.keyPair();
    return {
      publicKey: binToHex(keyPair.publicKey),
      privateKey: binToHex(keyPair.secretKey),
    };
  }


export const getX25519KeyPair = (privateKey: string) => {
const kp = nacl.sign.keyPair.fromSeed(hexToBin(privateKey));
const ed25519PublicKey = kp.publicKey; // 32 bytes
const ed25519SecretKey = kp.secretKey; // 64 bytes (seed + public key)
// Step 2: Extract the seed from the Ed25519 secret key
// In tweetnacl-js, the first 32 bytes of the secretKey is the seed
const seed = ed25519SecretKey.slice(0, 32);

// Step 3: Generate an X25519 key pair from the same seed
// tweetnacl-js allows generating X25519 keys from a seed using nacl.box.keyPair.fromSecretKey
// However, we need to ensure the seed is compatible
const x25519KeyPair = nacl.box.keyPair.fromSecretKey(seed);
return {
  publicKey: binToHex(x25519KeyPair.publicKey),
  privateKey: binToHex(x25519KeyPair.secretKey),
}
  }

  export const getStreamName = (senderKey: string, receiverKey: string)=>{
    const sortedKeys = [senderKey, receiverKey].sort();
    const concatenatedKeys = sortedKeys.join('');
    return concatenatedKeys
  }