import { gql } from 'graphql-request'

export const QUERIES = {
  GET_SYSTEM_INFO: gql`
    query GetSystemInfo {
      sysInfo {
        cpu {
          manufacturer
          brand
          speed
          cores
        }
        memory {
          total
          free
          used
          active
          available
        }
        os {
          platform
          distro
          release
          codename
          arch
        }
        storage {
          device
          type
          name
          vendor
          size
        }
      }
    }
  `,

  GET_NODE_INFO: gql`
    query GetNodeInfo {
      nodeInfo {
        peerId
        health
        version
        multiAddr
        publicKey
        discovered
        connected
        peers
        account
        connections
      }
    }
  `,

  READ_DB: gql`
    query ReadDB($dbaddr: String!, $filters: JSON, $options: FilterOptionsInput) {
      readDB(dbaddr: $dbaddr, filters: $filters, options: $options) {
        _id
        sig
        data
        publicKey
      }
    }
  `,

  READ_STREAM: gql`
    query ReadStream($dbaddr: String!, $streamName: String!, $from: String, $to: String) {
      readStream(dbaddr: $dbaddr, streamName: $streamName, from: $from, to: $to) {
        id
        message
      }
    }
  `,

  READ_TIME_SERIES: gql`
    query ReadTimeSeries(
      $dbaddr: String!
      $fromTimestamp: String
      $toTimestamp: String
      $options: TimeSeriesOptions
    ) {
      readTimeSeries(
        dbaddr: $dbaddr
        fromTimestamp: $fromTimestamp
        toTimestamp: $toTimestamp
        options: $options
      ) {
        timestamp
        value
      }
    }
  `
};