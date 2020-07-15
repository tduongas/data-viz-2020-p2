from config import db_username, db_password, db_name
import pandas as pd
from flask import jsonify
from io import StringIO
import csv
import json
import database_functions 


def csv2json(data):
    reader = csv.DictReader
    reader = csv.DictReader(data)
    out = json.dumps([ row for row in reader ])
    return out


def load_data_into_database():
    result = database_functions.load_files_into_database()

    if result == True:
        result = {'status': 'OK', 'payload': ''}
    else:
        result = {'status': 'OK', 'payload': ''}

    return jsonify(result)


def deaths():
    result = database_functions.select_query("SELECT * FROM deaths")
    return jsonify(result)


def get_all_cases():
    result = database_functions.select_query("SELECT * FROM all_cases")
    return jsonify(result)
    
    
def get_county_population():
    result = database_functions.select_query("SELECT * FROM county_population")
    return jsonify(result)


def get_school_deo_data():
    file = open('Data/GeoPlan_Public_and_Private_Schools_in_Florida_-_2017.geojson', 'r')
    
    if not file:
        return "No file"
	
    file_contents = StringIO(file.read())
    result = csv2json(file_contents)

    result = json.loads(result.strip())
    response = jsonify(result)

    return response