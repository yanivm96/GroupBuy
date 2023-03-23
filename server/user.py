from flask import Blueprint,request
from bson.objectid import ObjectId
import db


user = Blueprint("user", __name__)
groupbuy_db = db.groupBuy_db 

@user.route("/get", methods=['GET'])
def get_user():
    define_user()
    return "get"


@user.route("/delete", methods=['DELETE'])
def delete_user():
    data = request.get_json()
    groupbuy_db.User.delete_one({"_id": ObjectId(data["user_id"])})
    return "delete"


@user.route("/create", methods=['POST'])
def create_user():
    print(request.get_json())
    groupbuy_db.User.insert_one(request.get_json())
    return "created" ,200


@user.route("/update", methods=['PUT'])
def update_user():
    data = request.get_json()
    toUpdate ={"$set": {data["attribute"] : data["value"]}}
    groupbuy_db.User.update_one({"_id": ObjectId(data["user_id"])}, toUpdate)
    return "updated"




def define_user():
    user_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "User",
            "required": ["fname", "lname", "username", "password","email" ],
            "properties": {
                "fname": {
                "bsonType": "string",
                "description": "'fname' must be a string and is required"
                },
                "lname": {
                "bsonType": "string",
                "description": "'lname' must be a string and is required"
                },
                "username": {
                "bsonType": "string",
                "description": "'username' must be a string and is required"
                },
                "password": {
                "bsonType": "string",
                "description": "'password' must be a string and is required"
                },
                "email": {
                "bsonType": "string",
                "description": "'email' must be a string and is required"
                },
            }
        }
    }

    try:
        groupbuy_db.create_collection("User")

    except Exception as e:
        print(e)

    groupbuy_db.command("collMod", "User", validator = user_validator)