import { CyberflySDK } from "@cyberfly-io/client";
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
      const dbCreation = await sdk.createDatabase({
        name: 'test-db'
      });
      console.log('Database Creation:', dbCreation);
  
      if (dbCreation.dbaddr) {
        // Update JSON data
        const jsonUpdate = await sdk.updateJSON({
          dbaddr: dbCreation.dbaddr,
          data: { 
            hello: "world",
            timestamp: Date.now()
          },
        });
        console.log('JSON Update:', jsonUpdate);
  
        // Update stream data
        const streamUpdate = await sdk.updateStream({
          dbaddr: dbCreation.dbaddr,
          data: { 
            streamName: 'myStream',
            message: 'Hello World',
            timestamp: Date.now()
          }
        });
        console.log('Stream Update:', streamUpdate);
  
        // Update time series data
        const tsUpdate = await sdk.updateTS({
          dbaddr: dbCreation.dbaddr,
          data: { 
            value: 42.5,
            timestamp: Date.now(),
            labels: {
              sensor: 'temperature',
              location: 'room1'
            }
          },
        });
        console.log('Time Series Update:', tsUpdate);
  
        // Update geo data
        const geoUpdate = await sdk.updateGEO({
          dbaddr: dbCreation.dbaddr,
          data: { 
            locationLabel:"Cities",
            latitude: 37.7749,
            longitude: -122.4194,
            member: 'san-francisco'
          },
        });
        console.log('Geo Update:', geoUpdate);
  
        // Read back the data
        
      }
     sdk.onConnect(()=>{
      sdk.subscribe("test")
     })
     sdk.onReceive((msg, topic)=>{
      console.log(topic)
      console.log(msg)
     })
        const dbData = await sdk.readDB(dbCreation.dbaddr);
        console.log(dbData)
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  example()