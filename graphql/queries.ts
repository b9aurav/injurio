import { gql } from "apollo-server-micro";

export const GET_USER_REPORTS = gql`
  query GetUserReports($userId: String!) {
    user(id: $userId) {
      reports {
        id
        name
        datetime
        created_at
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($userId: String!) {
    user(id: $userId) {
      id
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      name
    }
  }
`;

export const CREATE_REPORT = gql`
  mutation createInjuryReport($data: CreateInjuryReportInput!) {
    createInjuryReport(data: $data) {
      id
      userId
      datetime
      name
    }
  }
`;

export const CREATE_INJURY = gql`
  mutation createInjuryDetail($data: CreateInjuryDetailInput!) {
    createInjuryDetail(data: $data) {
      reportId
      x
      y
      label
      injuryDescription
    }
  }
`;

export const EDIT_REPORT = gql`
  mutation updateInjuryReport($id: Int!, $data: UpdateInjuryReportInput!) {
    updateInjuryReport(id: $id, data: $data) {
      datetime
      name
    }
  }
`;

export const DELETE_REPORT = gql`
  mutation deleteInjuryReport($id: Int!) {
    deleteInjuryReport(id: $id)
  }
`;

export const DELETE_INJURY = gql`
  mutation deleteInjuryDetail($reportId: Int!) {
    deleteInjuryDetail(reportId: $reportId)
  }
`;

export const GET_INJURY_DETAILS = gql`
  query InjuryDetail($reportId: Int!) {
    injuryDetail(reportId: $reportId) {
      id
      injuryDescription
      label
      x
      y
    }
  }
`;
