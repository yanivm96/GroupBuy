from flask import Flask, request,Blueprint
from user import user
from seller import seller
from item import item
from group import group

from dotenv import load_dotenv, find_dotenv
import os
from pymongo import MongoClient

app = Flask(__name__)
app.register_blueprint(user,url_prefix="/user")
app.register_blueprint(seller,url_prefix="/seller")
app.register_blueprint(item,url_prefix="/item")
app.register_blueprint(group,url_prefix="/group")

@app.errorhandler(Exception)
def handle_exception(e):
    # Handle the exception here
    return "An error occurred: {}".format(str(e)), 500

@app.route("/")
def fuck():
    return "hey"


if __name__ == '__main__':


    app.run(debug=True, port=5000)





