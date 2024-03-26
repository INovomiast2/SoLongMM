from mailersend import emails
import os

try:
    mailer = emails.NewEmail(mailersend_api_key=os.getenv('MAILERSEND_API_KEY'))

    mail_body = {}

    mail_from = {
        "name": "no-reply@solongmm.tech",
        "email": "info@trial-3yxj6lj6zw04do2r.mlsender.net"
    }

    reply_to = {
        "name": "Iván Dimitri Novomiast Dieguez",
        "email": "reply@trial-3yxj6lj6zw04do2r.mlsender.net"
    }

    recipients = [
        {
            "name": "Iván Dima Novo Die",
            "email": "idimnovdie1602@protonmail.com"
        }
    ]

    mailer.set_mail_from(mail_from, mail_body)
    mailer.set_mail_to(recipients, mail_body)
    mailer.set_subject("Hello from {$company}", mail_body)
    mailer.set_template("0p7kx4xdyp2l9yjr", mail_body)
    mailer.send(mail_body)
except:
    print("Error: Mail not send!")