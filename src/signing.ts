import { genKeyPair, restoreKeyPairFromSecretKey, verifySig, sign, hashBin, hexToBin} from '@kadena/cryptography-utils';

export class SigningManager {
  publicKey:string
  secretKey:string
  constructor(secretKey = null) {
    if (secretKey) {
      this.setSecretKey(secretKey);
    }
  }

  generateKeyPair() {
    const keyPair = genKeyPair()
   return keyPair
  }

  setSecretKey(sk:string) {
    const keyPair = restoreKeyPairFromSecretKey(sk)
    this.publicKey = keyPair.publicKey;
    this.secretKey = keyPair.secretKey
  }

  signData(data:any) {
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
    const signedMessage = sign(msg, {publicKey:this.publicKey, secretKey:this.secretKey})
    return signedMessage.sig
  }

  verifySignature(data:any, signature:string, publicKey:string) {
    const sortedJsondata = Object.keys(data)
    .sort() // Sort the keys
    .reduce((obj, key) => {
        obj[key] = data[key]; // Build a new sorted object
        return obj;
    }, {});
    const jsonstr = JSON.stringify(sortedJsondata)
    const verify = verifySig(hashBin(jsonstr), hexToBin(signature), hexToBin(publicKey));
    return verify
  }
}
