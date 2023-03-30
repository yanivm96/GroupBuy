import db,os
from flask import Blueprint,request,current_app,jsonify #current_app = app in blueprint
from bson.objectid import ObjectId
from flask_jwt_extended import create_access_token

user = Blueprint("user", __name__)
groupbuy_db = db.groupBuy_db 



@user.route("/get", methods=['GET'])
def get_user():
    define_user()
    return "get"

@user.route("/by_id", methods=['POST'])
def get_user_by_id():
    data = request.get_json()
    user = groupbuy_db.User.find_one({"_id": ObjectId(data["id"])})
    
    if user is not None:
        return {"name": (user["fname"] +" " + user["lname"])} , 200

    return {"name": None}, 400


@user.route("/check_username_existence", methods=['POST'])
def check_username():
    data = request.get_json()
    user = groupbuy_db.User.find_one({"username": data["username"]})
    exist = False
    
    if user is not None:
        exist = True

    return {"exist": exist} , 200

@user.route("/check_email_existence", methods=['POST'])
def check_email():
    data = request.get_json()
    user = groupbuy_db.User.find_one({"email": data["email"]})
    exist = False
    if user is not None:
        exist = True
        
    return {"exist": exist} , 200


@user.route("/delete", methods=['DELETE'])
def delete_user():
    data = request.get_json()
    groupbuy_db.User.delete_one({"_id": ObjectId(data["user_id"])})
    return "delete"


@user.route("/create", methods=['POST'])
def create_user():
    print(request.get_json())
    user_created = groupbuy_db.User.insert_one(request.get_json())
    access_token = create_access_token(identity=str(user_created.inserted_id))
    return {"accessToken": access_token},200


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