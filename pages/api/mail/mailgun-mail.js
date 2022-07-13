const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
const mailgun_api_key = process.env.MAILGUN_API_KEY;
const mailgun_domain = process.env.MAILGUN_DOMAIN;
export default async function mailing(req, res) {


    if (req.method === "POST") {

        const auth = {
            auth: {
                api_key: mailgun_api_key,
                domain: mailgun_domain
            }
        };

        const transporter = nodemailer.createTransport(mailGun(auth));
        const body = JSON.parse(req.body);
        const name = body.name;
        const email = body.email;
        const subject = body.subject;
        const message = body.message;
        const msg = {
            from: email,
            to: 'official@cazz.in',
            subject: `${name} wants to contact Cazz!`,
            text: `Subject:${subject}\nMessage:${message}`,
            html: ` <b>Name:${name}</b>
                 <br>
                <b>Email:${email}</b>
                <br>
                Subject:${subject}
                <br>
                Message:${message}
              `
        };
        transporter.sendMail(msg, function (err, data) {
            if (err) {
                console.log(err);
                res.status(400).json("Failure! Try again!");
            }
            else {
                console.log("Message sent");
                res.status(200).json("Yay! Successfully sent!");
            }
        })

    }
}
