from datetime import datetime
from bson.objectid import ObjectId
from flask_restful import Resource, reqparse
import pymongo.errors
import werkzeug

import cloudinary.uploader


class AnimalResource(Resource):
    """
    Resource to create, read, update or destroy a single animal.
    """

    def __init__(self, **kwargs):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            "name", type=str, location="form", required=True, help="Name is required"
        )
        self.parser.add_argument(
            "species",
            type=str,
            location="form",
            required=True,
            help="Species is required",
        )
        self.parser.add_argument(
            "breed", type=str, location="form", required=True, help="Breed is required"
        )
        self.parser.add_argument(
            "age", location="form", type=int, required=True, help="Age is required"
        )
        self.parser.add_argument(
            "description",
            type=str,
            location="form",
            required=True,
            help="Description is required",
        )
        self.parser.add_argument(
            "picture",
            type=werkzeug.datastructures.FileStorage,
            location="files",
            required=False,
        )
        self.parser.add_argument(
            "adopted", location="form", type=bool, required=False, default=False
        )
        self.mongo = kwargs["mongo"]
        super(AnimalResource, self).__init__()

    def get(self, animal_id):
        try:
            object_id = ObjectId(animal_id)
            animal = self.mongo.db.animals.find_one({"_id": object_id})
            animal["_id"] = str(animal["_id"])
            animal["date_created"] = animal["date_created"].strftime("%d/%m/%Y")
            return {"message": "Animal retrieved", "animal": animal}
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while retrieving the animal",
                "error": str(e),
            }, 500

    def put(self, animal_id):
        try:
            object_id = ObjectId(animal_id)
            animal = self.mongo.db.animals.find_one({"_id": object_id})
            if animal:
                update_data = self.parser.parse_args()
                print(update_data)
                if update_data["picture"] != "default":
                    try:
                        upload_result = cloudinary.uploader.upload(
                            update_data["picture"]
                        )
                        update_data["picture"] = upload_result["secure_url"]
                    except Exception as e:
                        return {
                            "picture": ["An error occurred uploading the picture"],
                            "error": str(e),
                        }, 500
                else:
                    update_data["picture"] = "placeholder.png"
                update = self.mongo.db.animals.update_one(
                    {"_id": object_id}, {"$set": update_data}
                )
                print(update)
                return {"message": "Animal updated", "animal_id": animal_id}
            else:
                return {"message": "Animal not found"}, 404
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while updating the animal",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500

    def delete(self, animal_id):
        try:
            self.mongo.db.animals.delete_one({"_id": animal_id})
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while deleting the animal",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500
        return {"message": "Animal deleted", "animal_id": animal_id}


class AnimalCreateResource(Resource):
    """
    Resource to create a single animal.
    """

    def __init__(self, **kwargs):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            "name", type=str, location="form", required=True, help="Name is required"
        )
        self.parser.add_argument(
            "species",
            type=str,
            location="form",
            required=True,
            help="Species is required",
        )
        self.parser.add_argument(
            "breed", type=str, location="form", required=True, help="Breed is required"
        )
        self.parser.add_argument(
            "age", location="form", type=int, required=True, help="Age is required"
        )
        self.parser.add_argument(
            "description",
            type=str,
            location="form",
            required=True,
            help="Description is required",
        )
        self.parser.add_argument(
            "picture",
            type=werkzeug.datastructures.FileStorage,
            location="files",
            required=False,
        )
        self.parser.add_argument(
            "adopted", location="form", type=bool, required=False, default=False
        )
        self.mongo = kwargs["mongo"]
        super(AnimalCreateResource, self).__init__()

    def post(self):
        data = self.parser.parse_args()

        if data["name"] == "":
            return {"name": ["Name is required"]}, 400
        if data["species"] == "":
            return {"species": ["Species is required"]}, 400
        if data["breed"] == "":
            return {"breed": ["Breed is required"]}, 400
        if data["age"] == "":
            return {"age": ["Age is required"]}, 400
        if data["description"] == "":
            return {"description": ["Description is required"]}, 400
        if (
            not data["name"]
            and not data["species"]
            and not data["breed"]
            and not data["age"]
            and not data["description"]
        ):
            return {"non_field_errors": ["Please fill in the form."]}, 400

        if self.mongo.db.animals.find_one({"name": data["name"]}):
            return {"name": ["An animal with that name already exists"]}, 400

        if data["picture"] != "default":
            try:
                upload_result = cloudinary.uploader.upload(data["picture"])
                data["picture"] = upload_result["secure_url"]
            except Exception as e:
                return {
                    "picture": ["An error occurred uploading the picture"],
                    "error": str(e),
                }, 500
        else:
            data["picture"] = "placeholder.png"
        new_animal = {
            "name": data["name"],
            "species": data["species"],
            "breed": data["breed"],
            "age": data["age"],
            "description": data["description"],
            "picture": data["picture"],
            "date_created": datetime.today(),
            "adopted": False,
        }
        try:
            animal_data = self.mongo.db.animals.insert_one(new_animal)
            animal_id = str(animal_data.inserted_id)
            return {
                "message": "Animal created successfully",
                "animal": animal_id,
            }, 201
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred creating the animal",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500


class AnimalListResource(Resource):
    """
    Resource to return a list of all animals.
    """

    def get(self):
        from app import mongo

        try:
            animals = list(mongo.db.animals.find())
            animal_list = []
            for animal in animals:
                animal["_id"] = str(animal["_id"])
                animal["date_created"] = animal["date_created"].isoformat()
                animal_list.append(animal)
            return {"message": "Animals retrieved", "animals": animal_list}
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while retrieving the animals",
                "error": str(e),
            }, 500
        except Exception as e:
            return {"message": "An unexpected error occurred", "error": str(e)}, 500
