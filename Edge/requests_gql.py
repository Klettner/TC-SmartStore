from graphql import *
from utils import output_result


def get_all_pallets():
    """
    Gets all pallets that were added to the station
    :return: prints the result of the request
    """
    result = requests.post(url, json={'query': GET_PALLETS}, headers=headers)
    output_result(result.text, result.status_code)


def create_pallet(serial_number: str, weight: int):
    """
    Adds a new pallet to the station
    :param serial_number: The identifier of the pallet
    :param weight: The currently measured weight on the pallet (in gramm)
    :return: prints the result of the request
    """
    variables = {"pallet": {"serialNumber": serial_number, "weight": weight}}
    result = graphql_request(query=CREATE_PALLET, variables=variables)
    output_result(result.text, result.status_code)


def delete_pallet(serial_number: str):
    """
    Deletes a pallet from a station
    :param serial_number: The identifier of the pallet
    :return: prints the result of the request
    """
    variables = {"serialNumber": serial_number}
    result = graphql_request(query=DELETE_PALLET, variables=variables)
    output_result(result.text, result.status_code)


def update_pallet_weight(serial_number: str, weight: int):
    """
    Updates the weight for the specified pallet
    :param serial_number: The identifier of the pallet
    :param weight: The currently measured weight on the pallet (in gramm)
    :return: prints the result of the request
    """
    variables = {"serialNumber": serial_number, "weight": weight}
    result = graphql_request(query=UPDATE_PALLET_WEIGHT, variables=variables)
    output_result(result.text, result.status_code)


# Available requests:
# update_pallet_weight("A1", 4000)
# delete_pallet("A2")
create_pallet("A2", 5000)
