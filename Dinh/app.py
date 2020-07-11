from flask import Flask, render_template, redirect, jsonify
import general_functions

# Create an instance of Flask
app = Flask(__name__)

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/deaths<br/>"
        f"/api/v1.0/test"
    )

# Route
@app.route("/")
def main():
    
    # Redirect back to home page
    return redirect("/")

# Route
@app.route("/api/v1.0/test")
def test():
    return general_functions.test()

# Route
@app.route("/api/v1.0/deaths")
def deaths():
    return general_functions.deaths()


if __name__ == "__main__":
    app.run(debug=True)
