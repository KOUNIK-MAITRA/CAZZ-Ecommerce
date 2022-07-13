import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'

// 1. adding prdts from prdt page
// 2. quantity change
// 3.delete item

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await addCart(req, res)
            break;
        case "GET":
            await getCart(req, res)
            break;
    }
}

const addCart = async (req, res) => {

    try {

        const { cart, user } = req.body
        if (user) {
            const { email, name, role } = user;

            const user_found = await Users.findOne({ email });
            const prev_cart = user_found.cart;


            // Users.cart.push(cart);
            // Users.save(done);
            const UpdateduserData = await Users.findOneAndUpdate({ email }, { cart })

            if (!UpdateduserData) return res.status(400).json({ err: 'This user does not exist.' })
            else {
                Users.update(
                    { email: email },
                    { $push: { cart: cart } },

                );
                return res.status(200).json({ msg: "successfully cart added " });

            }

        }
        else {
            return res.status(200).json({ msg: "user not logged in " });
        }

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

const getCart = async (req, res) => {

    try {

        const { email } = req.query;
        if (email) {

            const userData = await Users.findOne({ email })

            if (!userData) return res.status(400).json({ err: 'This user does not exist.' })
            else {

                return res.status(200).json({ cart: userData.cart });

            }

        }
        else {
            return res.status(200).json({ msg: "user not logged in " });
        }

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}