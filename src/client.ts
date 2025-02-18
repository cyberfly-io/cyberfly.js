import { GraphQLClient } from 'graphql-request'
import { io } from "socket.io-client";
import { SigningManager } from './signing.js';
import { QUERIES } from './queries.js';
import { MUTATIONS } from './mutations.js';

export class CyberflySDK {
  graphql_endpoint:string
  client:any
  signing:any
  socket:any
  constructor(endpoint:string, secretKey:string = null) {
    this.graphql_endpoint = endpoint.replace(/\/$/, "")+'/graphql'
    this.client = new GraphQLClient(this.graphql_endpoint)
    this.signing = new SigningManager(secretKey);
    this.socket = io(endpoint, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5
    });

    this.socket.on('connect', () => {
      console.log(`Connected to ${endpoint}`);
    });

    this.socket.on('disconnect', () => {
      console.log(`Disconnected from ${endpoint}. Attempting to reconnect...`);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected to ${endpoint} after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_failed', () => {
      console.log(`Failed to reconnect to ${endpoint}`);
    });
  }

  // Key Management
  generateKeyPair() {
    return this.signing.generateKeyPair();
  }

  subscribe(topic:string) {
    return this.socket.emit("subscribe", topic);
  }
  
  publish(topic:string, msg:any) {
    return this.socket.emit("publish", {topic:topic, message:msg});
  }

  pinDb(dbaddr:string){
    return this.socket.emit("publish", {topic:"pindb", message:JSON.stringify({dbaddr})})
  }

  onConnect(callBack:any){
    this.socket.on('connect', ()=>{
      callBack()
    })
  }

  onReceive(callBack:any) {
    this.socket.on('onmessage', (data) => {
      const {topic, message} = data
      try {
          callBack(message, topic);
      } catch (e) {
        console.log(e);
      }
    });
  }

  setSecretKey(secretKey:string) {
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
  async createDatabase(dbinfo:any) {
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
    this.pinDb(dbaddr)
    return data.updateData
  }

  async updateTS({ dbaddr, data: inputData, _id = null }){
    const objectType = "ts"
    const res = this.updateData({dbaddr, data:inputData, objectType,_id})
    return res

  }

  async updateGEO({ dbaddr, data: inputData, _id = null }){
    const objectType = "geo"
    const res = this.updateData({dbaddr, data:inputData, objectType,_id})
    return res

  }

  async updateStream({ dbaddr, data: inputData, _id = null }){
    const objectType = "stream"
    const res = this.updateData({dbaddr, data:inputData, objectType,_id})
    return res

  }
  async updateJSON({ dbaddr, data: inputData, _id = null }){
    const objectType = "json"
    const res = this.updateData({dbaddr, data:inputData, objectType,_id})
    return res
  }

  async readDB(dbaddr:string, filters = {}, options = {}) {
    const data = await this.client.request(QUERIES.READ_DB, {
      dbaddr,
      filters,
      options
    })
    return data.readJSONDB
  }
  // Additional methods...
}
