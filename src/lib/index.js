import { GraphQLClient } from 'graphql-request'
import { io } from "socket.io-client";
import { SigningManager } from './signing.js';
import { QUERIES } from './queries.js';
import { MUTATIONS } from './mutations.js';
import { ObjectType, AggregationType, SortOrder } from './constants.js';

class CyberflySDK {
  constructor(endpoint, secretKey = null) {
    this.graphql_endpoint = endpoint+'/graphql'
    this.client = new GraphQLClient(this.graphql_endpoint)
    this.signing = new SigningManager(secretKey);
    this.socket = io(endpoint);
    this.socket.on('connect', () => {
      console.log(`Connected to ${endpoint}`);
    });
  }

  // Key Management
  generateKeyPair() {
    return this.signing.generateKeyPair();
  }

   subscribe(topic) {
    return this.socket.emit("subscribe", topic);
  }
  
   publish(topic, msg) {
    return this.socket.emit("publish", {topic:topic, message:msg});
  }

  onReceive(callBack) {
    this.socket.on('onmessage', (data) => {
      const {topic, message} = data
      try {
          callBack(message, topic);
      } catch (e) {
        console.log(e);
      }
    });
  }

  setSecretKey(secretKey) {
    this.signing.setSecretKey(secretKey);
  }

   // System Information
   async getSystemInfo() {
    const data = await this.client.request(QUERIES.GET_SYSTEM_INFO)
    return data.sysInfo
  }

  // Node Information  
  async getNodeInfo() {
    const data = await this.client.request(QUERIES.GET_NODE_INFO)
    return data.nodeInfo
  }

  // Database Operations
  async createDatabase(dbinfo) {
    const signature = this.signing.signData(dbinfo)
    
    const data = await this.client.request(MUTATIONS.CREATE_DATABASE, {input:{
      
        dbinfo,
        sig: signature,
        pubkey: this.signing.publicKey
    }})
    return data.createDatabase
  }

  async updateData({ dbaddr, data: inputData, objectType, _id = null }) {
    const signature = this.signing.signData(inputData)
    
    const data = await this.client.request(MUTATIONS.UPDATE_DATA, {input:{
     
        dbaddr,
        data: inputData,
        objectType,
        sig: signature,
        publicKey: this.signing.publicKey,
        _id
    }})
    return data.updateData
  }

  async updateTS({ dbaddr, data: inputData, _id = null }){
    const objectType = "ts"
    const res = updateData({dbaddr, inputData, objectType,_id})
  }

  async updateGEO({ dbaddr, data: inputData, _id = null }){
    const objectType = "geo"
    const res = updateData({dbaddr, inputData, objectType,_id})
  }

  async updateStream({ dbaddr, data: inputData, _id = null }){
    const objectType = "stream"
    const res = updateData({dbaddr, inputData, objectType,_id})
  }
  async updateJSON({ dbaddr, data: inputData, _id = null }){
    const objectType = "json"
    const res = updateData({dbaddr, inputData, objectType,_id})
  }

  async readDB(dbaddr, filters = {}, options = {}) {
    const data = await this.client.request(QUERIES.READ_DB, {
      dbaddr,
      filters,
      options
    })
    return data.readDB
  }
  // Additional methods...
}

// Export constants
export { ObjectType, AggregationType, SortOrder };

// Export main SDK
export default CyberflySDK;