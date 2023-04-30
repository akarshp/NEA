from fastapi import FastAPI
import os.path
import sqlite3
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "Restaurants.db")

# Main API for fetching restaurant by either Region or Cuisine
@app.get("/get-search-result")
def get_search_(search, searchText: str = ""):
  conn = sqlite3.connect(db_path)     # connect to local Database
  cursor = conn.cursor()
  if(searchText == ""):
    cursor.execute("SELECT * FROM 'restaurant' ORDER BY " + search + " ASC") # Select and order alphabatically
    record = cursor.fetchall()
    cursor.close()
    return record
  else:
    query = "SELECT * FROM 'restaurant' WHERE " + search + "='" + searchText+"' ORDER BY rating DESC"  # Fetch results based on search condition
    cursor.execute(query)
    record = cursor.fetchall()
    cursor.close()
    return record

# Fetches unique results on the Left hand side choice options to filter restaurants by Region/Cuisine
@app.get("/get-filter")
def get_filter_(search, searchText):
  conn = sqlite3.connect(db_path)
  cursor = conn.cursor()
  searchColumn = "Cuisine" if search == "Region" else "Region"
  cursor.execute("SELECT DISTINCT "+ searchColumn +" FROM 'restaurant' WHERE " + search +" = '" + searchText + "' ORDER BY rating DESC ")
  record = cursor.fetchall()
  cursor.close()
  return record

# API to fetch the restaurants by further filtering as per Region/Cuisine
@app.get("/get-filter-result")
def get_filter_result_(search, searchText, filterList):
  conn = sqlite3.connect(db_path)
  cursor = conn.cursor()
  searchColumn = "Cuisine" if search == "Region" else "Region"
  query = "SELECT * FROM 'restaurant' WHERE " + search + "='" + searchText+"'"
  query += " And " +searchColumn+ " = '" + filterList + "'"    # apply further filter on the results
  cursor.execute(query)
  record = cursor.fetchall()
  cursor.close()
  return record
 
#The API used for retrieving the top rated restaurants from the database and sorting them in descending order#
@app.get("/get-toprestro-result")
def get_toprestro_result():
  conn = sqlite3.connect(db_path)
  cursor = conn.cursor()
  query = "SELECT * FROM 'restaurant' ORDER BY Rating DESC LIMIT 4" # Pick top 4 high rated restaurants
  cursor.execute(query)
  record = cursor.fetchall()
  cursor.close()
  return record

#The API used for checking the username and password, returning success if match found else failure.
@app.get("/get-login-result")
def get_toprestro_result(userName, password):
  conn = sqlite3.connect(db_path)
  cursor = conn.cursor()
  query = "SELECT * FROM User WHERE UserName = '"+ userName+"' AND Password = '"+ password + "'"
  cursor.execute(query)
  record = cursor.fetchall()
  if len(record)==0:
    cursor.close()
    return False
  else:
    cursor.close()
    return True
