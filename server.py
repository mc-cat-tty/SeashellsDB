from flask import request
from flask_api import FlaskAPI
from typing import Tuple, List
from database.interface import DBInterface, Table
import argparse

app = FlaskAPI(__name__)
app.config['HOST'] = '0.0.0.0'
app.config['DEBUG'] = True
app.config['ENV'] = 'development'

dbi: DBInterface = None

@app.route('/api/fetch', methods=['GET'])
def fetch():
    try:
        table_str: str = request.args.get("table").upper()
        table: Table = Table[table_str]  # Naive security control with mapping function
    except:
        return "table arg is invalid", 400

    try:
        result: List[Tuple] = None
        if table is Table.CLASS:
            result = dbi.list_classes()
        elif table is Table.FAMILY:
            result = dbi.list_families()
        elif table is Table.SPECIES:
            result = dbi.list_species()
        elif table is Table.SPECIMEN:
            result = dbi.list_specimens()

        return {
            'content': result,
            'columns': dbi.get_columns()
        }
    except:
        return "internal error", 500

@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    return response

# @app.route('/get_everything_from', methods=['GET'])
# def get_everything_from():
#     table: str = request.args.get("table").upper()
#     search_field: str = request.args.get("search_field")
#     search_field_equals_to: str = request.args.get("search_field_equals_to")
#
#     try:
#         if search_field is None:
#             return json.dumps(dbi.get_everything_from(Table[table], search_field_equals_to))
#         else:
#             return json.dumps(dbi.get_everything_from(Table[table], search_field_equals_to, search_field))
#     except QueryFailed:
#         return "Query failed", 400


if __name__ == '__main__':
    parser: argparse.ArgumentParser = argparse.ArgumentParser()
    parser.add_argument("-p", "--password", help="MariaDB (MySQL) password", type=str, dest="password")
    args = parser.parse_args()
    dbi = DBInterface("127.0.0.1", 3306, "writeUser", args.password, "conchiglie")
    app.run(host='0.0.0.0', port=5000, debug=True)
