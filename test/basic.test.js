import { CyberflySDK } from "../dist/index.js";
async function example() {
    try {
      // Initialize the SDK
      const sdk = new CyberflySDK('https://node.cyberfly.io');
  
      // Generate a new key pair
      const keyPair = sdk.generateKeyPair();
      console.log('Generated Key Pair:', keyPair);
  
      // Or use an existing secret key
      sdk.setSecretKey(keyPair.secretKey);
  
      // Create a new database
      /*const dbCreation = await sdk.createDatabase({
        name: 'test-db'
      });
      console.log('Database Creation:', dbCreation);
  
      if (dbCreation.dbaddr) {
        // Update JSON data
        const jsonUpdate = await sdk.updateData({
          dbaddr: dbCreation.dbaddr,
          data: { 
            key: 'value',
            timestamp: Date.now()
          },
          objectType: 'json'
        });
        console.log('JSON Update:', jsonUpdate);
  
        // Update stream data
        const streamUpdate = await sdk.updateData({
          dbaddr: dbCreation.dbaddr,
          data: { 
            streamName: 'myStream',
            message: 'Hello World',
            timestamp: Date.now()
          },
          objectType: 'stream'
        });
        console.log('Stream Update:', streamUpdate);
  
        // Update time series data
        const tsUpdate = await sdk.updateData({
          dbaddr: dbCreation.dbaddr,
          data: { 
            value: 42.5,
            labels: {
              sensor: 'temperature',
              location: 'room1'
            }
          },
          objectType: 'ts'
        });
        console.log('Time Series Update:', tsUpdate);
  
        // Update geo data
        const geoUpdate = await sdk.updateData({
          dbaddr: dbCreation.dbaddr,
          data: { 
            latitude: 37.7749,
            longitude: -122.4194,
            member: 'san-francisco'
          },
          objectType: 'geo'
        });
        console.log('Geo Update:', geoUpdate);
  
        // Read back the data
        
      }*/
     sdk.subscribe("test")
     sdk.onReceive((msg, topic)=>{
      console.log(topic)
      console.log(msg)
     })
        const dbData = await sdk.readDB("/orbitdb/zdpuAzU5gpTmtSPUpHYZjHLQsWoWgaXLW388p6XssNubbBa2u");
        console.log(dbData)
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  example()