from user import user
from seller import seller
from item import item
from group import group
from db import groupBuy_db, ObjectId
from flask import Flask, request,Blueprint, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager,create_access_token,unset_jwt_cookies, jwt_required, get_jwt_identity

import os

app = Flask(__name__)
cors = CORS(app,supports_credentials=True)
app.config["JWT_SECRET_KEY"] = os.environ.get("SECERT_KEY")



jwt = JWTManager(app)


app.register_blueprint(user,url_prefix="/user")
app.register_blueprint(seller,url_prefix="/seller")
app.register_blueprint(item,url_prefix="/item")
app.register_blueprint(group,url_prefix="/group")




@app.route("/login", methods=['POST'])
def check_user_login():
    exist = False
    is_seller = False
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    user = groupBuy_db.User.find_one({"username": username,
                                      "password": password})
    seller = groupBuy_db.Seller.find_one({"username": username,
                                      "password": password})
    if user or seller:
        if seller:
            is_seller = True
            user = seller
        user_id = str(user["_id"])
        exist = True
        access_token = create_access_token(identity=user_id)

    print(user_id)
    return {"UserExist": exist,
            "isSeller": is_seller,
            "accessToken": access_token}, 200

@app.route("/login", methods=['GET'])
@jwt_required()
def token_login():
    is_seller = False
    exists = False
    current_user = get_jwt_identity()
    print(type(current_user))
    user = groupBuy_db.User.find_one({"_id": ObjectId(current_user)})
    seller = groupBuy_db.Seller.find_one({"_id": ObjectId(current_user)})
    if user or seller:
        if seller:
            is_seller = True
        exists = True

    print(current_user)
    return {"exists": exists, "isSeller": is_seller}


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.errorhandler(Exception)
def handle_exception(e):
    return "An error occurred: {}".format(str(e)), 500

@app.route("/", methods=["POST"])
def fuck():
    print(":sfacvavc")
    print(request.get_json())
    return "CSACASCA" ,200


if __name__ == '__main__':
    app.run(debug=True, port=5000)





