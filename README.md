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

---

## Usage Guide

See [USAGE.md](./USAGE.md) for full documentation and code examples covering:

- Basic usage
- Cryptography (key generation, mnemonic)
- Messaging (subscribe, publish, send/receive)
- Database and stream queries
- GEO queries (distance, position, geohash, search)
- Signing