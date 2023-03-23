from flask import Flask, request,Blueprint
from user import user
from seller import seller
from item import item
from group import group
from flask_cors import CORS

from dotenv import load_dotenv, find_dotenv
import os
from pymongo import MongoClient

app = Flask(__name__)
cors = CORS(app,supports_credentials=True)

app.register_blueprint(user,url_prefix="/user")
app.register_blueprint(seller,url_prefix="/seller")
app.register_blueprint(item,url_prefix="/item")
app.register_blueprint(group,url_prefix="/group")

@app.errorhandler(Exception)
def handle_exception(e):
    # Handle the exception here
    return "An error occurred: {}".format(str(e)), 500

@app.route("/", methods=["POST"])
def fuck():
    print(":sfacvavc")
    print(request.get_json())
    return "CSACASCA" ,200


if __name__ == '__main__':
    app.run(debug=True, port=5000)





