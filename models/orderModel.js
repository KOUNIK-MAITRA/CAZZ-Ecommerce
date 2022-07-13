import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    address: String,
    mobile: String,
    size: String,
    cart: Array,
    discount: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    total: Number,

    paymentId: String,
    method: String,
    delivered: {
        type: Boolean,
        default: false
    },
    dispatched: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: false
    },
    dateOfPayment: Date,



},

    {
        timestamps: true
    }


)

let Dataset = mongoose.models.order || mongoose.model('order', orderSchema)
export default Dataset