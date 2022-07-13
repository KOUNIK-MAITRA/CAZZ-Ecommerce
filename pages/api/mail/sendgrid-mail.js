const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;


sgMail.setApiKey(SENDGRID_API_KEY);

export default (req, res) => {

    const { name, email, templateId, dynamic_template_data } = JSON.parse(req.body);

    const msg = {
        to: email,
        from: {
            email: 'official@cazz.in',
            name: "Cazz Tshirts"
        },
        templateId: templateId,
        dynamic_template_data: {
            subject: dynamic_template_data.subject,
            name: name,
            verifyUrl: dynamic_template_data.verifyUrl,
            deliveryService: dynamic_template_data.deliveryService,
            trackingId: dynamic_template_data.trackingId,
            orderId: dynamic_template_data.orderId,

        },

    }
    sgMail
        .send(msg)
        .then(() => {
            console.log("Message sent")
        })
        .catch((error) => {
            console.error(error)
        })


    res.status(200).json({ status: "Ok" });

}




