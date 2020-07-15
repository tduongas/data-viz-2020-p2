import pandas as pd
import json
from sqlalchemy import create_engine
from config import db_username, db_password, db_name, db_port
from psycopg2 import connect, extensions, sql
from psycopg2 import sql, connect
import psycopg2
from psycopg2.extras import RealDictCursor


csv_files = {'deaths':'Deaths_FL.csv', 
'all_cases': 'AllCases_FL.csv',
'cases_by_county': 'Florida_COVID19_Cases_by_County.csv',
'county_population': 'CountyPopulation.csv'}


def connect_to_database(enable_real_dict_cursor=False):
    if enable_real_dict_cursor:
        conn = psycopg2.connect(dbname = f"{db_name}", user = f"{db_username}", host = "localhost", password = f"{db_password}", cursor_factory=RealDictCursor)
    else:
        conn = psycopg2.connect(dbname = f"{db_name}", user = f"{db_username}", host = "localhost", password = f"{db_password}")    
    return conn


def select_query(query):
    
    # connect to the database
    conn = connect_to_database(True)
    
    # instantiate a cursor object from the connection
    cursor = conn.cursor()

    # setup the query
    query_sql = f"""{query}"""   
    
    # execure the query
    cursor.execute(query_sql)
      
    # fetchall rows 
    dictionary = cursor.fetchall()

    # close the cursor to avoid memory leaks
    cursor.close()

    # close the connection to avoid memory leaks
    conn.close()  

    return dictionary


def load_files_into_database():
    
    # create database project_2_db if it does not exists
    create_database(db_name)

    # initialize database engine to do the importing
    connection_string = f"{db_username}:{db_password}@localhost:{db_port}/{db_name}"
    engine = create_engine(f'postgresql://{connection_string}')
    
    for table_name, filename in csv_files.items():
        read_csv_to_database(filename, table_name, engine, 'replace', True)

    return True


def create_database(database_name):

    # connect to database server
    conn = connect(dbname = "", user = f"{db_username}", host = "localhost", password = f"{db_password}")

    # object type: psycopg2.extensions.connection
    print ("\ntype(conn):", type(conn))

    # get the isolation leve for autocommit
    autocommit = extensions.ISOLATION_LEVEL_AUTOCOMMIT
    # print ("ISOLATION_LEVEL_AUTOCOMMIT:", extensions.ISOLATION_LEVEL_AUTOCOMMIT)

    # set the isolation level for the connection's cursors
    # will raise ActiveSqlTransaction exception otherwise
    conn.set_isolation_level( autocommit )

    # instantiate a cursor object from the connection
    cursor = conn.cursor()

    try:
        # use the sql module to avoid SQL injection attacks
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier( database_name )))
    except:
        print(f"Database {database_name} Already exists")


    # close the cursor to avoid memory leaks
    cursor.close()

    # close the connection to avoid memory leaks
    conn.close()


def read_csv_to_database( filename, table_name, engine, if_exists='replace', index=True ):
    in_file = f"Data/{filename}"
    df = pd.read_csv(in_file)
    df.to_sql(name=f"{table_name}", con=engine, if_exists=f"{if_exists}", index=index)

    return True