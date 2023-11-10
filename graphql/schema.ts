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

  type Mutation {
    createInjuryReport(data: CreateInjuryReportInput!): InjuryReport!
    updateInjuryReport(id: Int!, data: UpdateInjuryReportInput!): InjuryReport!
    deleteInjuryReport(id: Int!): InjuryReport!

    createInjuryDetail(data: CreateInjuryDetailInput!): InjuryDetail!
    deleteInjuryDetail(id: Int!): InjuryDetail!

    createUser(data: CreateUserInput!): User!
  }

  input CreateInjuryReportInput {
    userId: String!
    datetime: DateTime!
    name: String!
  }

  input UpdateInjuryReportInput {
    datetime: DateTime
    name: String
  }

  input CreateInjuryDetailInput {
    label: Int!
    reportId: Int!
    injuryDescription: String!
    x: Float!
    y: Float!
  }

  input CreateUserInput {
    id: String!
    name: String!
  }
`;
