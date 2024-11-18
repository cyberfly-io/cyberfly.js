import { hexToBin } from '@kadena/cryptography-utils';
import nacl from 'tweetnacl';
import pkg from 'tweetnacl-util';
const { encodeBase64, decodeUTF8 } = pkg;
export const encrypt = (data:any, publicKey:string, privateKey:string)=>{
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const encryptedMessage = nacl.box(decodeUTF8(data), nonce, hexToBin(publicKey),hexToBin(privateKey));
    const base64Nonce = encodeBase64(nonce);
    const base64EncryptedMessage = encodeBase64(encryptedMessage);
    return base64Nonce + ':' + base64EncryptedMessage;
  }