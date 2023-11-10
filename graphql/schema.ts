import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  scalar DateTime

  type Query {
    injuryReports: [InjuryReport!]!
    injuryDetail: [InjuryDetail!]!
    user: [User!]!
  }

  type InjuryReport {
    id: Int!
    created_at: DateTime!
    updated_at: DateTime!
    userId: String!
    datetime: DateTime!
    name: String!
    injuries: [InjuryDetail!]!
    user: User!
  }

  type InjuryDetail {
    id: Int!
    label: Int!
    reportId: Int!
    injuryDescription: String!
    x: Float!
    y: Float!
    report: InjuryReport!
  }

  type User {
    id: String!
    name: String!
    reports: [InjuryReport!]!
  }
`;
