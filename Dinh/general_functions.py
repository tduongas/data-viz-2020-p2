import time
import re
import pandas as pd
import csv
import json
from io import StringIO
from flask import Flask, render_template, redirect, jsonify, request, make_response


def test():
    all_passengers = []
    
    passenger_dict = {}
    passenger_dict["name"] = "Dinh Duong"
    passenger_dict["age"] = "40"
    passenger_dict["sex"] = "M"
    
    all_passengers.append(passenger_dict)

    passenger_dict["name"] = "Chrissy Duong"
    passenger_dict["age"] = "39"
    passenger_dict["sex"] = "F"

    all_passengers.append(passenger_dict)

    return jsonify(all_passengers)

def deaths():
    f = open('Deaths_FL.csv', 'r')
    
    if not f:
        return "No file"
	
    file_contents = StringIO(f.read())
    result = csv2json(file_contents)

    result = json.loads(result.strip())
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    return response

def csv2json(data):
    reader = csv.DictReader
    reader = csv.DictReader(data)
    out = json.dumps([ row for row in reader ])
    print ("JSON parsed!") 
    return out