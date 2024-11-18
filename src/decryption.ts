import { hexToBin } from '@kadena/cryptography-utils';
import nacl from 'tweetnacl';
import pkg from 'tweetnacl-util';
const { decodeBase64, encodeUTF8 } = pkg;

export const decrypt = (encryptedData:any, publicKey:string, privateKey:string)=> {
    const [receivedBase64Nonce, receivedBase64EncryptedMessage] = encryptedData.split(':');
    const receivedNonce = decodeBase64(receivedBase64Nonce);
    const receivedEncryptedMessage = decodeBase64(receivedBase64EncryptedMessage);
    // Decrypt the message using the secret key and received nonce
    const decryptedMessage = nacl.box.open(receivedEncryptedMessage, receivedNonce, hexToBin(publicKey),hexToBin(privateKey));
    return encodeUTF8(decryptedMessage);
    }