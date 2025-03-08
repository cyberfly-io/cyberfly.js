import { binToHex } from '@kadena/cryptography-utils';
import nacl from 'tweetnacl';

export const generateX25519KeyPair = ()=> {
    const keyPair = nacl.box.keyPair();
    return {
      publicKey: binToHex(keyPair.publicKey),
      privateKey: binToHex(keyPair.secretKey),
    };
  }


  export const getStreamName = (senderKey: string, receiverKey: string)=>{
    const sortedKeys = [senderKey, receiverKey].sort();
    const concatenatedKeys = sortedKeys.join('');
    return concatenatedKeys
  }