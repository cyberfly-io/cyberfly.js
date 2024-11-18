import { binToHex } from '@kadena/cryptography-utils';
import nacl from 'tweetnacl';

export const generateX25519KeyPair = ()=> {
    const keyPair = nacl.box.keyPair();
    return {
      publicKey: binToHex(keyPair.publicKey),
      privateKey: binToHex(keyPair.secretKey),
    };
  }

