from flask_mail import Message
from flask import render_template
from flask_mail import Mail

mail = Mail()


def init_mail(app):
    mail.init_app(app)


def send_donation_mail(recipient, donor_name, donation_amount):
    print("Sending email")
    print(recipient)
    print(donor_name)
    print(donation_amount)
    subject = "Thank you for your donation"
    message = render_template(
        "emails/donation_email.html",
        donor_name=donor_name,
        donation_amount=donation_amount,
    )
    msg = Message(subject, sender="portprojtest@gmail.com", recipients=[recipient])
    msg.html = message
    mail.send(msg)
    return "Thank you email sent!"


def send_adoption_mail(recipient, adopter_name, animal_name):
    subject = "Thank you for your adoption request"
    message = render_template(
        "emails/adoption_email.html", adopter_name=adopter_name, animal_name=animal_name
    )
    msg = Message(subject, sender="portprojtest@gmail.com", recipients=[recipient])
    msg.html = message
    mail.send(msg)
    return "Thank you email sent!"


def send_registration_mail(recipient, new_user):
    subject = "Thank you for registering"
    message = render_template("emails/registration_email.html", new_user=new_user)
    msg = Message(subject, sender="portprojtest@gmail.com", recipients=[recipient])
    msg.html = message
    mail.send(msg)
    return "Thank you email sent!"
