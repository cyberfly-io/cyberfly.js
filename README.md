# cyberfly node client


```typescript

import { CyberflySDK } from "@cyberfly-io/client";

const client = new CyberflySDK('https://node.cyberfly.io');

client.setSecretKey("your secret key");

client.subscribe("test")

client.onReceive((msg, topic)=>{
      console.log(topic)
      console.log(msg)
     })

const dbData = await client.readDB("/orbitdb/zdpuAzU5gpTmtSPUpHYZjHLQsWoWgaXLW388p6XssNubbBa2u");
console.log(dbData)

```