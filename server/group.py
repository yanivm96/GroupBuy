from flask import Blueprint,request
from bson.objectid import ObjectId
import db

group = Blueprint("group", __name__)
groupbuy_db = db.groupBuy_db 

@group.route("/get", methods=['GET'])
def get_group():
    define_group()
    return "get"


@group.route("/delete", methods=['DELETE'])
def delete_group():
    data = request.get_json()
    groupbuy_db.Group.delete_one({"_id": ObjectId(data["group_id"])})
    return "delete"


@group.route("/create", methods=['POST'])
def create_group():
    created = False
    data = request.get_json()
    data["price"] = float(data["price"])
    data["amount_of_people"] = int(data["amount_of_people"])
    group = groupbuy_db.Group.insert_one(request.get_json())
    
    if group:
        created=True

    return {"itemCreated" :created} ,200


@group.route("/update", methods=['PUT'])
def update_group():
    data = request.get_json()
    toUpdate ={"$set": {data["attribute"] : data["value"]}}
    a = groupbuy_db.Group.update_one({"_id": ObjectId(data["group_id"])}, toUpdate)
    return "updated"


def define_group():
    group_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "Group",
            "required": [ "item_name", "price","amount_of_people", "item_description"],
            "properties": {
                "item_name": {
                "bsonType": "string",
                "description": "'item_name' must be a string and is required"
                },
                "price": {
                "bsonType": "double",
                "description": "'price' must be a string and is required"
                },
                "amount_of_people": {
                "bsonType": "int",
                "description": "'amount_of_people' must be a string and is required"
                },
                "item_description": {
                "bsonType": "string",
                "description": "'amount_of_people' must be a string and is required"
                },
                "seller_id": {
                "bsonType": "objectId",
                "description": "'seller_id' must be a string and is required"
                },
                "users": {
                "bsonType": "array",
                "items":{
                    "bsonType" : "objectId",
                    "description":"'user' must be a string and is required"
                },
                "description": "'array' must be a string and is required"
                },
            }
        }
    }

    try:
        groupbuy_db.create_collection("Group")

    except Exception as e:
        print(e)

    groupbuy_db.command("collMod", "Group", validator = group_validator)