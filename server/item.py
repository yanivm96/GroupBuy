from flask import Blueprint,request
import db
from bson.objectid import ObjectId

item = Blueprint("item", __name__)
groupbuy_db = db.groupBuy_db 

@item.route("/get", methods=['GET'])
def get_item():
    define_item()
    return "get"


@item.route("/delete", methods=['DELETE'])
def delete_item():   
    data = request.get_json()
    groupbuy_db.Item.delete_one({"_id": ObjectId(data["item_id"])})
    return "delete"


@item.route("/create", methods=['POST'])
def create_item():
    groupbuy_db.Item.insert_one(request.get_json())
    return "created" ,200


@item.route("/update", methods=['PUT'])
def update_item():
    data = request.get_json()
    toUpdate ={"$set": {data["attribute"] : data["value"]}}
    groupbuy_db.Item.update_one({"_id": ObjectId(data["item_id"])}, toUpdate)
    return "updated"

def define_item():
    item_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "Item",
            "required": ["name"],
            "properties": {
                "name": {
                "bsonType": "string",
                "description": "'name' must be a string and is required"
                },
                "seller": {
                "bsonType": "objectId",
                "description": "'seller' must be a string and is required"
                },
            }
        }
    }

    try:
        groupbuy_db.create_collection("Item")

    except Exception as e:
        print(e)

    groupbuy_db.command("collMod", "Item", validator = item_validator)