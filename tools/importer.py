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
HOST, PORT = "localhost", 3306
USERNAME, PASSWORD = "writeUser", ""  # Please change these parameters to yours, or pass them through the command line
DATABASE: str = "conchiglie"


class DataType(Enum):
    BLANK_LINE = 0
    CLASS = 1
    FAMILY = 2
    SPECIES = 3
    EXAMPLE = 4


class Parser:
    def __init__(self, line_structure: str = r"^\"(\w+?) ([\s\w\d,'\(\)\.&\-]+)\"[ \w]*$") -> None:
        self.line_structure: str = line_structure
        self.current_class: str = ""
        self.current_family: str = ""
        self.current_species: str = ""
        self.current_family_code = "AA"
        self.gen = self.next_family_code()

    def next_family_code(self) -> str:
        """
        This method provides a generator for the unique family code. I starts from AA identifier
        :return: next family code
        """
        for first_char in string.ascii_uppercase:
            for second_char in string.ascii_uppercase:
                self.current_family_code = first_char+second_char
                yield first_char + second_char

    def parse_line(self, line: str) -> Tuple[DataType, List[str]]:
        """
        Regex based line parsers
        :param line: line to be parsed
        :return: parsed line; namely a list of all the different elements, according to the type of line (class, family, species or example)
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
            parsed_example: Sequence[str] = re.match(r"^([ a-z\.]+)[ \(]*([\w \.&'\-,]+), ?(\d+)[\) ]*", parsed_line[1].strip()).groups()
            return DataType.SPECIES, [parsed_line[0]+parsed_example[0],  # Name
                                      parsed_example[1],  # Discoverer
                                      parsed_example[2]]  # Year


class DBConnector:
    def __init__(self, host: str, port: int, username: str, password: str, database: str):
        try:
            self.conn = mariadb.connect(
                user=username,
                password=password,
                host=host,
                port=port,
                database=database

            )
        except mariadb.Error as e:
            logging.error(f"Error connecting to MariaDB Server")
        else:
            self.cur: mariadb = self.conn.cursor()

    def insert_class(self, class_name: str):
        self.cur.execute("INSERT INTO genere (nome) VALUES (?)", (class_name))

    def insert_family(self, family_name: str, family_code: str):
        self.cur.execute("INSERT INTO famiglia (nome, codice) VALUES (?, ?)", (family_name, family_code))

    def insert_species(self, species_name: str, discoverer: str, year: int):
        self.cur.execute("INSERT INTO specie (nome, ritrovatore, anno_ritrovamento) VALUES (?, ?, ?)", (species_name, discoverer, year))


def main(filename: str, host: str, port: int, username: str, password: str, database: str) -> None:
    db_connector = DBConnector(host, port, username, password, database)
    parser: Parser = Parser()
    with open(filename, "r") as file:
        lines: List[str] = file.readlines()
    for line in lines:
        try:
            data_type, data = parser.parse_line(line)
        except:
            logging.error(f"{line} NOT IMPORTED")
        else:
            if data_type == DataType.BLANK_LINE:
                logging.info(f"{data_type} discarded")
            else:
                logging.info(f"{data_type} {data} imported")




if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING, format="%(asctime)s - %(levelname)s: %(message)s")
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--filename", help="Filename path", default=FILENAME, type=str, dest="filename")
    parser.add_argument("-a", "--address", help="MariaDB (MySQL) server address", default=HOST, type=str, dest="host")
    parser.add_argument("-P", "--port", help="MariaDB (MySQL) server port number", default=PORT, type=int, dest="port")  # Notice that this flag is uppercase
    parser.add_argument("-u", "--username", help="MariaDB (MySQL) username", default=USERNAME, type=str, dest="username")
    parser.add_argument("-p", "--password", help="MariaDB (MySQL) password", default=PASSWORD, type=str, dest="password")
    parser.add_argument("-d", "--database", help="MariaDB (MySQL) database to be used", default=DATABASE, type=str, dest="database")
    args = parser.parse_args()
    main(args.filename, args.host, args.port, args.username, args.password, args.database)
