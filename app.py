from flask import Flask, request, render_template, jsonify
import random

# Randomly generated stocks for the random number generator
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

app = Flask(__name__)
# This just starts the server
if __name__ == '__main__':
    app.run(debug=True)


"""
This function returns the rendered index.html file when we access the homepage
"""
@app.route("/")
def index():
    return render_template('index.html')

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
    # Make sure the requested tag is uppercase
    tag = request.args.get("tag").upper()

    # Grab the details of that stock tag from the stocks dictionary
    stock = stocks[tag]

    # Return the randomized value of that stock in a JSON format
    return jsonify(generateStockPrice(stock))

#**************************************************************************************************

"""
This function returns every stock tag in a JSON format

Parameters:
    none

Returns:
    a list of all the stock tags the user can select from
"""
@app.route('/api/getStockTags', methods=['GET'])
def getTags():
    return jsonify(list(stocks.keys()))
    
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






