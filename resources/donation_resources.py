import stripe
from datetime import datetime
from bson.objectid import ObjectId
from flask_restful import Resource, reqparse
import pymongo.errors
from app import mongo
import os

from emails.email_handler import send_donation_mail

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")


class DonationCreateResource(Resource):
    """
    Resource to create a new donation.
    """

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            "stripeToken", type=str, required=True, help="Token is required"
        )
        self.parser.add_argument(
            "amount", type=float, required=True, help="Amount is required"
        )
        self.parser.add_argument(
            "name", type=str, required=False, help="Name is required"
        )
        self.parser.add_argument(
            "email", type=str, required=False, help="Email is required"
        )
        self.parser.add_argument(
            "phone", type=str, required=False, help="Phone is required"
        )
        self.parser.add_argument(
            "address1", type=str, required=False, help="Address is required"
        )
        self.parser.add_argument(
            "address2", type=str, required=False, help="Address is required"
        )
        self.parser.add_argument(
            "town_or_city", type=str, required=False, help="Town or city is required"
        )
        self.parser.add_argument(
            "county", type=str, required=False, help="County is required"
        )
        self.parser.add_argument(
            "postcode", type=str, required=False, help="Postcode is required"
        )
        self.parser.add_argument(
            "country", type=str, required=False, help="Country is required"
        )
        self.parser.add_argument(
            "donation_frequency",
            type=str,
            required=False,
            help="Donation frequency is required",
        )
        self.parser.add_argument(
            "account_id", type=str, required=False, help="Account ID is required"
        )
        super(DonationCreateResource, self).__init__()

    def post(self):
        try:
            donation_data = self.parser.parse_args()
            token = donation_data["stripeToken"]
            amount = donation_data["amount"]

            charge = stripe.Charge.create(
                amount=int(amount * 100),
                currency="usd",
                source=token,
                description="Donation",
            )

            print(charge)

            donation_data["date_created"] = datetime.now()
            donation_id = mongo.db.donations.insert_one(donation_data).inserted_id
            if donation_data["email"]:
                send_donation_mail(
                    donation_data["email"],
                    donation_data["name"],
                    donation_data["amount"],
                )
            return {"message": "Donation created", "donation_id": str(donation_id)}
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while creating the donation",
                "error": str(e),
            }, 500


class DonationListResource(Resource):
    """
    Resource to get all donations.
    """

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            "stripeToken", type=str, required=True, help="Token is required"
        )
        self.parser.add_argument(
            "amount", type=float, required=True, help="Amount is required"
        )
        self.parser.add_argument(
            "name", type=str, required=False, help="Name is required"
        )
        self.parser.add_argument(
            "email", type=str, required=False, help="Email is required"
        )
        self.parser.add_argument(
            "phone", type=str, required=False, help="Phone is required"
        )
        self.parser.add_argument(
            "address1", type=str, required=False, help="Address is required"
        )
        self.parser.add_argument(
            "address2", type=str, required=False, help="Address is required"
        )
        self.parser.add_argument(
            "town_or_city", type=str, required=False, help="Town or city is required"
        )
        self.parser.add_argument(
            "county", type=str, required=False, help="County is required"
        )
        self.parser.add_argument(
            "postcode", type=str, required=False, help="Postcode is required"
        )
        self.parser.add_argument(
            "country", type=str, required=False, help="Country is required"
        )
        self.parser.add_argument(
            "donation_frequency",
            type=str,
            required=False,
            help="Donation frequency is required",
        )
        self.parser.add_argument(
            "account_id", type=str, required=False, help="Account ID is required"
        )
        super(DonationListResource, self).__init__()

    def get(self, user_id):
        try:
            donations = None
            if user_id == "all":
                donations = list(mongo.db.donations.find())
            else:
                donations = mongo.db.donations.find({"account_id": user_id})
                if len(list(donations)) == 0:
                    return {
                        "message": "No donations found for this user",
                        "donations": [],
                    }
            for donation in donations:
                donation["_id"] = str(donation["_id"])
                donation["date_created"] = donation["date_created"].isoformat()
            return {
                "message": "Donations retrieved successfully",
                "donations": donations,
            }
        except pymongo.errors.PyMongoError as e:
            return {
                "message": "An error occurred while retrieving the donations",
                "error": str(e),
            }, 500
