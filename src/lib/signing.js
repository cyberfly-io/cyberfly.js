import Pact from 'pact-lang-api'
import { genKeyPair} from '@kadena/cryptography-utils';



export class SigningManager {
  constructor(secretKey = null) {
    if (secretKey) {
      this.setSecretKey(secretKey);
    }
  }

  generateKeyPair() {
    const keyPair = genKeyPair()
   return keyPair
  }

  setSecretKey(sk) {
    const keyPair = Pact.crypto.restoreKeyPairFromSecretKey(sk)
    this.publicKey = keyPair.publicKey;
    this.secretKey = keyPair.secretKey
  }

  signData(data) {
    if (!this.secretKey) {
      throw new Error('Secret key not set. Please call setSecretKey() first.');
    }
    const sortedJsondata = Object.keys(data)
    .sort() // Sort the keys
    .reduce((obj, key) => {
        obj[key] = data[key]; // Build a new sorted object
        return obj;
    }, {});
    const msg = JSON.stringify(sortedJsondata);
    const signedMessage = Pact.crypto.sign(msg, {publicKey:this.publicKey, secretKey:this.secretKey})
    return signedMessage.sig
  }

  verifySignature(data, signature, publicKey) {
    const sortedJsondata = Object.keys(data)
    .sort() // Sort the keys
    .reduce((obj, key) => {
        obj[key] = data[key]; // Build a new sorted object
        return obj;
    }, {});
    const verify = Pact.crypto.verifySignature(JSON.stringify(sortedJsondata), signature, publicKey);
  }
}