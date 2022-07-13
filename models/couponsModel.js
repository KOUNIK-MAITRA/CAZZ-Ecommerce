import mongoose from 'mongoose'

const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    discount: {
        type: Number,
        required: true,

    },
    category: {
        type: String,
        required: true,

    },
    used: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

let Dataset = mongoose.models.coupons || mongoose.model('coupons', CouponSchema)
export default Dataset