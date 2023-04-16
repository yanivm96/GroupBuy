from flask import Blueprint,request, jsonify
from bson.objectid import ObjectId
from bson import json_util
import db

group = Blueprint("group", __name__)
groupbuy_db = db.groupBuy_db 

@group.route("/get", methods=['GET'])
def get_group():
    define_group()
    return "get" , 200


@group.route("/delete", methods=['POST'])
def delete_group():
    data = request.get_json()
    groupbuy_db.Group.delete_one({"_id": ObjectId(data["group_id"])})
    return "delete" , 200


@group.route("/create", methods=['POST'])
def create_group():
    created = False
    data = request.get_json()
    print(data)
    data["price"] = float(data["price"])
    data["amount_of_people"] = int(data["amount_of_people"])
    data["seller_id"] = ObjectId(data["seller_id"])
    group = groupbuy_db.Group.insert_one(request.get_json())
    
    if group:
        created=True

    return {"itemCreated" :created} ,200


@group.route("/update_all_attributes", methods=['PUT'])
def update_group():
    data = request.get_json()
    id = ObjectId(data["_id"])
    amount_of_people = int(data["amount_of_people"])
    item_name = data["item_name"]
    price = float(data["price"])
    item_description = data["item_description"]
    image = data["image"]

    result = groupbuy_db.Group.update_one(
        {'_id': id},
        {'$set' : {
        'amount_of_people': amount_of_people,
          'item_name' : item_name,
          'price' : price,
          'item_description' : item_description,
          'image' : image
          }}
    )

    return {"itemUpdated": True} , 200


@group.route("/all", methods=['GET'])
def get_all_groups():
    groups = groupbuy_db.Group.find({})
    json_groups = json_util.dumps(groups)

    return jsonify(json_groups), 200

@group.route("/seller_groups", methods=['POST'])
def get_groups_by_seller_id():
    data = request.get_json()
    groups = groupbuy_db.Group.find({"seller_id": ObjectId(data["seller_id"])})
    json_groups = json_util.dumps(groups)
    for group in groups:
        print(group)

    return jsonify(json_groups), 200

@group.route("/user_groups", methods=['POST'])
def get_groups_by_user_id():
    data = request.get_json()
    print(data)
    groups = groupbuy_db.Group.find({"users": ObjectId(data["user_id"])})
    json_groups = json_util.dumps(groups)

    return jsonify(json_groups), 200


@group.route("/manage_like", methods=['PUT'])
def update_vote_for_group():
    data = request.get_json()
    joined_users_list = False
    user_in_group = groupbuy_db.Group.find_one({"_id": ObjectId(data["groupID"]),
                                                   "users": ObjectId(data["userID"])})
    
    group = groupbuy_db.Group.find_one({"_id": ObjectId(data["groupID"])})
    numberOfPeople = group["amount_of_people"]

    if user_in_group:
        delete_from_users_list(data["userID"],data["groupID"])
        numberOfPeople+=1

    else:
        insert_to_users_list(data["userID"],data["groupID"])
        joined_users_list = True
        numberOfPeople-=1


    return {"joined": joined_users_list,
            "amount_of_people": numberOfPeople}, 200

def find_user_or_seller(isSeller, id):
    person = None
    if isSeller:
        person = groupbuy_db.Seller.find_one({"_id": ObjectId(id)})
    else:
        person = groupbuy_db.User.find_one({"_id": ObjectId(id)})

    return person

@group.route("/like", methods=['POST'])
def is_user_like_group():
    data = request.get_json()
    is_like = False
    user_in_group = groupbuy_db.Group.find_one({"_id": ObjectId(data["groupID"]),
                                                   "users": ObjectId(data["userID"])})
    if user_in_group:
        is_like= True

    return {"is_like": is_like}, 200


def delete_from_users_list(user_id,group_id):
    groupbuy_db.Group.update_one(
    {"_id": ObjectId(group_id)},
    {"$pull": {"users": ObjectId(user_id)}})
    update_amount_of_people(group_id, True)
    

def insert_to_users_list(user_id,group_id):
    groupbuy_db.Group.update_one(
    {"_id": ObjectId(group_id)},
    {"$push": {"users": ObjectId(user_id)}})
    update_amount_of_people(group_id, False)


def update_amount_of_people(group_id,increas):
    if increas:
        groupbuy_db.Group.update_one({"_id": ObjectId(group_id)},
        {"$inc": {"amount_of_people": 1}})
    else:
        groupbuy_db.Group.update_one({"_id": ObjectId(group_id)},
        {"$inc": {"amount_of_people": -1}})

def define_group():
    group_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "Group",
            "required": [ "item_name", "price","amount_of_people", "item_description", "seller_id"],
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
                "image": {
                "bsonType": "string",
                "description": "image must be a string and is required"
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