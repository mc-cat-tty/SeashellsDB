import os
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

@app.route('/api/fetch/<table_str>', methods=['GET'])  # Get class. Optionally filter by id
def fetch(table_str):
    try:
        table_str: str = table_str.upper()
        table: Table = Table[table_str]  # Naive security control along with mapping function
    except:
        return "table arg is invalid", 400

    id = request.args.get('upper_id')
    if id is not None:
        try:
            id = int(id)
        except:
            return "id arg type error", 406

    try:
        result: List[Tuple] = None
        if table is Table.CLASS:
            result = dbi.list_classes()
        elif table is Table.FAMILY:
            result = dbi.list_families(id)
        elif table is Table.SPECIES:
            result = dbi.list_species(id)
        elif table is Table.SPECIMEN:
            result = dbi.list_specimens(id)

        return {
            'content': result,
            'columns': dbi.get_columns()
        }
    except:
        return "internal error", 500

# @app.route('/api/fetch/<table>/<id>', methods=['GET'])
# def fetch_id(table_str, id):
#     try:
#         table_str: str = table_str.upper()
#         table: Table = Table[table_str]  # Naive security control along with mapping function
#     except:
#         return "table arg is invalid", 400
#
#     try:
#         id_parsed: int = int(id)
#     except:
#         return "id arg type error", 406
#
#     try:
#         result: List[Tuple] = None
#         if table is Table.CLASS:
#             result = dbi.list_classes(id_parsed)
#         elif table is Table.FAMILY:
#             result = dbi.list_families(id_parsed)
#         elif table is Table.SPECIES:
#             result = dbi.list_species(id_parsed)
#         elif table is Table.SPECIMEN:
#             result = dbi.list_specimens(id_parsed)
#
#         return {
#             'content': result,
#             'columns': dbi.get_columns()
#         }
#     except:
#         return "internal error", 500

@app.route("/api/fetch/hierarchy", methods=["GET"])
def fetch_hierarchy():
    return {
        'content': dbi.list_hierarchy(),
        'columns': dbi.get_columns()
    }

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
    dbi = DBInterface("127.0.0.1", 3306, "writeUser", args.password or os.getenv("APP_MYSQL_PASSWORD"), "conchiglie")
    app.run(host='0.0.0.0', port=8080, debug=True)
