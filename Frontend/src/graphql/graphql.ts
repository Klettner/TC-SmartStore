import { GraphQLClient } from 'graphql-request'
import gql from "graphql-tag"

const url = 'http://localhost:8080/graphql'

export const graphqlClientAuth = (token: string) => {
	return new GraphQLClient(url, {
		headers: {
			authorization: `Bearer ${token}`,
		}
	})
}

export const graphqlClient = new GraphQLClient(url)

export const GET_PALLETS = gql`
  query GetAllPallets {
    getAllPallets {
        serialNumber
        weight
        product {
          title
          weight
        }
    }
}
`

export const UPDATE_PRODUCT = gql`
  mutation Mutation($serialNumber: String!, $product: ProductInput!) {
  updateProductOfPallet(serialNumber: $serialNumber, product: $product) {
    serialNumber
  }
}
`

export const LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    authToken {
      token
      user
    }
    isAuthenticated
  }
}
`
