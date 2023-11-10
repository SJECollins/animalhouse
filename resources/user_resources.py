import datetime
from flask import jsonify
from flask_restful import Resource, reqparse
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    unset_jwt_cookies,
    jwt_required,
)
from werkzeug.security import generate_password_hash, check_password_hash
import pymongo.errors
from bson.objectid import ObjectId


class UserResource(Resource):
    """
    Resource to create, read, update or destroy a single user.
    """

    def __init__(self, **kwargs):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            "email", type=str, required=True, help="Email is required"
        )
        self.parser.add_argument(
            "password", type=str, required=True, help="Password is required"
        )
        self.mongo = kwargs["mongo"]
        super(UserResource, self).__init__()

    def get(self, user_id):
        try:
            object_id = ObjectId(user_id)
            user = self.mongo.db.users.find_one({"_id": object_id})
            user["_id"] = str(user["_id"])
            return {"message": "User retrieved", "user": user}
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while retrieving the user",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500

    def put(self, user_id):
        try:
            object_id = ObjectId(user_id)
            user = self.mongo.db.users.find_one({"_id": object_id})
            if user:
                update_data = self.parser.parse_args()
                self.mongo.db.users.update_one({"_id": user_id}, {"$set": update_data})
                return {"message": "User updated", "user_id": user_id}
            else:
                return {"message": "User not found"}, 404
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while updating the user",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500

    def delete(self, user_id):
        try:
            object_id = ObjectId(user_id)
            self.mongo.db.users.delete_one({"_id": object_id})
            return {"message": "User deleted", "user_id": user_id}
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while deleting the user",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500

    def verify_password(self, stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)


class UserListResource(Resource):
    """
    Resource to return a list of all users.
    """

    def get(self):
        from app import mongo

        try:
            users = list(mongo.db.users.find())  # Convert cursor to list
            user_list = []
            for user in users:
                user_list.append({"_id": str(user["_id"]), "email": user["email"]})
            return {"message": "Users retrieved", "users": user_list}
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while updating the user",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500


class UserRegisterResource(Resource):
    """
    Resource to register a new user.
    """

    def __init__(self, **kwargs):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            "email", type=str, required=True, help="Email is required"
        )
        self.parser.add_argument(
            "password1", type=str, required=True, help="Password is required"
        )
        self.parser.add_argument(
            "password2", type=str, required=True, help="Please confirm your password"
        )
        self.mongo = kwargs["mongo"]
        super(UserRegisterResource, self).__init__()

    def post(self):
        data = self.parser.parse_args()
        if not data["email"] and not data["password1"] and not data["password2"]:
            return {
                "non_field_errors": ["Email and password are required"],
            }, 400
        if not data["email"]:
            return {"email": ["Email is required"]}, 400
        if not data["password1"]:
            return {"password1": ["Password is required"]}, 400
        if not data["password2"]:
            return {"password2": ["Please confirm your password"]}, 400
        if data["password1"] != data["password2"]:
            return {"non_field_errors": ["Passwords do not match"]}, 400

        user = self.mongo.db.users.find_one({"email": data["email"]})
        if user:
            return {"non_field_errors": ["User already exists"]}, 400

        hashed_password = generate_password_hash(data["password1"], method="sha256")
        new_user = {
            "email": data["email"],
            "password": hashed_password,
        }
        try:
            self.mongo.db.users.insert_one(new_user)
            return {"message": "User created successfully", "data": data}, 201
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred creating the user",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500


class UserLoginResource(Resource):
    """
    Resource to login a user.
    """

    def __init__(self, **kwargs):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            "email", type=str, required=True, help="Email is required"
        )
        self.parser.add_argument(
            "password", type=str, required=True, help="Password is required"
        )
        self.mongo = kwargs["mongo"]
        super(UserLoginResource, self).__init__()

    def post(self):
        data = self.parser.parse_args()
        if not data["email"] and not data["password"]:
            return {
                "non_field_errors": ["Email and password are required"],
            }, 400
        if not data["email"]:
            return {"email": ["Email is required"]}, 400
        if not data["password"]:
            return {"password": ["Password is required"]}, 400

        try:
            user = self.mongo.db.users.find_one({"email": data["email"]})
            if user:
                user["_id"] = str(user["_id"])
                if UserResource.verify_password(
                    self, user["password"], data["password"]
                ):
                    expires = datetime.timedelta(days=1)
                    access_token = create_access_token(
                        identity=user["_id"], expires_delta=expires
                    )
                    return {
                        "message": "User logged in",
                        "user": user,
                        "access_token": access_token,
                    }, 200
                else:
                    return {"non_field_errors": ["Incorrect password"]}, 401
            else:
                return {"message": "User not found"}, 404
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while logging in the user",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500


class UserAccessTokenRefresh(Resource):
    """
    Resource to refresh a user's access token.
    """

    def __init__(self):
        super(UserAccessTokenRefresh, self).__init__()

    def post(self):
        try:
            current_user = get_jwt_identity()
            expires = datetime.timedelta(days=1)
            access_token = create_access_token(
                identity=current_user, expires_delta=expires
            )
            return {
                "message": "Access token refreshed",
                "access_token": access_token,
            }, 200
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500


class UserAccessTokenRemove(Resource):
    """
    Resource to remove a user's access token.
    """

    def __init__(self):
        super(UserAccessTokenRemove, self).__init__()

    def post(self):
        try:
            response = jsonify({"message": "Access token removed"})
            unset_jwt_cookies(response)
            return {"message": "Access token removed"}, 200
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500


class UserDataResource(Resource):
    @jwt_required()
    def get(self):
        from app import mongo

        current_user_id = get_jwt_identity()
        current_user_id = ObjectId(current_user_id)
        try:
            user_data = mongo.db.users.find_one({"_id": current_user_id})
            if user_data:
                user_data["_id"] = str(user_data["_id"])
                return jsonify(user_data)
            else:
                return {"message": "User not found"}, 404
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while fetching user data",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500
