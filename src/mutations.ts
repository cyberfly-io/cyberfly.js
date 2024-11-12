import { gql } from 'graphql-request'


export const MUTATIONS = {
  CREATE_DATABASE: gql`
    mutation CreateDatabase($input: CreateDatabaseInput!) {
      createDatabase(input: $input) {
        ... on DatabaseAddress {
          dbaddr
        }
        ... on ErrorResponse {
          info
        }
      }
    }
  `,

  UPDATE_DATA: gql`
    mutation UpdateData($input: UpdateDataInput!) {
      updateData(input: $input) {
        info
        dbaddr
      }
    }
  `
};