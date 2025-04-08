import os
from flask import Flask, request, render_template, jsonify
from pymongo import MongoClient
import random

# This just starts the server in debug mode
app = Flask(__name__)
if __name__ == '__main__':
    app.run(debug=True)

# Gives us access to the mongodb stock_data collection 
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/stock_db")
client = MongoClient(mongo_uri)
db = client["stock_db"]
collection = db["stock_data"]

# Randomly generated stocks for our database
stocks = {
    'AAPL': {'low': 150, 'high': 180},
    'MSFT': {'low': 270, 'high': 300},
    'GOOG': {'low': 2800, 'high': 3200},
    'AMZN': {'low': 3400, 'high': 3700},
    'TSLA': {'low': 600, 'high': 800},
    'META': {'low': 330, 'high': 370},
    'NVDA': {'low': 500, 'high': 600},
    'NFLX': {'low': 500, 'high': 550},
    'BRK.B': {'low': 420000, 'high': 440000},
    'JNJ': {'low': 165, 'high': 185},
    'WMT': {'low': 140, 'high': 160},
    'V': {'low': 210, 'high': 250},
    'PG': {'low': 130, 'high': 150},
    'KO': {'low': 50, 'high': 60},
    'PEP': {'low': 160, 'high': 180},
    'INTC': {'low': 50, 'high': 60},
    'MCD': {'low': 230, 'high': 250},
    'XOM': {'low': 50, 'high': 60},
    'ADBE': {'low': 450, 'high': 500},
    'T': {'low': 20, 'high': 30}
}

# Convert to list of documents and insert into the db so we don't have to do it through an external file
documents = [{"symbol": key, "low": value["low"], "high": value["high"]} for key, value in stocks.items()]

# If there is no data in our database put the data in there
if collection.count_documents({}) == 0:
    collection.insert_many(documents)

"""
This function returns the rendered index.html file when we access the homepage
"""
@app.route("/")
def index():
    return render_template('index.html')

#**************************************************************************************************
"""
This function returns the rendered tag-search.html file when we access the tag search page
"""
@app.route("/tag-search.html")
def tag_search():
    return render_template('tag-search.html')

#**************************************************************************************************

"""
This function returns the price of a stock based off of the stock tag requested

Parameters:
    stockTag: the tag of the stock requested from the user

Returns:
    the stock price requested in a JSON format
"""
@app.route('/api/getStockPrice', methods=['GET'])
def getStockPrice():
    # Make sure the requested tag is uppercase or a blank string if tag doesn't exist
    tag = request.args.get("tag", "").upper()

    # Grab the details of that stock tag from the MongoDB database
    stock = collection.find_one({"symbol": tag})
    
    # If there is no stock then return a 404 page not found error
    if not stock:
        return jsonify({"error": f"Stock symbol '{tag}' not found"}), 404

    # calculate the price based off of the stock
    price = generateStockPrice(stock)

    # return that price
    return jsonify({"price": price})

#**************************************************************************************************

"""
This function returns every stock tag in a JSON format

Parameters:
    none

Returns:
    a list of all the stock tags the user can select from
"""
@app.route('/api/getStockTags', methods=['GET'])
def getStockTags():
    stock_tags_cursor = collection.find({}, {"_id": 0, "symbol": 1})
    list_of_tags = [doc["symbol"] for doc in stock_tags_cursor]
    return jsonify(list_of_tags)
    
#**************************************************************************************************

"""
This function returns a randomly generated stock price that uses the low and high values to 
create a uniformly distributed chance of the random stock price

Parameters:
    high: the highest value a stock can be
    low: the lowest value a stock can be

Returns:
    float: a float value of the stock price
"""
def generateStockPrice(stock):
    print(stock)
    return round(random.uniform(stock["low"], stock["high"]), 2)
