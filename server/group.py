from flask import Blueprint,request, jsonify
from bson.objectid import ObjectId
from bson import json_util
import db

group = Blueprint("group", __name__)
groupbuy_db = db.groupBuy_db 

@group.route("/get", methods=['GET'])
def get_group():
    id = request.args.get('group_id')
    try:
        group = groupbuy_db.Group.find_one({"_id": ObjectId(id)})
        json_group = json_util.dumps(group)

    except Exception as e:
        print(e)
    return jsonify(json_group) , 200


@group.route("/delete", methods=['POST'])
def delete_group():
    data = request.get_json()
    groupbuy_db.Group.delete_one({"_id": ObjectId(data["group_id"])})
    return "delete" , 200


@group.route("/create", methods=['POST'])
def create_group():
    created = False
    data = request.get_json()
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

    group = groupbuy_db.Group.find_one({"_id": ObjectId(data["_id"])})
    current_amount_of_people = len(group["users"])


    result = groupbuy_db.Group.update_one(
        {'_id': id},
        {'$set' : {
        'amount_of_people': (amount_of_people) ,
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

    return jsonify(json_groups), 200

@group.route("/seller_liked_groups", methods=['POST'])
def get_liked_groups_by_seller_id():
    data = request.get_json()
    groups = groupbuy_db.Group.find({"likes": ObjectId(data["seller_id"])})
    json_groups = json_util.dumps(groups)

    return jsonify(json_groups), 200

@group.route("/user_groups", methods=['POST'])
def get_groups_by_user_id():
    data = request.get_json()
    groups = groupbuy_db.Group.find({"users": ObjectId(data["user_id"])})
    json_groups = json_util.dumps(groups)

    return jsonify(json_groups), 200

@group.route("/liked_groups", methods=['POST'])
def get_liked_groups_by_user_id():
    data = request.get_json()
    groups = groupbuy_db.Group.find({"likes": ObjectId(data["id"])})
    json_groups = json_util.dumps(groups)

    return jsonify(json_groups), 200

@group.route("/like", methods=['POST'])
def get_user_like():
    data = request.get_json()
    like = False
    user_liked_group = groupbuy_db.Group.find_one({"_id": ObjectId(data["groupID"]),
                                                       "likes": ObjectId(data["userID"])})
    if user_liked_group:
        like = True
    
    return {"like": like}, 200


@group.route("/manage_like", methods=['PUT'])
def update_vote_for_group():
    data = request.get_json()
    joined_likes_list = False

    user_liked_group = groupbuy_db.Group.find_one({"_id": ObjectId(data["groupID"]),
                                                       "likes": ObjectId(data["userID"])})
    
    group = groupbuy_db.Group.find_one({"_id": ObjectId(data["groupID"])})
    if user_liked_group:
        delete_from_likes_list(data["userID"],data["groupID"])

    else:
        insert_to_likes_list(data["userID"],data["groupID"])
        joined_likes_list = True

    return {"joined": joined_likes_list}, 200

@group.route("/unlike", methods=['PUT'])
def unlike():
    data = request.get_json()
    return delete_from_likes_list(data["id"],data["group_id"])

    
def delete_from_likes_list(user_id, group_id):
    leave = True
    try:
        groupbuy_db.Group.update_one(
        {"_id": ObjectId(group_id)},
        {"$pull": {"likes": ObjectId(user_id)}})
    except Exception as e:
        leave = False
        print(e)
    return {"result": leave}, 200

def insert_to_likes_list(user_id, group_id):
    joined = True
    try:
        if not is_user_liked_group(user_id, group_id):
            groupbuy_db.Group.update_one(
            {"_id": ObjectId(group_id)},
            {"$push": {"likes": ObjectId(user_id)}})
        else:
            raise Exception("User already like group")
    except Exception as e:
        joined = False
        print(e)
    return {"result": joined}, 200

def is_user_liked_group(user_id,group_id):
    like = False
    user_liked_group = groupbuy_db.Group.find_one({"_id": ObjectId(group_id),
                                                   "likes": ObjectId(user_id)})
    
    if user_liked_group:
        like= True

    return like


def find_user_or_seller(isSeller, id):
    person = None
    if isSeller:
        person = groupbuy_db.Seller.find_one({"_id": ObjectId(id)})
    else:
        person = groupbuy_db.User.find_one({"_id": ObjectId(id)})

    return person

def is_user_in_group(user_id,group_id):
    inside = False
    user_in_group = groupbuy_db.Group.find_one({"_id": ObjectId(group_id),
                                                   "users": ObjectId(user_id)})
    if user_in_group:
        inside= True

    return inside

@group.route("/leave", methods=['PUT'])
def delete_from_users_list():
    data = request.get_json()
    print(data)
    leave = True
    try:
        groupbuy_db.Group.update_one(
        {"_id": ObjectId(data["group_id"])},
        {"$pull": {"users": ObjectId(data["user_id"])}})
    except Exception as e:
        leave = False
        print(e)
    return {"result": leave}, 200
    
@group.route("/join", methods=['PUT'])
def insert_to_users_list():
    data = request.get_json()
    joined = True
    try:
        if not is_user_in_group(data["user_id"],data["group_id"]):
            groupbuy_db.Group.update_one(
            {"_id": ObjectId(data["group_id"])},
            {"$push": {"users": ObjectId(data["user_id"])}})
        else:
            raise Exception("User already in group")
    except Exception as e:
        joined = False
        print(e)
    return {"result": joined}, 200

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
                "likes": {
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