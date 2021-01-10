from flask import request
from flask_api import FlaskAPI
import json
from typing import Tuple, Dict
from database.interface import DBInterface, Table, QueryFailed
import argparse

app = FlaskAPI(__name__)
app.config['HOST'] = '0.0.0.0'

dbi: DBInterface = None

@app.route('/api/get_list', methods=['GET'])
def get_list():
    table: str = request.args.get("table")

    if table is None:
        return "Query failed", 400

    if table == "class":
        return json.dumps(dbi.list_classes())
    elif table == "family":
        return json.dumps(dbi.list_families())
    elif table == "species":
        return json.dumps(dbi.list_species())
    elif table == "specimen":
        return json.dumps(dbi.list_specimens())


@app.route('/api/get_everything_from', methods=['GET'])
def get_everything_from():
    table: str = request.args.get("table").upper()
    search_field: str = request.args.get("search_field")
    search_field_equals_to: str = request.args.get("search_field_equals_to")

    try:
        if search_field is None:
            return json.dumps(dbi.get_everything_from(Table[table], search_field_equals_to))
        else:
            return json.dumps(dbi.get_everything_from(Table[table], search_field_equals_to, search_field))
    except QueryFailed:
        return "Query failed", 400


if __name__ == '__main__':
    parser: argparse.ArgumentParser = argparse.ArgumentParser()
    parser.add_argument("-p", "--password", help="MariaDB (MySQL) password", type=str, dest="password")
    args = parser.parse_args()
    dbi: DBInterface = DBInterface("127.0.0.1", 3306, "writeUser", args.password, "conchiglie")
    app.run(host='0.0.0.0', port=5000, debug=True)
