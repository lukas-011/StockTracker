from flask import Flask, request, render_template, jsonify

# Gonna use Alpha advantage for API's


app = Flask(__name__)


"""
This function returns the rendered index.html file
"""
@app.route("/")
def index():
    return render_template('index.html')


"""
This function returns the price of a stock based off of the stock tag requested

Parameters:
    stockTag: the tag of the stock requested from the user

Returns:
    str: a string of the stock price requested
"""
@app.route('/api/getStockPrice', methods=['GET'])
def getStockPrice():
    data = request.get_json()
    tag = request.get('tag')
    return "stock: stock prices"
    


def getTags():
    return