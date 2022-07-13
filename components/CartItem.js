import Link from 'next/link'
import { decrease, increase } from '../store/Actions'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { getData, postData } from '../utils/fetchData'
import { useRouter } from 'next/router'

const CartItem = ({ item, dispatch, cart, totaldiscount, setTotalDiscount }) => {
    const { state } = useContext(DataContext)
    const { coupons, categories, auth } = state;
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [callback, setCallback] = useState(false)
    const [couponmatch, setCouponMatch] = useState(false);
    const [isMobile, setisMobile] = useState(false);


    useEffect(() => {
        if (item.quantity >= item.size[item.userSize]) {
            dispatch({
                type: 'NOTIFY', payload: {
                    error: `Insufficient stock.Maximum quantity reached for size ${item.userSize} `
                }
            })
        }
    }, [item.quantity]);


    const handleDiscount = async () => {
        if (!coupon) {
            setCallback(!callback)
            return dispatch({
                type: 'NOTIFY', payload: {
                    error: 'Enter a valid coupon.'
                }
            })
        }

        const COUPONS = JSON.parse(JSON.stringify(coupons));
        let flag = 0;
        COUPONS.forEach(
            (eachCoupon) => {
                if (eachCoupon.name === coupon) {
                    flag = 1;
                    if (eachCoupon.category === item.category || eachCoupon.category === "all") {
                        setCouponMatch(true);
                        setDiscount(eachCoupon.discount);
                        setTotalDiscount(totaldiscount + eachCoupon.discount);
                    }
                    else {
                        setCallback(!callback)
                        return dispatch({
                            type: 'NOTIFY', payload: {
                                error: 'This coupon is not applicable for this category.Please try valid coupon for this category'
                            }
                        })
                    }

                }
            }
        )
        if (flag === 0) {
            setCallback(!callback)
            return dispatch({
                type: 'NOTIFY', payload: {
                    error: 'Enter a valid coupon.'
                }
            })
        }

    }

    const handleResetDiscount = () => {

        setCouponMatch(false);
        setDiscount(0);
        setTotalDiscount(totaldiscount - discount);
        setCoupon('');
    }

    useEffect(() => {
        if (window.innerWidth <= 768)
            setisMobile(true);
    }, [window.innerWidth])

    if (isMobile) {
        return (

            <>
                <div className='items-info'>

                    <div className="mobile-product-img d-flex ">
                        <img src={item.images[0].url} alt={item.images[0].url} />
                        <div className='mx-3'>
                            <h4 className="text-capitalize" >
                                <Link href={`/product/${item._id}`}>
                                    <a className='cart-product-item-title'>{item.title}</a>
                                </Link>
                            </h4>
                            {item.userSize !== "N/A" && <h5>Size : {item.userSize}</h5>}

                            {
                                categories.map((category) => {

                                    return category._id === item.category && <h6> {category.name}</h6>
                                })
                            }
                        </div>

                    </div>
                    <div className='quantity-price-mobile d-flex'>
                        <div className="add-minus-quantity mobile-cart-quantity" >

                            <button className="btn cart-item-btn btn-dark" onClick={() => dispatch(decrease(cart, item._id))}
                                disabled={item.quantity === 1 ? true : false}
                                style={{ padding: "0 8px" }}
                            > <b>-</b> </button>

                            <input type="text" placeholder={item.quantity} disabled style={{ fontSize: "200%", borderBottom: "none" }} />

                            <button className="btn cart-item-btn btn-dark" onClick={() => dispatch(increase(cart, item._id))}
                                disabled={item.quantity >= item.size[item.userSize] ? true : false}
                                style={{ padding: " 0 8px" }}
                            > <b>+</b> </button>

                        </div>

                        <div className='price' style={{ paddingLeft: "1rem" }}>
                            <h4 className='final-price'>Rs {(item.quantity * item.price) - (item.quantity * discount)}</h4>

                            {/* {
                                item.quantity > item.size[item.userSize]
                                    ? <p> </p>
                                    : <p className="mb-1 text-"> <h3 className='ml-2 text-danger'>Out Stock</h3> </p>
                            } */}
                        </div>
                    </div>
                    <div className='d-flex'>
                        <div className="discount-mobile" >
                            <div>
                                <input type="text" name="discount" id="discount" placeholder='Discount Coupon' value={coupon}
                                    className="form-control mb-2 mobile-discount-input" onChange={e => setCoupon(e.target.value)}
                                />
                            </div>

                            <div className="discount-buttons">
                                <Link href={auth.user ? '#!' : '/signin'}>
                                    <a className="btn cart-item-btn my-1 apply-discount" onClick={handleDiscount}
                                        style={{ pointerEvents: couponmatch ? "none" : "auto", opacity: couponmatch ? "0.5" : "1" }}
                                    >Apply Discount</a>
                                </Link>
                                <Link href={auth.user ? '#!' : '/signin'}>
                                    <a className="btn cart-item-btn my-1 mx-2 reset-discount" onClick={handleResetDiscount} style={{}}
                                    >Reset Discount</a>
                                </Link>

                            </div>

                        </div>

                        <div className="remove-item remove-item-mobile">
                            <i className="fas fa-trash-alt remove" aria-hidden="true"
                                data-toggle="modal" data-target="#exampleModal"
                                onClick={() => dispatch({
                                    type: 'ADD_MODAL',
                                    payload: [{ data: cart, id: item._id, title: item.title, type: 'ADD_CART' }]
                                })} style={{ cursor: "pointer" }} ></i>
                        </div>
                    </div>


                </div>

                <hr />


            </>
        )

    }

    return (

        <>
            <div className='items-info'>

                <div className="product-img" >
                    <img src={item.images[0].url} alt={item.images[0].url} />
                </div>

                <div className="title my-2" >
                    <h2 className="text-capitalize" >
                        <Link href={`/product/${item._id}`}>
                            <a className='cart-product-item-title'>{item.title}</a>
                        </Link>
                    </h2>

                    {item.userSize !== "N/A" && <h5>Size : {item.userSize}</h5>
                    }
                    {
                        categories.map((category) => {

                            return category._id === item.category && <h6>CATEGORY : {category.name}</h6>
                        })
                    }



                    <input type="text" name="discount" id="discount" placeholder='Discount Coupon' value={coupon}
                        className="form-control mb-2 discount-input" onChange={e => setCoupon(e.target.value)}
                    />
                    <div className="discount-buttons">
                        <Link href={auth.user ? '#!' : '/signin'}>
                            <a className="btn cart-item-btn my-1 apply-discount" onClick={handleDiscount}
                                style={{ pointerEvents: couponmatch ? "none" : "auto", opacity: couponmatch ? "0.5" : "1" }}
                            >Apply Discount</a>
                        </Link>
                        <Link href={auth.user ? '#!' : '/signin'}>
                            <a className="btn cart-item-btn my-1 mx-2 reset-discount" onClick={handleResetDiscount} style={{}}
                            >Reset Discount</a>
                        </Link>
                    </div>




                </div>

                <div className="add-minus-quantity" >

                    <button className=" btn cart-item-btn btn-dark " onClick={() => dispatch(decrease(cart, item._id))}
                        disabled={item.quantity === 1 ? true : false}
                    > <b>-</b> </button>

                    <input type="text" placeholder={item.quantity} disabled />

                    <button className="btn cart-item-btn btn-dark" onClick={() => dispatch(increase(cart, item._id))}
                        disabled={item.quantity >= item.size[item.userSize] ? true : false}
                    > <b>+</b> </button>
                </div>

                <div className='price'>
                    <h3 className='final-price'>Rs {(item.quantity * item.price) - (item.quantity * discount)}</h3>

                    {/* {
                        item.quantity > item.size[item.userSize]
                            ? <p> </p>
                            : <p className="mb-1 text-"> <h5 className='ml-2 text-danger'>Out Stock</h5> </p>
                    } */}
                </div>


                <div className="remove-item">
                    <i className="fas fa-trash-alt remove" aria-hidden="true"
                        data-toggle="modal" data-target="#exampleModal"
                        onClick={() => dispatch({
                            type: 'ADD_MODAL',
                            payload: [{ data: cart, id: item._id, title: item.title, type: 'ADD_CART' }]
                        })} style={{ cursor: "pointer" }} ></i>
                </div>

            </div>

            <hr />


        </>

    )
}

export default CartItem