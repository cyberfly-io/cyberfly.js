import { binToHex, hexToBin } from '@kadena/cryptography-utils';
import nacl from 'tweetnacl';
import { mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { derivePath } from 'ed25519-hd-key';

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
  const seed = ed25519SecretKey.slice(0, 32);
  const x25519KeyPair = nacl.box.keyPair.fromSecretKey(seed);
  return {
    publicKey: binToHex(x25519KeyPair.publicKey),
    privateKey: binToHex(x25519KeyPair.secretKey),
  }
}

export const generateX25519FromMnemonic = (mnemonic: string, path: string = "m/44'/626'/0'") => {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid BIP39 mnemonic');
  }
  const words = mnemonic.trim().split(/\s+/);
  if (words.length !== 12) {
    throw new Error('Mnemonic must be 12 words');
  }
  const seed = mnemonicToSeedSync(mnemonic); // Buffer
  const { key  } = derivePath(path, seed.toString('hex'));
  const edSeed = Uint8Array.from(key);
  const x25519 = nacl.box.keyPair.fromSecretKey(edSeed);
  return {
      publicKey: binToHex(x25519.publicKey),
      privateKey: binToHex(x25519.secretKey)
  };
}

export const getStreamName = (senderKey: string, receiverKey: string)=>{
  const sortedKeys = [senderKey, receiverKey].sort();
  const concatenatedKeys = sortedKeys.join('');
  return concatenatedKeys
}