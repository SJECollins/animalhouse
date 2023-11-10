import os
from flask import Flask, send_from_directory
from flask_pymongo import PyMongo
from flask_restful import Api
from flask_jwt_extended import JWTManager
from whitenoise import WhiteNoise
from flask_mail import Mail
import cloudinary
from emails.email_handler import init_mail

if os.path.exists("env.py"):
    import env

# App configuration
app = Flask(__name__)
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
mongo = PyMongo(app)
api = Api(app)
jwt = JWTManager(app)
mail = Mail()
init_mail(app)

# Email configuration
app.config["MAIL_SERVER"] = os.environ.get("MAIL_SERVER")
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.environ.get("MAIL_NAME")
app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASS")

# Using whitenoise to serve static files
app.wsgi_app = WhiteNoise(app.wsgi_app, root="frontend/build/")

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
)


# Serve React App
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists("frontend/build/" + path):
        return send_from_directory("frontend/build", path)
    else:
        return send_from_directory("frontend/build", "index.html")


# Importing resources
from resources.user_resources import (
    UserResource,
    UserDataResource,
    UserListResource,
    UserRegisterResource,
    UserLoginResource,
    UserAccessTokenRefresh,
    UserAccessTokenRemove,
)
from resources.animal_resources import (
    AnimalResource,
    AnimalListResource,
    AnimalCreateResource,
)
from resources.adoption_resources import (
    AdoptionRequestCreateResource,
    AdoptionListResource,
)

from resources.donation_resources import (
    DonationCreateResource,
    DonationListResource,
)

api.add_resource(
    UserRegisterResource, "/api/register/", resource_class_kwargs={"mongo": mongo}
)
api.add_resource(
    UserLoginResource, "/api/login/", resource_class_kwargs={"mongo": mongo}
)
api.add_resource(UserAccessTokenRefresh, "/api/refresh/")
api.add_resource(UserAccessTokenRemove, "/api/logout/")
api.add_resource(
    UserResource, "/api/user/<user_id>/", resource_class_kwargs={"mongo": mongo}
)
api.add_resource(UserDataResource, "/api/user_data/")
api.add_resource(
    UserListResource, "/api/users/", resource_class_kwargs={"mongo": mongo}
)
api.add_resource(
    AnimalResource, "/api/animal/<animal_id>/", resource_class_kwargs={"mongo": mongo}
)
api.add_resource(AnimalListResource, "/api/animals/")
api.add_resource(
    AnimalCreateResource, "/api/animal_create/", resource_class_kwargs={"mongo": mongo}
)
api.add_resource(
    AdoptionRequestCreateResource,
    "/api/adoption/request/",
    resource_class_kwargs={"mongo": mongo},
)
api.add_resource(
    AdoptionListResource,
    "/api/adoption/<user_id>/",
)
api.add_resource(
    DonationCreateResource,
    "/api/donation/create/",
    resource_class_kwargs={"mongo": mongo},
)
api.add_resource(
    DonationListResource,
    "/api/donation/<user_id>/",
    resource_class_kwargs={"mongo": mongo},
)

# Running the app
if __name__ == "__main__":
    app.run(
        host=os.environ.get("IP"),
        port=int(os.environ.get("PORT")),
        debug=os.environ.get("DEBUG"),
    )
