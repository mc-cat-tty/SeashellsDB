"""
In order to populate the database, first we have to convert data from a taxonomy-like (hierarchical) structure
"""

__author__ = "Francesco Mecatti"

import argparse
import logging
import re
import string
import mariadb
from enum import Enum
from typing import List, Sequence, Tuple

FILENAME: str = "Elenco.txt"
HOST, PORT = "127.0.0.1", 3306
USERNAME, PASSWORD = "writeUser", ""  # Please change these parameters to yours, or pass them through the command line
DATABASE: str = "conchiglie"


class DataType(Enum):
    BLANK_LINE = 0
    CLASS = 1
    FAMILY = 2
    SPECIES = 3
    SPECIMEN = 4


class Parser:
    def __init__(self, starting_family_code: str = "AA", line_structure: str = r"^\"(\w+?) ([\s\w\d,'\(\)\.&\-]+)\"[ \w]*$") -> None:
        self.line_structure: str = line_structure
        self.current_class: str = ""
        self.current_family: str = ""
        self.current_species: str = ""
        self.starting_family_code: str = starting_family_code
        self.current_family_code: str = starting_family_code
        self.gen = self.next_family_code()

    def next_family_code(self) -> str:
        """
        This method provides a generator for the unique family code. I starts from AA identifier
        :return: next family code
        """
        for first_char in string.ascii_uppercase[string.ascii_uppercase.find(self.starting_family_code[0]):]:
            for second_char in string.ascii_uppercase[string.ascii_uppercase.find(self.starting_family_code[1]):]:
                self.current_family_code = first_char + second_char
                yield first_char + second_char

    def parse_line(self, line: str) -> Tuple[DataType, List[str]]:
        """
        Regex based line parsers
        :param line: line to be parsed
        :return: parsed line; namely a list of all the different elements, according to the
        type of line (class, family, species or specimen)
        """
        logging.info(f"Parsing {line}")
        if not line or line == "\n":
            return DataType.BLANK_LINE, []
        parsed_line: Sequence[str] = re.match(self.line_structure, line).groups()
        if parsed_line[0] == "Classe":
            self.current_class = parsed_line[1]
            return DataType.CLASS, [self.current_class]
        elif parsed_line[0] == "Famiglia":
            self.current_family = parsed_line[1]
            self.current_family_code = next(self.gen)
            return DataType.FAMILY, [self.current_family, self.current_family_code]
        else:
            parsed_species: Sequence[str] = re.match(r"^([ a-z\.]+)[ \(]*([\w \.&'\-,]+), ?(\d+)[\) ]*",
                                                     parsed_line[1].strip()).groups()
            return DataType.SPECIES, [parsed_line[0] + " " + parsed_species[0],  # Name
                                      parsed_species[1],  # Discoverer
                                      parsed_species[2]]  # Year


class DBConnector:
    def __init__(self, host: str, port: int, username: str, password: str, database: str) -> None:
        try:
            self.last_inserted_class_id = None
            self.last_inserted_family_id = None
            self.last_inserted_species_id = None
            logging.debug(
                f"Connecting to the server\n\thost: {host}\t\tport: {port}\n"
                f"\tusername: {username}\tpassword: {password}\n\tdatabase: {database}")
            self.conn = mariadb.connect(
                user=username,
                password=password,
                host=host,
                port=port,
                database=database

            )
            self.conn.autocommit = True
        except mariadb.Error as e:
            logging.error(f"Error connecting to MariaDB Server")
            exit(1)
        else:
            self.cur = self.conn.cursor()

    def __del__(self) -> None:
        self.conn.close()

    def insert_class(self, class_name: str) -> None:
        """
        Method to insert a row into class table
        :param class_name: name of the class; unique
        """
        logging.debug(f'INSERT INTO genere (nome) VALUES ("{class_name}")')
        self.cur.execute('INSERT INTO genere (nome) VALUES (?)', [class_name])
        self.last_inserted_class_id = self.get_last_inserted_id()

    def insert_family(self, family_name: str, family_code: str, class_id: int = None) -> None:
        """
        Method to insert a row into family table
        :param family_name: name of the family; unique
        :param family_code: code of the family; unique
        :param class_id: id of parent class; foreign key; leave it blank if you are inserting a family that belongs to
        the last inserted class
        """
        if class_id is None:
            class_id = self.last_inserted_class_id
        logging.debug(
            f'INSERT INTO famiglia (nome, codice, genere_id) VALUES ("{family_name}", "{family_code}", "{class_id}")')
        self.cur.execute('INSERT INTO famiglia (nome, codice, genere_id) VALUES (?, ?, ?)',
                         [family_name, family_code, class_id])
        self.last_inserted_family_id = self.get_last_inserted_id()

    def insert_species(self, species_name: str, discoverer: str, year: int, family_id: int = None) -> None:
        """
        Method to insert a row into species table
        :param species_name: species name; unique
        :param discoverer: who discovered the species for the first time
        :param year: year in which the species has been discovered
        :param family_id: id of parent family; foreign key; leave it blank if you are inserting a species that belongs
        to the last inserted family
        :return:
        """
        if family_id is None:
            family_id = self.last_inserted_family_id
        self.cur.execute('INSERT INTO specie (nome, ritrovatore, anno_ritrovamento, famiglia_id) VALUES (?, ?, ?, ?)',
                         [species_name, discoverer, year, family_id])
        self.last_inserted_species_id = self.get_last_inserted_id()

    def add_class(self, class_name: str) -> None:
        try:
            self.insert_class(class_name)
        except mariadb.IntegrityError:  # If already in the database
            self.cur.execute('SELECT id FROM genere WHERE nome = ?', [class_name])
            self.last_inserted_class_id = int(self.cur.fetchone[0])

    def add_family(self, family_name: str, family_code: str, class_id: int = None) -> None:
        if self.last_inserted_class_id is None:
            self.cur.execute('SELECT genere_id FROM famiglia WHERE nome = ?', [family_name])
            self.last_inserted_class_id = int(self.cur.fetchone()[0])
        try:
            self.insert_family(family_name, family_code, class_id)
        except mariadb.IntegrityError:  # If already in the database
            self.cur.execute('SELECT id FROM famiglia WHERE nome = ?', [family_name])
            self.last_inserted_family_id = int(self.cur.fetchone()[0])

    def add_species(self, species_name: str, discoverer: str, year: int, family_id: int = None) -> None:
        try:
            self.insert_species(species_name, discoverer, year, family_id)
        except mariadb.IntegrityError:  # If already in the database
            self.cur.execute('SELECT id FROM specie WHERE nome = ?', [species_name])
            self.last_inserted_species_id = int(self.cur.fetchone()[0])

    def get_last_family_code(self) -> str:
        self.cur.execute('SELECT max(codice) FROM famiglia')
        return self.cur.fetchone()[0]

    def get_last_inserted_id(self) -> int:
        self.cur.execute('SELECT @@IDENTITY')
        last_id = self.cur.fetchone()[0]
        logging.debug(f"Retrieved last id: {last_id}")
        return last_id


def main(filename: str, host: str, port: int, username: str, password: str, database: str, add: bool) -> None:
    db_connector: DBConnector = DBConnector(host, port, username, password, database)
    line_parser: Parser = Parser(db_connector.get_last_family_code())
    with open(filename, "r") as file:
        lines: List[str] = file.readlines()
    for line in lines:
        try:
            data_type, data = line_parser.parse_line(line)
            if not add:  # Standard import
                if data_type is DataType.CLASS:
                    db_connector.insert_class(data[0])
                elif data_type is DataType.FAMILY:
                    db_connector.insert_family(data[0], data[1])
                elif data_type is DataType.SPECIES:
                    db_connector.insert_species(data[0], data[1], int(data[2]))
            else:  # Add records
                if add:
                    if data_type is DataType.CLASS:
                        db_connector.add_class(data[0])
                    elif data_type is DataType.FAMILY:
                        db_connector.add_family(data[0], data[1])
                    elif data_type is DataType.SPECIES:
                        db_connector.add_species(data[0], data[1], int(data[2]))
        except:
            logging.error(f"{line} NOT IMPORTED")
        else:
            if data_type is DataType.BLANK_LINE:
                logging.info(f"{data_type} discarded")
            else:
                logging.info(f"{data_type} {data} imported")


if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING, format="%(asctime)s - %(levelname)s: %(message)s")
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--filename", help="Filename path", default=FILENAME, type=str, dest="filename")
    parser.add_argument("-a", "--address", help="MariaDB (MySQL) server address", default=HOST, type=str, dest="host")
    parser.add_argument("-P", "--port", help="MariaDB (MySQL) server port number", default=PORT, type=int,
                        dest="port")  # Notice that this flag is uppercase
    parser.add_argument("-u", "--username", help="MariaDB (MySQL) username", default=USERNAME, type=str,
                        dest="username")
    parser.add_argument("-p", "--password", help="MariaDB (MySQL) password", default=PASSWORD, type=str,
                        dest="password")
    parser.add_argument("-d", "--database", help="MariaDB (MySQL) database to be used", default=DATABASE, type=str,
                        dest="database")
    parser.add_argument("--add", help="Add records to the database", default=False,
                        action="store_true", dest="add")  # Enable this flag to append data to existing
    # families. If the family doesn't exist, the script will create it automatically
    args = parser.parse_args()
    main(args.filename, args.host, args.port, args.username, args.password, args.database, args.add)
