from dotenv import load_dotenv, find_dotenv
import os
from pymongo import MongoClient, errors

load_dotenv(find_dotenv())
password = os.environ.get("MONGODB_PWD")
connection_string = f'mongodb+srv://GroupBuy:{password}@cluster0.emycwsy.mongodb.net/?retryWrites=true&w=majority&authSource=admin'
client = MongoClient(connection_string)
groupBuy_db = client.GroupBuy