# Setup Python and Flask 
Make sure you're in the project directory when you're in the terminal

pull the directory using the command:
git pull origin master

### Set up the virtual environment using
python -m venv venv

venv\Scripts\activate

pip install flask

---
### Backend
- GetStock
	- It receives a stock tag (Ex. CMG, INT, NVD)
	- Checks if the stock tag is valid (We can just use a list for this)
	- Each stock has a min and max value for their tag (Ex. INT's price would be between 15.00 and 22.00). This makes it a list of dictionaries.
	- Then sends a random number back that is 2 decimal places long (for price)

Example of the list of dictionaries

stock_data = [
    {"tag": "AAPL", "min_price": 155.30, "max_price": 165.50},
    {"tag": "GOOGL", "min_price": 2700.00, "max_price": 2800.00},
    {"tag": "AMZN", "min_price": 3100.75, "max_price": 3250.90},
    {"tag": "MSFT", "min_price": 295.60, "max_price": 310.25},
    {"tag": "TSLA", "min_price": 680.00, "max_price": 730.00},
]

- GetTags
	- Returns a list of all the tags in the dictionary
We are going to use the Flask framework with Python to do this


---
### Frontend
- Need to call the API repetitively (Every 1 second maybe)
- Red if the number went down
- Green if the number went up
- And then a tab to get all the stock tags
