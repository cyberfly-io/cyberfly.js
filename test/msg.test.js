import { CyberflySDK } from "@cyberfly-io/client";

async function example() {
    try {
      const sdk = new CyberflySDK('https://node.cyberfly.io');
  
      sdk.setSecretKey("0476b401cdf8f80279edd2b61ccd3708bfbc6196ba5e6ce321867c84f5d5a216");
      const pubkey = sdk.signing.publicKey
      const msg = {fromAccount:`k:${pubkey}`,message:"hello from client js"}

      sdk.sendMessage("03df480e0b300c52901fdff265f0460913fea495f39972321698740536cc38e3", msg)
      sdk.subscribe("03df480e0b300c52901fdff265f0460913fea495f39972321698740536cc38e3")
      sdk.onReceive((msg) => {
        console.log("Received message: ", msg)
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }

  example();