from flask import Flask
import requests 

# Gonna use Alpha advantage for API's


app = Flask(__name__)

@app.route("/")
def index():
    return 'Index Page'

"""
This function returns the price of a stock based off of the stock tag requested

Parameters:
    stockTag: the tag of the stock requested from the user

Returns:
    str: a string of the stock price requested
"""
def getStock(stockTag:str) -> str:


def getTags() -> list[str]:
