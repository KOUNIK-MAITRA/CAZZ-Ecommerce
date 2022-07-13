import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Array
    },
    role: {
        type: String,
        default: 'user'
    },
    root: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dmvmogza7/image/upload/v1636738095/Pngtree_user_avatar_placeholder_black_6796227_hutlq7.png'
    },
    forget_password_token: {
        type: String
    }
},
    {
        timestamps: true
    })

let Dataset = mongoose.models.user || mongoose.model('user', userSchema)
export default Dataset