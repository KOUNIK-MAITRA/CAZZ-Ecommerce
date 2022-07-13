import connectDB from '../../../utils/connectDB'
import Coupons from '../../../models/couponsModel'
import auth from '../../../middleware/auth'

connectDB()

export default async (req, res) => {

    switch (req.method) {
        case "POST":
            await createCoupon(req, res)
            break;
        case "GET":
            await getCoupons(req, res)
            break;
    }
}

const createCoupon = async (req, res) => {

    try {


        const result = await auth(req, res)
        if (result.role !== 'admin')
            return res.status(400).json({ err: "Authentication is not valid." })

        const { name } = req.body
        if (!name) return res.status(400).json({ err: "Name can not be left blank." })

        const { discount } = req.body
        if (!discount) return res.status(400).json({ err: "Discount amount can not be left blank." })

        const { category } = req.body
        if (!category) return res.status(400).json({ err: "Category can not be left blank." })


        const newCoupon = new Coupons({ name, discount, category })

        await newCoupon.save()


        res.json({
            msg: 'Success! Created a new Coupon.',
            newCoupon
        })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupons.find()

        res.json({ coupons })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}