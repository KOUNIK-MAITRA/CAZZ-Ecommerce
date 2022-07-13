import Head from 'next/head'
import { useContext, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import { updateItem } from '../store/Actions'
import { postData, putData } from "../utils/fetchData";

const Coupons = () => {
    const [name, setName] = useState('')
    const [discount, setDiscount] = useState()
    const [category, setCategory] = useState("all");

    const { state, dispatch } = useContext(DataContext)

    const { categories, coupons, auth } = state

    const [id, setId] = useState('')

    const createCoupon = async () => {
        if (auth.user.role !== 'admin')
            return dispatch({ type: 'NOTIFY', payload: { error: 'Authentication is not vaild.' } })

        if (!name) return dispatch({ type: 'NOTIFY', payload: { error: 'name can not be left blank.' } })
        if (!discount) return dispatch({ type: 'NOTIFY', payload: { error: 'discount can not be left blank.' } })
        if (!category) return dispatch({ type: 'NOTIFY', payload: { error: 'category can not be left blank.' } })
        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        let res;

        if (id) {

            res = await putData(`coupons/${id}`, { discount, name, category }, auth.token)
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
            dispatch(updateItem(coupons, id, res.coupon, 'ADD_COUPONS'))

        } else {
            res = await postData('coupons', { discount, name, category }, auth.token)
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
            dispatch({ type: "ADD_COUPONS", payload: [...coupons, res.newCoupon] })
        }
        setName('');
        setDiscount('');
        setCategory('all');
        setId('');
        return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
    }

    const handleEditCoupon = (couponcode) => {
        setId(couponcode._id)
        setName(couponcode.name)
        setDiscount(couponcode.discount);
        setCategory(couponcode.category);
    }

    return (
        <div className="col-md-6 mx-auto my-3" style={{ paddingTop: "78px" }}>
            <Head>
                <title>Coupons</title>
            </Head>

            <div className="input-group mb-3 ">
                <input type="text" className="form-control"
                    placeholder="Add a new Coupon" value={name}
                    onChange={e => setName(e.target.value)} />

                <div className="input-group mb-3 my-3">
                    <input type="text" className="form-control"
                        placeholder="Add Discount Amount" value={discount}
                        onChange={e => setDiscount(e.target.value)} />

                </div>

                <div className="input-group-prepend mb-3 my-3">
                    <select name="category" id="category" value={category}
                        onChange={e => setCategory(e.target.value)} className="custom-select text-capitalize">
                        <option value="all">All Products</option>
                        {
                            categories.map(item => (
                                <option key={item._id} value={item._id}>
                                    {item.name}
                                </option>
                            ))
                        }
                    </select>

                </div>

                <button className="btn btn-secondary ml-2 mt-4"
                    onClick={createCoupon} style={{ height: "100%" }}>
                    {id ? "Update" : "Create"}
                </button>




            </div>

            {
                coupons.map(couponcode => (
                    <div key={couponcode._id} className="card my-2 text-capitalize">

                        <div className="card-body d-flex justify-content-between">
                            {couponcode.name} = Rs {couponcode.discount}


                            {
                                categories.map((category) => {

                                    return category._id === couponcode.category && <b>   CATEGORY : {category.name}</b>
                                })
                            }


                            <div style={{ cursor: 'pointer' }}>
                                <i className="fas fa-edit mr-2 text-info"
                                    onClick={() => handleEditCoupon(couponcode)}></i>

                                <i className="fas fa-trash-alt text-danger"
                                    data-toggle="modal" data-target="#exampleModal"
                                    onClick={() => dispatch({
                                        type: 'ADD_MODAL',
                                        payload: [{
                                            data: coupons, id: couponcode._id,
                                            type: 'ADD_COUPONS'
                                        }]
                                    })} ></i>
                            </div>

                        </div>
                    </div>
                ))
            }

        </div>
    )
}

export default Coupons