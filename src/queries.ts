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
    query ReadJSONDB($dbaddr: String!, $filters: JSON, $options: FilterOptionsInput) {
      readJSONDB(dbaddr: $dbaddr, filters: $filters, options: $options) {
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
  `,

  GET_DISTANCE: gql`
    query GetDistance($dbaddr: String!, $locationLabel: String!, $member1: String!, $member2: String!, $unit: String!) {
      getDistance(
        dbaddr: $dbaddr
        locationLabel: $locationLabel
        member1: $member1
        member2: $member2
        unit: $unit
      )
    }
  `,

  GET_POSITION: gql`
    query GetPosition($dbaddr: String!, $locationLabel: String!, $member: String!) {
      getPosition(
        dbaddr: $dbaddr
        locationLabel: $locationLabel
        member: $member
      ) {
        longitude
        latitude
      }
    }
  `,

  GET_GEO_HASH: gql`
    query GetGeoHash($dbaddr: String!, $locationLabel: String!, $member: String!) {
      getGeoHash(
        dbaddr: $dbaddr
        locationLabel: $locationLabel
        member: $member
      )
    }
  `,

  GEO_SEARCH: gql`
    query GeoSearch(
      $dbaddr: String!
      $locationLabel: String!
      $longitude: Float!
      $latitude: Float!
      $radius: Float!
      $unit: String!
    ) {
      geoSearch(
        dbaddr: $dbaddr
        locationLabel: $locationLabel
        longitude: $longitude
        latitude: $latitude
        radius: $radius
        unit: $unit
      ) {
        member
      }
    }
  `,

  GEO_SEARCH_WITH: gql`
    query GeoSearchWith(
      $dbaddr: String!
      $locationLabel: String!
      $member: String!
      $radius: Float!
      $unit: String!
    ) {
      geoSearchWith(
        dbaddr: $dbaddr
        locationLabel: $locationLabel
        member: $member
        radius: $radius
        unit: $unit
      ) {
        member
      }
    }
  `,

  READ_SORTED_SET: gql`
    query ReadSortedSet($dbaddr: String!, $min: Timestamp, $max: Timestamp) {
      readSortedSet(dbaddr: $dbaddr, min: $min, max: $max) {
        timestamp
        message
      }
    }
  `
};