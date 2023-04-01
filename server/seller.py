from flask import Blueprint,request
from bson.objectid import ObjectId
import db

seller = Blueprint("seller", __name__)
groupbuy_db = db.groupBuy_db 


@seller.route("/get", methods=['GET'])
def get_seller():
    define_seller()
    return "get"


@seller.route("/delete", methods=['DELETE'])
def delete_seller():
    data = request.get_json()
    groupbuy_db.Seller.delete_one({"_id": ObjectId(data["seller_id"])})
    return "delete"


@seller.route("/create", methods=['POST'])
def create_seller():
    groupbuy_db.Seller.insert_one(request.get_json())
    return "created" ,200

@seller.route("/check_username_existence", methods=['POST'])
def check_username():
    data = request.get_json()
    user = groupbuy_db.User.find_one({"username": data["username"]})
    exist = False
    
    if user is not None:
        exist = True

    return {"exist": exist} , 200

@seller.route("/check_email_existence", methods=['POST'])
def check_email():
    data = request.get_json()
    user = groupbuy_db.Seller.find_one({"email": data["email"]})
    exist = False
    if user is not None:
        exist = True
        
    return {"exist": exist} , 200

@seller.route("/update", methods=['PUT'])
def update_seller():
    data = request.get_json()
    toUpdate ={"$set": {data["attribute"] : data["value"]}}
    groupbuy_db.Seller.update_one({"_id": ObjectId(data["seller_id"])}, toUpdate)
    return "updated"


def define_seller():
    seller_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "Seller",
            "required": [ "fname", "lname", "username", "password","email"],
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
                "products": {
                "bsonType": "array",
                "items": {
                    "bsonType" : "objectId",
                    "description":"'item' must be a string and is required"
                },
                },
            }
        }
    }

    try:
        groupbuy_db.create_collection("Seller")

    except Exception as e:
        print(e)

    groupbuy_db.command("collMod", "Seller", validator = seller_validator)