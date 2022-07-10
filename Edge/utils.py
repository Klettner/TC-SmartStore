import json


def output_result(result_string: str, status_code: int):
    print(f'Status code: {status_code}')
    json_data = json.loads(result_string)

    if 'errors' in json_data:
        print(result_string)
    else:
        print(json_data['data'])