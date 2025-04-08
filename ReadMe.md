# **Running the Docker File**

To run the Flask app and MongoDB server run command
```Bash
docker compose -f docker-compose.yaml up -d
```

---
## Backend 

Consists of a MongoDB server and a Flask app to serve the webpages

### MongoDB
- Pymongo is used to insert the data and retrieve it in the backend
- Consists of one collection full of stock data

### Flask
- Consists of the API's that are used by the front-end 
- And the server to serve the webpages to the user when accessing the webpage url



---
### Frontend
- Page Layout (html/css)
	- Red if the number went down
	- Green if the number went up
	- a tab to get all the stock tags
- Connect front-end & backend; Call API (JavaScript)
	- Need to call the API repetitively (Every 1 second maybe)


