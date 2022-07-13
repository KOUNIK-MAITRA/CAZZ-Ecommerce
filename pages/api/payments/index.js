const Razorpay = require("razorpay");
export default async function handler(req, res) {
  if (req.method === "POST") {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const payment_capture = 1;
    const amount = req.body.amount;
    const currency = "INR";
    const options = {
      amount: (amount * 100).toString(),
      currency,
      receipt: req.body.orderId,
      payment_capture,
    };

    try {
      const response = await razorpay.orders.create(options);
      res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (err) {

      res.status(400).json(err);
    }
  }
}
