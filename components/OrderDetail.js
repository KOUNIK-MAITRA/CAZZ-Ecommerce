import Link from 'next/link'
import { useState } from 'react'
import { patchData } from '../utils/fetchData'
import { updateItem } from '../store/Actions'
import CryptoJS from 'crypto-js'



const OrderDetail = ({ orderDetail, state, dispatch }) => {
    const [serviceLink, setServiceLink] = useState('');
    const [trackingId, setTrackingId] = useState('');

    const { auth, orders } = state
    const { name, email } = auth.user;



    const handleDelivered = (order) => {
        if (order.dispatched === true) {
            dispatch({ type: 'NOTIFY', payload: { loading: true } })

            patchData(`order/delivered/${order._id}`, null, auth.token)
                .then(res => {
                    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                    const { paid, dateOfPayment, method, delivered } = res.result

                    dispatch(updateItem(orders, order._id, {
                        ...order, paid, dateOfPayment, method, delivered
                    }, 'ADD_ORDERS'))

                    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                })
            const emailInfo = {
                name: orderDetail[0].user.name,
                email: orderDetail[0].user.email,
                templateId: 'd-8cf342ccda934759ba7c2fb7ce71359e',
                dynamic_template_data: {
                    subject: 'Order-Delivered',
                    orderId: orderDetail[0]._id
                }

            }

            fetch('/api/mail/sendgrid-mail', {
                method: 'post',
                body: JSON.stringify(emailInfo)
            }).then().catch(err => {
                dispatch({ type: 'NOTIFY', payload: { error: 'Something went wrong while mailing your order confirmation.' } })
            })
        }
        else {
            return dispatch({ type: "NOTIFY", payload: { error: "product not yet dispatched" } })
        }
    }



    const handleDispatched = (order) => {
        if (!serviceLink || serviceLink.length <= 0 || !trackingId || trackingId.length <= 0)
            return dispatch({ type: "NOTIFY", payload: { error: " dispatch details missing" } })
        else {
            patchData(`order/dispatched/${order._id}`, null, auth.token)
                .then(res => {
                    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                    const { paid, dateOfPayment, method, dispatched } = res.result

                    dispatch(updateItem(orders, order._id, {
                        ...order, paid, dateOfPayment, method, dispatched
                    }, 'ADD_ORDERS'))

                    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                })

            const emailInfo = {
                name: orderDetail[0].user.name,
                email: orderDetail[0].user.email,
                templateId: 'd-6776293f499f4d448346c9b8abdb5171',
                dynamic_template_data: {
                    subject: 'Order-Dispatched',
                    deliveryService: `${serviceLink}`,
                    trackingId: `${trackingId}`,
                    orderId: orderDetail[0]._id
                }

            }

            fetch('/api/mail/sendgrid-mail', {
                method: 'post',
                body: JSON.stringify(emailInfo)
            }).then().catch(err => {
                dispatch({ type: 'NOTIFY', payload: { error: 'Something went wrong while mailing your order confirmation.' } })
            })
        }
    }


    const makePayment = async () => {
        const res = await initializeRazorpay();

        if (!res) {
            alert("Razorpay SDK Failed to load");
            return;
        }
        const data_to_be_send = {
            amount: orderDetail[0].total - orderDetail[0].discount + orderDetail[0].shipping,
            orderId: orderDetail[0]._id
        }
        const data = await fetch("/api/payments", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_to_be_send)
        }).then((t) =>
            t.json()
        );

        var options = {
            key: process.env.RAZORPAY_KEY,
            name: "Cazz",
            currency: data.currency,
            amount: data.amount,
            order_id: data.id,
            description: "Thankyou for shopping with Cazz",
            image: `${process.env.BASE_URL}/CazzLogo.png`,
            handler: function (response) {
                const generated_signature = CryptoJS.HmacSHA256(response.razorpay_order_id + "|" + response.razorpay_payment_id, process.env.RAZORPAY_SECRET).toString(CryptoJS.enc.Hex)
                if (generated_signature == response.razorpay_signature) {
                    dispatch({ type: 'NOTIFY', payload: { loading: true } })
                    patchData(`order/payment/${orderDetail[0]._id}`, {
                        paymentId: response.razorpay_payment_id
                    }, auth.token)
                        .then(res => {
                            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                            dispatch(updateItem(orders, orderDetail[0]._id, {
                                ...orderDetail[0],
                                paid: true, razorpayOrderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id, method: 'Razorpay'
                            }, 'ADD_ORDERS'))

                            return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                        })

                    // const emailInfo = {
                    //     name: orderDetail[0].user.name,
                    //     email: orderDetail[0].user.email,
                    //     templateId: 'd-8cf342ccda934759ba7c2fb7ce71359e',
                    //     dynamic_template_data: {
                    //         orderId: orderDetail[0]._id,
                    //         subject: "CAZZ : Order Placed",
                    //         address: OrderDetail[0].address,
                    //         mobile: OrderDetail[0].mobile,
                    //         totalAmount: OrderDetail[0].total,
                    //         discount: OrderDetail[0].discount,
                    //         shipping: OrderDetail[0].shipping,
                    //         paidAmount: OrderDetail[0].total - OrderDetail[0].discount + OrderDetail[0].shipping,
                    //     }
                    // }

                    // fetch('/api/mail/sendgrid-mail', {
                    //     method: 'post',
                    //     body: JSON.stringify(emailInfo)
                    // }).then().catch(err => {
                    //     dispatch({ type: 'NOTIFY', payload: { error: 'Something went wrong while mailing your order confirmation.' } })
                    // })

                }

            },
            prefill: {
                name: name,
                email: email,
            },
            "theme": {
                "color": "#3f8679"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };
    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            // document.body.appendChild(script);

            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };


    // const handleClick = async () => {
    //     const emailInfo = {
    //         email: orderDetail[0].user.email,
    //         message: " hi this is a test mail",
    //         name: orderDetail[0].user.name
    //     }

    //     await fetch('/api/mail/mail', {
    //         method: 'post',
    //         body: JSON.stringify(emailInfo)
    //     })
    // }




    if (!auth.user) return null;


    return (
        <>
            {
                orderDetail.map(order => (
                    <div key={order._id} style={{ margin: '20px auto' }} className="row justify-content-around">

                        <div className="" style={{ maxWidth: '600px' }}>


                            <div className=" text-dark">
                                <h3 className='text-uppercase mb-2'><b>Shipping</b></h3>
                                <hr className='mt-0' />
                                <h6 className="text-break"><b>Order Id:</b> {order._id}</h6>
                                <p><b> Name:</b> {order.user.name}</p>
                                <p><b>Email:</b>  {order.user.email}</p>
                                <p style={{ whiteSpace: "pre-wrap" }}><b>Address:</b> <p>{order.address}</p> </p>
                                <p style={{ whiteSpace: "pre-wrap" }}><b>Mobile:</b>  {order.mobile}</p>

                                <div className='my-5'>


                                    <div className="d-flex  align-items-center" >
                                        <div className='pr-2'>
                                            {order.paid ? <i className="fas fa-check-circle 
                                                                         order-status-icon 
                                                                         order-status-font-success 
                                                                          "></i>
                                                : <i className="fas fa-dot-circle order-status-icon 
                                                                order-status-font-pending 
                                                                order-status-font-pending"></i>}
                                        </div>
                                        <h5 className={`order-status-font ${order.paid ? ' order-status-font-text-success' : 'order-status-font-pending'}`}>
                                            {
                                                order.paid ? `Paid` : 'Not Paid'
                                            }
                                        </h5>
                                    </div>

                                    <div className={`ml-2 ${order.dispatched ? 'order-success' : 'order-pending'}`} style={{ width: "4px", height: "80px" }}> </div>



                                    <div className="d-flex  align-items-center" >
                                        <div className='pr-2'>
                                            {order.dispatched ? <i className="fas fa-check-circle 
                                                                         order-status-icon 
                                                                         order-status-font-success 
                                                                          "></i>
                                                : <i className="fas fa-dot-circle order-status-icon 
                                                                order-status-font-pending 
                                                                order-status-font-pending"></i>}
                                        </div>
                                        <h5 className={`order-status-font ${order.dispatched ? ' order-status-font-text-success' : 'order-status-font-pending'}`}>


                                            {
                                                order.dispatched ? `Product Dispatched` : 'Not yet Dispatched'
                                            }
                                        </h5>


                                    </div>
                                    <div className={`ml-2 ${order.delivered ? 'order-success' : 'order-pending'}`} style={{ width: "4px", height: "80px" }}> </div>

                                    <div className="d-flex  align-items-center" >
                                        <div className='pr-2'>
                                            {order.delivered ? <i className="fas fa-check-circle 
                                                                         order-status-icon 
                                                                         order-status-font-success 
                                                                          "></i>
                                                : <i className="fas fa-dot-circle order-status-icon 
                                                                order-status-font-pending 
                                                                order-status-font-pending"></i>}
                                        </div>
                                        <h5 className={`order-status-font ${order.delivered ? ' order-status-font-text-success' : 'order-status-font-pending'}`}>

                                            {
                                                order.delivered ? `Deliverd on ${order.updatedAt.substring(0, order.updatedAt.indexOf('T'))}` : 'Not Delivered'
                                            }

                                        </h5>


                                    </div>

                                </div>



                            </div>

                        </div>

                        {/* {
                            order.paid && auth.user.role !== 'admin' &&
                            <div className="p-4">
                                <button className="btn btn-primary" onClick={handleClick}>
                                    Send Mail
                                </button>
                            </div>
                        } */}

                        <div>

                            <div>
                                <h3 className='text-uppercase text-dark'><b>Your Orders</b></h3>
                                <hr className='mt-0 mb-1' />
                                {
                                    order.cart.map(item => (
                                        <div className=" d-flex border-bottom mx-0
                                                align-items-center" key={item._id} style={{ maxWidth: '550px' }}>
                                            <div className='pr-2 py-1'>
                                                <img src={item.images[0].url} alt={item.images[0].url}
                                                    style={{ height: '62px', objectFit: 'cover' }} />

                                            </div>

                                            <div>
                                                <h6 className="flex-fill text-dark  m-0 text-capitalize">
                                                    <Link href={`/product/${item._id}`}>
                                                        <a>{item.title}</a>
                                                    </Link>
                                                </h6>
                                                {item.userSize !== "N/A" && <h6 className="flex-fill text-dark m-0 text-capitalize">
                                                    Size: {item.userSize}
                                                </h6>}
                                                <span className="text text-dark  m-0">
                                                    {item.quantity} x Rs {item.price} = Rs {item.price * item.quantity}
                                                </span>
                                            </div>

                                        </div>

                                    ))

                                }
                            </div>
                            <div className='row border-bottom mx-0 py-1 justify-content-between
                                                align-items-center'>
                                <span>Order Total</span>
                                <span> <b>Rs {order.total}</b> </span>
                            </div>
                            <div className='row border-bottom mx-0 py-1 justify-content-between
                                                align-items-center'>
                                <span>Shipping</span>
                                <span> <b>Rs {order.shipping}</b> </span>
                            </div>
                            {order.discount > 0 && <div className='row border-bottom mx-0 py-1 justify-content-between
                                                align-items-center'>
                                <span>Discount Availed</span>
                                <span className='text-danger'> <b>-Rs {order.discount}</b> </span>
                            </div>}
                            <div className='my-3'>
                                {order.method && <h3 className='border-bottom py-2 text-uppercase text-dark'><b>Payment</b></h3>}
                                {
                                    order.method && <h6>Method: <em>{order.method}</em></h6>
                                }

                                {
                                    order.paymentId && <p>PaymentId: <em>{order.paymentId}</em></p>
                                }
                            </div>
                            {
                                !order.paid && auth.user.role !== 'admin' &&
                                <div className="py-4">
                                    <h2 className="mb-4 text"> <b>Total: Rs {order.total - order.discount + order.shipping}</b> </h2>
                                    <a className='payNow-btn' onClick={makePayment} > Pay Now </a>
                                </div>
                            }
                            <div className='py-5'>
                                {
                                    auth.user.role === 'admin' && order.paid && !order.dispatched && !order.delivered &&
                                    <div className='px-3 py-3 mb-3' style={{ backgroundColor: "#e6e6e6" }}>
                                        <form className='my-3'>
                                            <div class="form-group">
                                                <label for="exampleInputEmail1">Delivery service Link</label>
                                                <input type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter service link"
                                                    onChange={(e) => { setServiceLink(e.target.value) }} />
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleInputPassword1">Tracking Id</label>
                                                <input type="text" class="form-control" placeholder="Tracking Id"
                                                    onChange={(e) => { setTrackingId(e.target.value) }} />
                                            </div>

                                        </form>
                                    </div>
                                }
                                {
                                    auth.user.role === 'admin' && order.paid && !order.dispatched && !order.delivered &&
                                    <button className="btn btn-dark text-uppercase mr-3"
                                        onClick={() => handleDispatched(order)}>
                                        Mark as dispatched
                                    </button>
                                }
                                {
                                    auth.user.role === 'admin' && order.paid && order.dispatched && !order.delivered &&
                                    <button className="btn btn-dark text-uppercase"
                                        onClick={() => handleDelivered(order)}>
                                        Mark as delivered
                                    </button>
                                }

                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default OrderDetail