from flask import Flask, render_template, redirect, jsonify
from flask_cors import CORS
import general_functions


# Create an instance of Flask
app = Flask(__name__)
CORS(app)


@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/deaths<br/>"
        f"/api/v1.0/allCases<br/>"
        f"/api/v1.0/countyPopulation<br/>"
        f"/api/v1.0/schoolGeoData<br/>"
        f"/api/v1.0/etlDatasets"
    )

# Route
@app.route("/")
def main():
    
    # Redirect back to home page
    return redirect("/")

# Route
@app.route("/api/v1.0/deaths")
def deaths():
    return general_functions.deaths()

# Route
@app.route("/api/v1.0/allCases")
def all_cases():
    return general_functions.get_all_cases()    

# Route
@app.route("/api/v1.0/countyPopulation")
def county_population():
    return general_functions.get_county_population()  

# Route
@app.route("/api/v1.0/schoolGeoData")
def school_geo_data():
    return general_functions.get_school_deo_data()  

# Route
@app.route("/api/v1.0/etlDatasets")
def load_data_into_database():
    return general_functions.load_data_into_database()      

if __name__ == "__main__":
    app.run(debug=True)