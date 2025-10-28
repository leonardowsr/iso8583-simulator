import { graphql } from "react-relay";

export const confirmationOrderAddMutation = graphql`
  mutation confirmationOrderAddMutation($input: OrderAddInput!) {
    orderAdd(input: $input) {
      order {
        id
        userId
        
      }
    }
  }
`;
