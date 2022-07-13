
import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import bcrypt from 'bcrypt'
connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getUsers(req, res)
            break;
        case "PUT":
            await updateUserData(req, res)
            break;
        case "PATCH":
            await resetPassword(req, res)
            break;
    }
}

const getUsers = async (req, res) => {
    try {
        const { forget_password_token } = req.query;
        const user = await Users.findOne({ forget_password_token });
        if (user) {
            res.status(200).json({ status: 200, msg: "Success", user: user })
        }
        else {
            res.status(400).json({ msg: "User not found", status: 400 })
        }

    } catch (err) {
        return res.status(500).json({ err: err.message, status: 500 })
    }
}

const updateUserData = async (req, res) => {
    try {
        const { email } = req.body;
        const token = req.headers.authorization;
        const newUser = await Users.findOneAndUpdate({ email: email }, { forget_password_token: token })
        if (newUser) {
            res.status(200).json({ status: 200, msg: "Successfully updated token." })
        }
        else {
            res.status(400).json({ status: 400, msg: "Failure." });
        }
    }
    catch (err) {
        return res.status(500).json({ err: err.message, status: 500 })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password, id } = req.body

        const passwordHash = await bcrypt.hash(password, 12)

        const newUser = await Users.findOneAndUpdate({ _id: id }, { password: passwordHash })
        if (newUser)
            res.status(200).json({ status: 200, msg: "Update Success!" })
        else
            res.status(400).json({ status: 400, msg: "No such user" })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 500, err: err.message })
    }
}