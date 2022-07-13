import Link from 'next/link'
import { useContext, useState } from 'react'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'


const ProductItem = ({ product, handleCheck }) => {

    const { state, dispatch } = useContext(DataContext)
    const { cart, auth } = state

    const userLink = () => {
        return (
            <>
                {/* <Link href={`product/${product._id}`}>
                    <a className="btn view-btn"
                        style={{ marginRight: '5px', flex: 1 }}>View</a>
                </Link> */}
                {/* <button className="btn  add-to-cart-btn"
                    style={{ marginLeft: '5px', flex: 1 }}
                    disabled={product.inStock === 0 ? true : false}
                    onClick={() => dispatch(addToCart(product, cart))} >
                    Add to Cart
                </button> */}
            </>
        )
    }

    const adminLink = () => {
        return (
            <>

                <Link href=
                    {{
                        pathname: `/create/[[...id]]`,
                        query: { id: product._id },
                    }}>
                    <a className="btn btn-info"
                        style={{ marginRight: '5px', flex: 1 }}>Edit</a>
                </Link>
                <button className="btn btn-danger"
                    style={{ marginLeft: '5px', flex: 1 }}
                    data-toggle="modal" data-target="#exampleModal"
                    onClick={() => dispatch({
                        type: 'ADD_MODAL',
                        payload: [{
                            data: '', id: product._id,
                            title: product.title, type: 'DELETE_PRODUCT'
                        }]
                    })} >
                    Delete
                </button>
            </>
        )
    }


    return (
        <>
            <Link href={`product/${product._id}`}>
                <div className="card product-card " style={{ borderRadius: "0", border: "none" }}>
                    {
                        auth.user && auth.user.role === 'admin' &&
                        <input type="checkbox" checked={product.checked}
                            className="position-absolute"
                            style={{ height: '20px', width: '20px' }}
                            onChange={() => handleCheck(product._id)} />
                    }
                    <div className="product-card-img-wrapper">
                        <img className="card-img-top"
                            src={product.images[0].url} alt={product.images[0].url}
                        />
                    </div>

                    <div className="card-body" style={{ padding: "0.8rem 0" }}>
                        <h4 className="card-title text-capitalize product-card-title" title={product.title}
                            style={{ marginBottom: "0", fontWeight: "bolder" }}>
                            {product.title}
                        </h4>
                        <hr style={{ margin: "3px 0" }} />
                        <p className="card-text product-cart-description" title={product.description} style={{ margin: "0", color: "darkslategray" }}>
                            {product.description}
                        </p>

                        <div className="row justify-content-between mx-0">
                            <h5 className="product-card-price" style={{ color: "rgb(231, 98, 21)" }}><b>Rs {product.price}/-</b></h5>
                            {

                                // make these changes
                                //  show the following conditions
                                //  1. if product.inStock<5 show --> only {product.inStock} left
                                //  2. if product.inStock <=0 show --> Out of Stock 
                                //  3. else no need to show how many items are in stock
                                product.inStock > 0
                                    ? product.inStock <= 5 ? <h6 className="text-danger"> Hurry! Only {product.inStock} left</h6> : ""
                                    : <h6 className="text-danger" style={{ fontSize: "smaller" }}>Out of Stock</h6>
                            }
                        </div>

                        <div className="row justify-content-between mx-0">
                            {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
                        </div>
                    </div>

                </div>
            </Link>

        </>
    )
}


export default ProductItem