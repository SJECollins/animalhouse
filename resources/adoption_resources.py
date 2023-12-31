from datetime import datetime
from flask_restful import Resource, reqparse
from pymongo import errors
from bson.objectid import ObjectId
from emails.email_handler import send_adoption_mail


class AdoptionRequestCreateResource(Resource):
    """
    Resource to create an adoption request.
    """

    def __init__(self, **kwargs):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            "username", type=str, required=True, help="Name is required"
        )
        self.parser.add_argument(
            "email",
            type=str,
            required=False,
        )
        self.parser.add_argument(
            "phone",
            type=str,
            required=False,
        )
        self.parser.add_argument(
            "account_id",
            type=str,
            required=False,
        )
        self.parser.add_argument(
            "animal",
            type=str,
            required=True,
            help="There has been an error adding the animal",
        )
        self.parser.add_argument(
            "animal_id",
            type=str,
            required=True,
            help="There has been an error adding the animal",
        )
        self.parser.add_argument(
            "message", type=str, required=True, help="Message is required"
        )
        self.parser.add_argument(
            "status",
            type=str,
            required=False,
            help="Status is required",
            default="Submitted",
        )
        self.mongo = kwargs["mongo"]
        super(AdoptionRequestCreateResource, self).__init__()

    def post(self):
        data = self.parser.parse_args()
        if not data["username"]:
            return {"username": ["Name is required"]}, 400
        if not data["email"] and not data["phone"]:
            return {"non_field_errors": ["Email or phone number is required"]}, 400
        if not data["animal"]:
            return {
                "animal": [
                    "There has been an error adding the animal, please return to their profile and try again"
                ]
            }, 400
        if not data["animal_id"]:
            return {
                "animal_id": [
                    "There has been an error adding the animal, please return to their profile and try again"
                ]
            }, 400
        if not data["message"]:
            return {"message": ["Message is required"]}, 400

        try:
            data["date_created"] = datetime.now()
            self.mongo.db.adoption_requests.insert_one(data)
            send_adoption_mail(data["email"], data["username"], data["animal"])
            return {"message": "Adoption request created successfully"}, 201
        except errors.PyMongoError as e:
            return {
                "none_field_errors": [
                    "An error occurred creating the adoption request"
                ],
                "error": str(e),
            }, 500
        except Exception as e:
            return {
                "non_field_errors": ["An unexpected error occurred"],
                "error": str(e),
            }, 500


class AdoptionListResource(Resource):
    """
    Resource to get all adoption requests.
    """

    def get(self, user_id):
        from app import mongo

        try:
            if user_id == "all":
                adoption_requests = mongo.db.adoption_requests.find()
            else:
                adoption_requests = list(
                    mongo.db.adoption_requests.find({"account_id": user_id})
                )
                if len(adoption_requests) == 0:
                    return {
                        "message": "No adoption requests found",
                        "adoption_requests": [],
                    }
            request_list = []
            for adoption_request in adoption_requests:
                adoption_request["_id"] = str(adoption_request["_id"])
                adoption_request["date_created"] = adoption_request[
                    "date_created"
                ].isoformat()
                request_list.append(adoption_request)
            print(request_list)
            return {
                "message": "Adoption requests retrieved successfully",
                "adoption_requests": request_list,
            }
        except errors.PyMongoError as e:
            return {
                "message": "An error occurred while retrieving the adoption requests",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500


class AdoptionRequestResource(Resource):
    """
    Resource to retrieve, update and delete an adoption request.
    """

    def __init__(self, **kwargs):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            "username", type=str, required=True, help="Name is required"
        )
        self.parser.add_argument(
            "email",
            type=str,
            required=False,
        )
        self.parser.add_argument(
            "phone",
            type=str,
            required=False,
        )
        self.parser.add_argument(
            "account_id",
            type=str,
            required=False,
        )
        self.parser.add_argument(
            "animal",
            type=str,
            required=True,
            help="There has been an error adding the animal",
        )
        self.parser.add_argument(
            "animal_id",
            type=str,
            required=True,
            help="There has been an error adding the animal",
        )
        self.parser.add_argument(
            "message", type=str, required=True, help="Message is required"
        )
        self.parser.add_argument(
            "status",
            type=str,
            required=False,
            help="Status is required",
        )
        self.mongo = kwargs["mongo"]
        super(AdoptionRequestResource, self).__init__()

    def get(self, adoption_id):
        try:
            adoption_request = self.mongo.db.adoption_requests.find_one(
                {"_id": ObjectId(adoption_id)}
            )
            adoption_request["_id"] = str(adoption_request["_id"])
            return {
                "message": "Adoption request retrieved successfully",
                "adoption_request": adoption_request,
            }
        except errors.PyMongoError as e:
            return {
                "message": "An error occurred while retrieving the adoption request",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500

    def put(self, adoption_id):
        data = self.parser.parse_args()
        if not data["username"]:
            return {"username": ["Name is required"]}, 400
        if not data["email"] and not data["phone"]:
            return {"non_field_errors": ["Email or phone number is required"]}, 400
        if not data["animal"]:
            return {
                "animal": [
                    "There has been an error retrieving the animal, please try again"
                ]
            }, 400
        if not data["animalId"]:
            return {
                "animalId": [
                    "There has been an error retrieving the animal, please try again"
                ]
            }, 400
        if not data["message"]:
            return {"message": ["Message is required"]}, 400

        try:
            self.mongo.db.adoption_requests.update_one(
                {"_id": ObjectId(adoption_id)}, {"$set": data}
            )
            return {"message": "Adoption request updated successfully"}, 200
        except errors.PyMongoError as e:
            return {
                "message": "An error occurred while updating the adoption request",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500

    def delete(self, adoption_id):
        try:
            self.mongo.db.adoption_requests.delete_one({"_id": ObjectId(adoption_id)})
            return {"message": "Adoption request deleted successfully"}, 200
        except errors.PyMongoError as e:
            return {
                "message": "An error occurred while deleting the adoption request",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500
