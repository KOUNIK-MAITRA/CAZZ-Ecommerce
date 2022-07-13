import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import Link from 'next/link'

import valid from '../utils/valid'
import { patchData } from '../utils/fetchData'

import { imageUpload } from '../utils/imageUpload'

const Profile = () => {
    const initialSate = {
        avatar: '',
        name: '',
        password: '',
        cf_password: ''
    }
    const [data, setData] = useState(initialSate)
    const { avatar, name, password, cf_password } = data

    const { state, dispatch } = useContext(DataContext)
    const { auth, notify, orders } = state



    useEffect(() => {
        if (auth.user) setData({ ...data, name: auth.user.name })
    }, [auth.user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const handleUpdateProfile = e => {
        e.preventDefault()
        if (password) {
            const errMsg = valid(name, auth.user.email, password, cf_password)
            if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } })
            updatePassword()
        }

        if (name !== auth.user.name || avatar) updateInfor()
    }

    const updatePassword = () => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        patchData('user/resetPassword', { password }, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
    }

    const changeAvatar = (e) => {
        const file = e.target.files[0]
        if (!file)
            return dispatch({ type: 'NOTIFY', payload: { error: 'File does not exist.' } })

        if (file.size > 5120 * 5120) //5mb
            return dispatch({ type: 'NOTIFY', payload: { error: 'The largest image size is 5mb.' } })

        if (file.type !== "image/jpeg" && file.type !== "image/png") //1mb
            return dispatch({ type: 'NOTIFY', payload: { error: 'Image format is incorrect.' } })

        setData({ ...data, avatar: file })
    }

    const updateInfor = async () => {
        let media;
        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        if (avatar) media = await imageUpload([avatar])

        patchData('user', {
            name, avatar: avatar ? media[0].url : auth.user.avatar
        }, auth.token).then(res => {
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

            dispatch({
                type: 'AUTH', payload: {
                    token: auth.token,
                    user: res.user
                }
            })
            return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
        })
    }

    if (!auth.user) return null;
    return (
        <div className="profile_page">
            <Head>
                <title>Profile</title>
            </Head>

            <div className=" row text-secondary my-3 justify-content-between">

                <div className="personal-details col-md-4">
                    <div style={{ backgroundColor: "darkcyan", color: "white", padding: "1rem" }}>
                        <h3 className="text-center text-uppercase">
                            <b>
                                {auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'}
                            </b>
                        </h3>

                        <div className="avatar">
                            <div className='d-flex'>
                                <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
                                    alt="avatar" />
                            </div>

                            <span>
                                <i className="fas fa-camera"></i>
                                <p>Change</p>
                                <input type="file" name="file" id="file_up"
                                    accept="image/*" onChange={changeAvatar} />
                            </span>

                        </div>

                    </div>
                    <hr />
                    <div style={{ backgroundColor: "#f1f1f1", padding: "1rem" }}>
                        <div className="form-group">
                            <label htmlFor="name"> <b>Name</b></label>
                            <input type="text" name="name" value={name} className="form-control"
                                placeholder="Your name" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email"> <b>Email</b></label>
                            <input type="text" name="email" value={auth.user.email}
                                className="form-control" disabled={true} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password"> <b>New Password</b></label>
                            <input type="password" name="password" value={password} className="form-control"
                                placeholder="Your new password" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cf_password"><b>Confirm New Password</b></label>
                            <input type="password" name="cf_password" value={cf_password} className="form-control"
                                placeholder="Confirm new password" onChange={handleChange} />
                        </div>
                        <button className="btn btn-dark" disabled={notify.loading}
                            onClick={handleUpdateProfile} style={{ borderRadius: "0" }}>
                            Update
                        </button>
                    </div>



                </div>


                <div className="col-md-7 user-order-details my-3">
                    <h3 className="text-uppercase"><b>Orders</b></h3>

                    <div className="my-3 table-responsive">
                        <table className="table-bordered table-hover w-100 text-uppercase"
                            style={{ cursor: 'pointer' }}>
                            <thead className="bg-light font-weight-bold">
                                <tr>
                                    <td className="p-2">id</td>
                                    <td className="p-2">date</td>
                                    <td className="p-2">total</td>
                                    <td className="p-2">paid</td>
                                    <td className="p-2">dispatched</td>
                                    <td className="p-2">delivered</td>



                                </tr>
                            </thead>

                            <tbody style={{ textTransform: "none" }}>
                                {
                                    orders.reverse().map(order => (
                                        <tr key={order._id}>
                                            <td className="p-2">
                                                <Link href={{
                                                    pathname: '/order/[id]',
                                                    query: { id: order._id }
                                                }}
                                                >
                                                    <div className='order-id-link'>
                                                        <a>{order._id}</a>
                                                    </div>
                                                </Link>
                                                <Link href={{
                                                    pathname: '/order/[id]',
                                                    query: { id: order._id }
                                                }}>
                                                    <div className='order-id-link text-danger'>
                                                        <a>{(auth.user.role === 'user' && !order.paid) && <b>Pay here</b>}</a>
                                                    </div>
                                                </Link>

                                            </td>
                                            <td className="p-2">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-2">Rs {order.total - order.discount + order.shipping}</td>
                                            <td className="p-2 text-center">
                                                {
                                                    order.paid
                                                        ? <i className="fas fa-check text-success"></i>
                                                        : <i className="fas fa-times text-danger"></i>
                                                }
                                            </td>
                                            <td className="p-2 text-center">
                                                {
                                                    order.dispatched
                                                        ? <i className="fas fa-check text-success"></i>
                                                        : <i className="fas fa-times text-danger"></i>
                                                }
                                            </td>
                                            <td className="p-2 text-center">
                                                {
                                                    order.delivered
                                                        ? <i className="fas fa-check text-success"></i>
                                                        : <i className="fas fa-times text-danger"></i>
                                                }
                                            </td>

                                        </tr>
                                    ))
                                }
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile