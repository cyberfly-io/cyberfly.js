import { GraphQLClient } from 'graphql-request'
import { io } from "socket.io-client";
import { SigningManager } from './signing.js';
import { QUERIES } from './queries.js';
import { MUTATIONS } from './mutations.js';
import { getStreamName } from './utils.js';

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

  sendMessage(receiver:string, msg:object) {
    if (!this.signing.secretKey) {
      throw new Error('Secret key not set. Please call setSecretKey() first.');
    }
    const senderKey = this.signing.publicKey;
    const streamName = getStreamName(senderKey, receiver);
    const data = {...msg, streamName};
    const signature = this.signing.signData(data);
    const message = {data, sig:signature, publicKey: this.signing.publicKey};
    return this.socket.emit("send message", {receiver:receiver,stream:streamName,message:JSON.stringify(message)});
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

  async getDBInfo(dbaddr: string) {
  const data = await this.client.request(QUERIES.DB_INFO, { dbaddr });
  return data.dbInfo;
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

  async getDistance(dbaddr: string, locationLabel: string, member1: string, member2: string, unit: string) {
    const data = await this.client.request(QUERIES.GET_DISTANCE, {
      dbaddr,
      locationLabel,
      member1,
      member2,
      unit
    });
    return data.getDistance;
  }

  async getPosition(dbaddr: string, locationLabel: string, member: string) {
    const data = await this.client.request(QUERIES.GET_POSITION, {
      dbaddr,
      locationLabel,
      member
    });
    return data.getPosition;
  }

  async getGeoHash(dbaddr: string, locationLabel: string, member: string) {
    const data = await this.client.request(QUERIES.GET_GEO_HASH, {
      dbaddr,
      locationLabel,
      member
    });
    return data.getGeoHash;
  }

  async geoSearch(dbaddr: string, locationLabel: string, longitude: number, latitude: number, radius: number, unit: string) {
    const data = await this.client.request(QUERIES.GEO_SEARCH, {
      dbaddr,
      locationLabel,
      longitude,
      latitude,
      radius,
      unit
    });
    return data.geoSearch;
  }

  async geoSearchWith(dbaddr: string, locationLabel: string, member: string, radius: number, unit: string) {
    const data = await this.client.request(QUERIES.GEO_SEARCH_WITH, {
      dbaddr,
      locationLabel,
      member,
      radius,
      unit
    });
    return data.geoSearchWith;
  }

  async readStream(dbaddr: string, streamName: string, from?: string, to?: string) {
    const data = await this.client.request(QUERIES.READ_STREAM, {
      dbaddr,
      streamName,
      from,
      to
    });
    return data.readStream;
  }

  async readTimeSeries(
    dbaddr: string, 
    fromTimestamp?: string,
    toTimestamp?: string,
    options?: any
  ) {
    const data = await this.client.request(QUERIES.READ_TIME_SERIES, {
      dbaddr,
      fromTimestamp,
      toTimestamp,
      options
    });
    return data.readTimeSeries;
  }

  async readSortedSet(
    dbaddr: string, 
    min?: string | number,
    max?: string | number
  ) {
    const data = await this.client.request(QUERIES.READ_SORTED_SET, {
      dbaddr,
      min,
      max
    });
    return data.readSortedSet;
  }

  async getChatHistory(streamName: string, from?: string, to?: string) {
    const data = await this.client.request(QUERIES.READ_CHAT_HISTORY, {
      streamName,
      from,
      to
    });
    return data.readChatHistory;
  }

  async getIPLocation(ip: string) {
    const data = await this.client.request(QUERIES.GET_IP_LOCATION, { ip });
    return data.getIPLocation;
  }
}
