
# def get_columns_names(table):

#     conn = connect_to_database(False)

#     # declare an empty list for the column names
#     columns = []

#     # declare cursor objects from the connection    
#     col_cursor = conn.cursor()

#     # concatenate string for query to get column names
#     # SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'some_table';
#     col_names_str = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE "
#     col_names_str += "table_name = '{}' ORDER BY column_name DESC;".format( table )

#     # print the SQL string
#     # print ("\ncol_names_str:", col_names_str)

#     try:
#         sql_object = sql.SQL(
#             # pass SQL statement to sql.SQL() method
#             col_names_str
#         ).format(
#             # pass the identifier to the Identifier() method
#             sql.Identifier( table )
#         )

#         # execute the SQL string to get list with col names in a tuple
#         col_cursor.execute( sql_object )

#         # get the tuple element from the liast
#         # col_names = ( col_cursor.fetchall() )
#         col_names = ( col_cursor.fetchall() )

#         # convert tuple to a string
#         #columns = convertTuple(col_names)

#         # iterate list of tuples and grab first element
#         for tup in col_names:

#             # append the col name string to the list
#             # columns += [ tup[0] ]
#             columns.append(tup[0])

#         # close the cursor object to prevent memory leaks
#         col_cursor.close()

       
#     except Exception as err:
#         print ("get_columns_names ERROR:", err)

#     # return the list of column names
#     return columns    

# def convertTuple(tup): 
#     str = functools.reduce(operator.add, (tup)) 
#     return str

    # build_list = ""
    # new_list = []

    # column_length = len(column_names)

    # for row in cursor.fetchall():

    #     for column in column_names:
            
    #         column_value = row[column]
    #         print("------------------------")
    #         print(type(column_value))

    #         if column=="index":
    #             if column_value > 0:
    #                 build_list = build_list + "}"
                    
    #             if column_value != 0:
                   
    #                 if column_value == column_length - 1:
    #                     build_list = build_list + "}," # close curly braces of the last element

    #                 # print("==============================")
    #                 # print(build_list)    
                    
    #                 new_list.append(ast.literal_eval(build_list))
    #                 # new_list.append(build_list)

    #             if isinstance(column_value, int):
    #                 build_list = "{'" + column + "': " + str(column_value)
    #             else:
    #                 build_list = "{'" + column + "': '" + str(column_value) + "'"    
                
    #         else:
    #             if isinstance(column_value, int):
    #                 build_list = build_list + ", '" + column + "': " + str(column_value) 
    #             else:
    #                 build_list = build_list + ", '" + column + "': '" + str(row[column]) + "'" 
    # response = jsonify(new_list)
    # # print(dictionary)
    # json_object = json.dumps(new_list) 
    # # print(json_object)
    # # return new_list
    # # # print(json_object)
    # # result = json.loads(new_list)
    # response = jsonify(json_object)
    # # print(response)
    # # response.headers.add('Access-Control-Allow-Origin', '*')
    # # response.headers.add('Accept', 'application/json')
    # return response
    # result = json.dumps(new_list)
    # result = json.loads(new_list)
    # response = jsonify(new_list)
    # return response
    # result = json.loads(result.strip())
    # response = jsonify(json_object)
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # cur = conn.cursor(cursor_factory=RealDictCursor)
    # cur.execute("""SELECT * FROM all_cases """)    
    # # result = json.dumps(cur.fetchall(), indent=2, sort_keys=True)
    # # result = json.loads(result.strip())
    # response = jsonify(results)
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # return response   