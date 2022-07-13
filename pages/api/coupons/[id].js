import connectDB from '../../../utils/connectDB'
import Coupons from '../../../models/couponsModel'
import auth from '../../../middleware/auth'

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "PUT":
            await updateCoupon(req, res)
            break;
        case "DELETE":
            await deleteCoupon(req, res)
            break;
    }
}

const updateCoupon = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin')
            return res.status(400).json({ err: "Authentication is not valid." })

        const { id } = req.query
        const { name } = req.body
        const { discount } = req.body
        const { category } = req.body

        const newCoupon = await Coupons.findOneAndUpdate({ _id: id }, { name }, { discount }, { category })
        res.json({
            msg: "Success! Update a new coupon",
            coupon: {
                ...newCoupon._doc,
                name,
                discount,
                category
            }
        })
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

const deleteCoupon = async (req, res) => {

    try {

        const result = await auth(req, res)
        if (result.role !== 'admin')
            return res.status(400).json({ err: "Authentication is not valid." })

        const { id } = req.query

        await Coupons.findByIdAndDelete(id)

        res.json({ msg: "Success! Deleted a coupon" })
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}