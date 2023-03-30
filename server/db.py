from dotenv import load_dotenv, find_dotenv
import os
from pymongo import MongoClient, errors
from bson.objectid import ObjectId

load_dotenv(find_dotenv())
password = os.environ.get("MONGODB_PWD")
connection_string = f'mongodb+srv://groupbuyoffice:{password}@cluster0.nfqqhiz.mongodb.net/?retryWrites=true&w=majority&authSource=admin'
groupBuy_db = None
try:
    client = MongoClient(connection_string)
    client.server_info()
    groupBuy_db = client.GroupBuy
except:
    print(' * DATABASE CONNECTION ERROR')
    exit()
else:
    print(' * DATABASE CONNECTED')
