import os
import json
import requests
from dotenv import load_dotenv

GET_PALLETS = """query Query {
  getAllPallets {
    serialNumber
    weight
  }
}"""

CREATE_PALLET = """mutation CreatePallet($pallet: PalletInput!) {
  createPallet(pallet: $pallet) {
    serialNumber,
    weight
  }
}"""

DELETE_PALLET = """mutation Mutation($serialNumber: String!) {
  deletePallet(serialNumber: $serialNumber) {
    serialNumber
  }
}"""

UPDATE_PALLET_WEIGHT = """mutation Mutation($serialNumber: String!, $weight: Int!) {
  updatePalletWeight(serialNumber: $serialNumber, weight: $weight) {
    serialNumber,
    weight
  }
}"""


load_dotenv()
token = os.environ.get("TOKEN")
url = os.environ.get("URL")
headers = {"Authorization": f'Bearer {token}'}


def graphql_request(query: str, variables: json):
    return requests.post(
        url,
        json={
            'query': query,
            'variables': variables
        },
        headers=headers,
    )
