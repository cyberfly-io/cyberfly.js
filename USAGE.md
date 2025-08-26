# Cyberfly SDK Usage Guide

## Installation

```bash
npm install @cyberfly-io/client
```

---

## Basic Usage

```js
import { CyberflySDK } from '@cyberfly-io/client';

const endpoint = 'https://your-cyberfly-endpoint.com';
const sdk = new CyberflySDK(endpoint);

// Connect to socket events
sdk.onConnect(() => {
  console.log('Connected!');
});
```

---

## Cryptography

### Generate X25519 Key Pair

```js
import { generateX25519KeyPair } from '@cyberfly-io/client/dist/utils';

const keyPair = generateX25519KeyPair();
console.log(keyPair.publicKey, keyPair.privateKey);
```

### Generate X25519 Key Pair from Mnemonic

```js
import { generateX25519FromMnemonic } from '@cyberfly-io/client/dist/utils';

const mnemonic = 'your twelve word bip39 mnemonic here';
const keys = generateX25519FromMnemonic(mnemonic);
console.log(keys.x25519.publicKey, keys.x25519.secretKey);
```

---

## Messaging

### Subscribe and Publish

```js
sdk.subscribe('my-topic');
sdk.publish('my-topic', { hello: 'world' });
```

### Send and Receive Messages

```js
sdk.onReceive((message, topic) => {
  console.log('Received:', message, 'on topic:', topic);
});

sdk.sendMessage('receiverPublicKey', { text: 'Hello!' });
```

---

## Queries

### Read Database

```js
const dbaddr = 'your-db-address';
sdk.readDB(dbaddr).then(data => {
  console.log('DB Data:', data);
});
```

### Read Stream

```js
sdk.readStream(dbaddr, 'streamName').then(stream => {
  console.log('Stream:', stream);
});
```

### Read Time Series

```js
sdk.readTimeSeries(dbaddr, 'fromTimestamp', 'toTimestamp').then(ts => {
  console.log('Time Series:', ts);
});
```

### Read Sorted Set

```js
sdk.readSortedSet(dbaddr, 'minTimestamp', 'maxTimestamp').then(sortedSet => {
  console.log('Sorted Set:', sortedSet);
});
```

### Read Chat History

```js
sdk.readChatHistory('your-stream-name').then(history => {
  console.log('Chat History:', history);
});
```

---

## GEO Queries

### Get Distance

```js
sdk.getDistance(dbaddr, 'locationLabel', 'member1', 'member2', 'unit').then(distance => {
  console.log('Distance:', distance);
});
```

### Get Position

```js
sdk.getPosition(dbaddr, 'locationLabel', 'member').then(position => {
  console.log('Position:', position);
});
```

### Get GeoHash

```js
sdk.getGeoHash(dbaddr, 'locationLabel', 'member').then(geoHash => {
  console.log('GeoHash:', geoHash);
});
```

### Geo Search

```js
sdk.geoSearch(dbaddr, 'locationLabel', 12.34, 56.78, 1000, 'm').then(results => {
  console.log('Geo Search Results:', results);
});
```

### Geo Search With

```js
sdk.geoSearchWith(dbaddr, 'locationLabel', 'member', 1000, 'm').then(results => {
  console.log('Geo Search With Results:', results);
});
```

---

## Signing

### Generate Key Pair

```js
const keyPair = sdk.generateKeyPair();
console.log(keyPair);
```

### Set Secret Key

```js
sdk.setSecretKey('your-secret-key');
```

---

## Testing

You can find more usage examples in the `/test` folder:
- `basic.test.js`: Basic SDK usage
- `crypto.test.js`: Cryptography functions
- `msg.test.js`: Messaging and pubsub
- `query.test.js`: Querying data
- `sign.test.js`: Signing and key management

---

For more details, refer to the