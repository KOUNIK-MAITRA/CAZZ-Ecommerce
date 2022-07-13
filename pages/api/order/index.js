import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await createOrder(req, res)
            break;
        case "GET":
            await getOrders(req, res)
            break;
    }
}

const getOrders = async (req, res) => {
    try {
        const result = await auth(req, res)

        let orders;
        if (result.role !== 'admin') {
            orders = await Orders.find({ user: result.id }).populate("user", "-password")
        } else {
            orders = await Orders.find().populate("user", "-password")
        }

        res.json({ orders })
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

const createOrder = async (req, res) => {

    try {
        const result = await auth(req, res)
        const { address, mobile, cart, total, discount, shipping } = req.body

        const newOrder = new Orders({
            user: result.id, address, mobile, cart, total, discount, shipping
        })

        cart.filter(item => {

            return sold(item._id, item.quantity, item.inStock, item.sold, item.userSize)
        })

        await newOrder.save()

        res.json({
            msg: 'Order success! We will contact you to confirm the order.',
            newOrder
        })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

const sold = async (id, quantity, oldInStock, oldSold, userSize) => {
    const oldSize = await Products.findOne({ _id: id }).select("size");

    oldSize.size[userSize] = String(oldSize.size[userSize] - quantity);
    await Products.findOneAndUpdate({ _id: id }, {
        inStock: oldInStock - quantity,
        size: {
            ...oldSize.size
        },
        sold: quantity + oldSold
    })
}