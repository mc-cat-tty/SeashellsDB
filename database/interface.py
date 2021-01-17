"""
DBMS - code interface
This package is intended to provide an interface between Python code and MariaDB DBMS - DataBase Management System -
A set of functions that translates into SQL commands will be exposed
"""

__author__ = "Francesco Mecatti"

import logging
import mariadb
from enum import Enum, auto
from typing import List, Optional, Tuple

LOGGING_FILENAME: str = "database_interface.log"

logging.basicConfig(level=logging.DEBUG, filemode="a", format="%(asctime)s - %(levelname)s: %(message)s",
                    filename=LOGGING_FILENAME)


class QueryFailed(ValueError):
    """
    Exception raised when a select condition did not match any record, so the query "failed"
    """

    def __str__(self):
        return "No results match your search criteria"


class Table(Enum):
    CLASS = auto(),
    FAMILY = auto(),
    SPECIES = auto(),
    SPECIMEN = auto()

    def __str__(self) -> str:
        self.lookup_dict = {self.CLASS: "genere", self.FAMILY: "famiglia", self.SPECIES: "specie", self.SPECIMEN: "esemplare"}
        return self.lookup_dict[self]


class DBInterface:
    def __init__(self, host: str, port: int, username: str, password: str, database: str) -> None:
        try:
            logging.debug(
                f"Connecting to the server\n\thost: {host}\t\tport: {port}\n"
                f"\tusername: {username}\tpassword: *******\n\tdatabase: {database}")
            self.conn = mariadb.connect(
                user=username,
                password=password,
                host=host,
                port=port,
                database=database

            )
            self.conn.autocommit = True
        except mariadb.Error:
            logging.error(f"Error connecting to MariaDB Server")
            exit(1)
        else:
            self.cur = self.conn.cursor()

    def __del__(self) -> None:
        self.conn.close()

    @staticmethod
    def to_binary_data(filename: str) -> bytes:
        with open(filename, "rb") as file:
            return file.read()

    def get_columns(self) -> List[str]:
        return [column[0] for column in self.cur.description]

    def list_classes(self) -> List[Tuple]:
        self.cur.execute("SELECT * FROM genere")
        return [c for c in self.cur]

    def list_families(self) -> List[Tuple]:
        self.cur.execute("SELECT * FROM famiglia")
        return [f for f in self.cur]

    def list_species(self) -> List[Tuple]:
        self.cur.execute("SELECT * FROM specie")
        return [s for s in self.cur]

    def list_specimens(self) -> List[Tuple]:
        self.cur.execute("SELECT id, data_ritrovamento, luogo_ritrovamento, stato_ritrovamento, condizioni_ritrovamento, specie_id FROM esemplare")
        return [s for s in self.cur]

    def insert_class(self, class_name: str) -> None:
        logging.debug(f'INSERT INTO genere (nome) VALUES ({class_name})')
        self.cur.execute('INSERT INTO genere (nome) VALUES (?)', [class_name])

    def insert_family(self, family_name: str, family_code: str, class_id: int) -> None:
        logging.debug(
            f'INSERT INTO famiglia (nome, codice, genere_id) VALUES ({family_name}, {family_code}, {class_id})')
        self.cur.execute('INSERT INTO famiglia (nome, codice, genere_id) VALUES (?, ?, ?)',
                         [family_name, family_code, class_id])

    def insert_species(self, species_name: str, discoverer: str, year: int, family_id: int = None) -> None:
        logging.debug(f'INSERT INTO specie (nome, ritrovatore, anno_ritrovamento, famiglia_id '
                      f'VALUES ({species_name}, {discoverer}, {year}, {family_id})')
        self.cur.execute('INSERT INTO specie (nome, ritrovatore, anno_ritrovamento, famiglia_id) VALUES (?, ?, ?, ?)',
                         [species_name, discoverer, year, family_id])

    def insert_specimen(self, date: mariadb.Date, place: str, state: str, species_id: int,
                        conditions: Optional[str] = None, notes: Optional[str] = None,
                        picture_name: Optional[str] = None) -> None:
        logging.debug(f'INSERT INTO esemplare (data_ritrovamento, luogo_ritrovamento, stato_ritrovamento, specie_id, '
                      f'condizioni_ritrovamento, note, foto) VALUES ({str(date)}, {place}, {state}, {species_id}, '
                      f'{conditions}, {notes}, {picture_name})')
        self.cur.execute('INSERT INTO esemplare (data_ritrovamento, luogo_ritrovamento, stato_ritrovamento, specie_id, '
                         'condizioni_ritrovamento, note, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
                         [str(date), place, state, species_id, conditions, notes,
                          picture_name if picture_name is None else self.to_binary_data(picture_name)])

    def get_class_id(self, class_name: str) -> int:
        logging.debug(f'SELECT id FROM genere WHERE nome = {class_name}')
        self.cur.execute('SELECT id FROM genere WHERE nome = ?', [class_name])
        try:
            result: int = self.cur.fetchone()[0]
        except TypeError:  # Empty results list
            e: QueryFailed = QueryFailed()
            logging.error(e)
            raise e
        else:
            return result

    def get_family_id(self, family_name: str) -> int:
        logging.debug(f'SELECT id FROM famiglia WHERE nome = {family_name}')
        self.cur.execute('SELECT id FROM famiglia WHERE nome = ?', [family_name])
        try:
            result: int = self.cur.fetchone()[0]
        except TypeError:  # Empty results list
            e: QueryFailed = QueryFailed()
            logging.error(e)
            raise e
        else:
            return result

    def get_species_id(self, species_name: str) -> int:
        logging.debug(f'SELECT id FROM specie WHERE nome = {species_name}')
        self.cur.execute('SELECT id FROM specie WHERE nome = ?', [species_name])
        try:
            result: int = self.cur.fetchone()[0]
        except TypeError:  # Empty results list
            e: QueryFailed = QueryFailed()
            logging.error(e)
            raise e
        else:
            return result

    def get_everything_from(self, table: Table, search_field_equals_to: str, search_field: str = "nome") -> Tuple:
        logging.debug(f'SELECT * FROM {str(table)} WHERE {search_field} = {search_field_equals_to}')
        self.cur.execute(f'SELECT * FROM {str(table)} WHERE {search_field} = ?', [search_field_equals_to])
        result: Tuple = self.cur.fetchone()
        if result is not None:
            return result
        else:
            e: QueryFailed = QueryFailed()
            logging.error(e)
            raise e

    def search_class(self, partial_class_name: str,
                     variable_begin: Optional[bool] = False, variable_end: Optional[bool] = True) -> List[Tuple]:
        logging.debug(f'SELECT * FROM genere WHERE nome LIKE '
                      f'{"%" if variable_begin else ""}{partial_class_name}{"%" if variable_end else ""}')
        self.cur.execute('SELECT * FROM genere WHERE nome LIKE ?',
                         [f'{"%" if variable_begin else ""}{partial_class_name}{"%" if variable_end else ""}'])
        results: List[Tuple] = [row for row in self.cur]
        if results:
            return results
        else:
            e: QueryFailed = QueryFailed()
            logging.error(e)
            raise e

    def search_family(self, partial_family_name: str,
                      variable_begin: Optional[bool] = False, variable_end: Optional[bool] = True) -> List[Tuple]:
        logging.debug(f'SELECT * FROM famiglia WHERE nome LIKE '
                      f'{"%" if variable_begin else ""}{partial_family_name}{"%" if variable_end else ""}')
        self.cur.execute('SELECT * FROM famiglia WHERE nome LIKE ?',
                         [f'{"%" if variable_begin else ""}{partial_family_name}{"%" if variable_end else ""}'])
        results: List[Tuple] = [row for row in self.cur]
        if results:
            return results
        else:
            e: QueryFailed = QueryFailed()
            logging.error(e)
            raise e

    def search_species(self, partial_species_name: str,
                       variable_begin: Optional[bool] = False, variable_end: Optional[bool] = True) -> List[Tuple]:
        logging.debug(f'SELECT * FROM specie WHERE nome LIKE '
                      f'{"%" if variable_begin else ""}{partial_species_name}{"%" if variable_end else ""}')
        self.cur.execute('SELECT * FROM specie WHERE nome LIKE ?',
                         [f'{"%" if variable_begin else ""}{partial_species_name}{"%" if variable_end else ""}'])
        results: List[Tuple] = [row for row in self.cur]
        if results:
            return results
        else:
            e: QueryFailed = QueryFailed()
            logging.error(e)
            raise e

