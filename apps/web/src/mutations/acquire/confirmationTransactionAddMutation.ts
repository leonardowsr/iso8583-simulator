import { graphql } from "react-relay";

export const confirmationTransactionAddMutation = graphql`
  mutation confirmationTransactionAddMutation($input: TransactionAddInput!) {
    TransactionAdd(input: $input) {
      transaction {
        id
        amount
        status
      }
    }
  }
`;
