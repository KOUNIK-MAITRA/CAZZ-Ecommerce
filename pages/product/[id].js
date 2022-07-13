import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import { getData } from '../../utils/fetchData'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'
import parse from 'html-react-parser';
const DetailProduct = (props) => {

    const [individualstocksize, setIndividualstocksize] = useState("")
    const [product] = useState(props.product)
    const [tab, setTab] = useState(0)
    const { state, dispatch } = useContext(DataContext)
    const { auth, cart, categories } = state
    const [usersize, setUsersize] = useState("");
    const [isMobile, setisMobile] = useState(false);
    const [isTshirt, setIsTshirt] = useState(true);
    const [currentCategory, setCurrentCategory] = useState("");
    const isActive = (index) => {
        if (tab === index) return " active";
        return ""
    }
    const totalImages = product.images.length;
    // console.log(categories)
    // console.log(product.category)

    useEffect(() => {
        categories.map(item => {
            // item._id === product.category && item.name === "MERCHANDISE" ? setUsersize("N/A") : console.log("not merchandise")
            if (item._id === product.category && item.name === "MERCHANDISE") {
                setUsersize("N/A")
            }
        })

    }, [categories])




    const handleSelectSize = e => {
        const { name } = e.target;
        setUsersize(name);

        const stockPresent = product.size[name]

        if (stockPresent > 0) {
            if (stockPresent < 5) {
                setIndividualstocksize("Only " + stockPresent + " left for size " + name)
            }
            else
                setIndividualstocksize("");
        }
        else {
            setIndividualstocksize("Out of Stock for size " + name)
        }

        document.querySelectorAll(".size-input").forEach(inputfeild => {
            inputfeild.classList.remove("active-input-feild")
        })
        e.target.parentElement.classList.add("active-input-feild")


    }
    useEffect(() => {

        if (window.innerWidth <= 1079) {
            setisMobile(true);
        }
    }, [])

    const handleAddtoCart = (product, cart, usersize) => {
        const payload = addToCart(product, cart, usersize)
        dispatch(payload);
        if (payload.type === "ADD_CART") {
            dispatch({ type: 'NOTIFY', payload: { success: 'Added to cart' } })
        }
    }

    if (isMobile) {
        return (
            <div className="mobile_detail_page">
                <Head>
                    <title>Product Detail</title>
                </Head>

                <div className="mobile-product-display">

                    <div className='main-image-mobile'>
                        <img src={product.images[tab].url}
                            alt={product.images[tab].url}
                        />
                        <div className='d-flex justify-content-between' style={{ position: "absolute", width: "100%", padding: "0 1rem" }}>
                            <button className='image-nav-mobile' onClick={() => tab > 0 ? setTab(tab - 1) : setTab(totalImages - 1)}>
                                <i className="fas fa-chevron-circle-left" style={{ fontSize: "140%", color: "white" }}></i>
                            </button>
                            <button className="image-nav-mobile" onClick={() => tab < totalImages - 1 ? setTab(tab + 1) : setTab(0)}>
                                <i className="fas fa-chevron-circle-right" style={{ fontSize: "140%", color: "white" }}></i>
                            </button>
                        </div>
                    </div>




                </div>

                <div className="mobile-product-info">

                    <h1 className="mobile-product-title text-uppercase" >{product.title}</h1>

                    <div className="my-2 pr-4" style={{ color: "#8d8b8b" }}><h5><b>{product.description}</b></h5></div>
                    <h5 className="mobile-product-price" style={{ fontWeight: "bolder" }}>Rs {product.price}/-</h5>
                    <hr />
                    <div className="mx-0 d-flex justify-content-between">
                        {
                            product.inStock > 0
                                ? product.inStock <= 5 ? <h6 className="text-danger">Only {product.inStock} left</h6> : ""
                                : <h6 className="text-danger">Out of Stock</h6>
                        }

                    </div>

                    {(usersize !== 'N/A') && <div className="mobile-sizes  mt-2">
                        <h6 className="text-uppercase">Select Size</h6>
                        <div className='d-flex'
                        >
                            <div
                                className="btn size-input mobile-size-btn mx-1"> <input type="button" name="S" value="S" id="size_input_S" onClick={handleSelectSize} /> <span></span>
                            </div>
                            <div
                                className="btn size-input mobile-size-btn mx-1"> <input type="button" name="M" value="M" id="size_input_M" onClick={handleSelectSize} /> <span></span>
                            </div>
                            <div
                                className="btn size-input mobile-size-btn mx-1"> <input type="button" name="L" value="L" id="size_input_L" onClick={handleSelectSize} /> <span></span>
                            </div>
                            <div
                                className="btn size-input mobile-size-btn mx-1"> <input type="button" name="XL" value="XL" id="size_input_XL" onClick={handleSelectSize} /> <span></span>
                            </div>
                            <div
                                className="btn size-input mobile-size-btn mx-1"> <input type="button" name="XXL" value="XXL" id="size_input_XXL" onClick={handleSelectSize} /> <span></span>
                            </div>

                        </div>
                        <h6 className="text-danger my-2">{individualstocksize} </h6>
                    </div>}

                    <div className='mobile-product-details'>
                        <div className="my-2">
                            {parse(product.content)}
                        </div>


                        {/* <div className="more-details-mobile my-4">
                            <p style={{ color: "darkgray" }}>
                                <b> MATERIAL AND CARE</b>
                            </p>
                            <ul >
                                <li> <b> Cotton</b> </li>
                                <li> <b> Machine-wash</b></li>
                            </ul>
                            <p style={{ color: "#11998e" }}>
                                <b>ASSOCIATES</b>
                            </p>
                            <ul>
                                <li>DESIGN BY-Designer's name</li>
                                <li>Type-Half sleeve Tshirt</li>
                            </ul>

                        </div> */}
                    </div>
                </div>

                <div className='mobile-cart-button'>
                    {!auth.user && <Link href='/signin'>
                        <a className="btn mobile-cart-btn my-2" id="cart-buttons"
                            style={{ borderRadius: "0" }}>Sign In to Add to Cart
                        </a>
                    </Link>}
                    {auth.user && <button type="button" className="btn d-block my-3 px-5 mobile-cart-btn"
                        onClick={() => handleAddtoCart(product, cart, usersize)} >
                        <i className="fas fa-shopping-cart position-relative mx-2" aria-hidden="true"></i>
                        ADD TO CART
                    </button>
                    }
                </div>


            </div>
        )
    }


    return (
        <div className="row detail_page ">
            <Head>
                <title>Product Detail</title>
            </Head>

            <div className="product-display ">
                <div className='desktop-image-display row '>
                    {product.images.map((img, index) => (
                        <img key={index} src={img.url} alt={img.url}
                            style={{ width: "98%" }}
                            className='col-md-6 col-sm-6 my-2' />
                    ))}
                </div>
            </div>

            <div className="product-info">
                <div>
                    <h2 className="product-title text-uppercase" >{product.title}</h2>
                    <div className="my-2 pr-5" style={{ color: "#8d8b8b" }}><h5><b>{product.description}</b></h5></div>
                    <div style={{ paddingRight: "8rem" }}>
                        <hr />
                    </div>
                </div>

                <h5 className="h1 product-price" style={{ fontWeight: "bolder" }}>Rs {product.price}/-</h5>

                <div className="row mx-0 d-flex justify-content-between">
                    {
                        product.inStock > 0
                            ? product.inStock <= 5 ? <h6 className="text-danger">Only {product.inStock} left</h6> : ""
                            : <h6 className="text-danger">Out of Stock</h6>
                    }

                    {/* <h6 className="text-danger">Sold: {product.sold}</h6> */}
                </div>

                {usersize !== "N/A" && <div className="sizes mt-2">
                    <h6 className="text-uppercase">Select Size</h6>
                    <div className='d-flex'
                        style={{ paddingLeft: "-1rem" }}>
                        <div
                            className="btn size-input"> <input type="button" name="S" value="S" id="size_input_S" onClick={handleSelectSize} /> <span></span>
                        </div>
                        <div
                            className="btn size-input"> <input type="button" name="M" value="M" id="size_input_M" onClick={handleSelectSize} /> <span></span>
                        </div>
                        <div
                            className="btn size-input"> <input type="button" name="L" value="L" id="size_input_L" onClick={handleSelectSize} /> <span></span>
                        </div>
                        <div
                            className="btn size-input"> <input type="button" name="XL" value="XL" id="size_input_XL" onClick={handleSelectSize} /> <span></span>
                        </div>
                        <div
                            className="btn size-input"> <input type="button" name="XXL" value="XXL" id="size_input_XXL" onClick={handleSelectSize} /> <span></span>
                        </div>

                    </div>
                    <h6 className="text-danger my-2">{individualstocksize} </h6>
                </div>}
                {auth.user && <button type="button" className="btn d-block my-3 px-5 cart-btn"
                    onClick={() => handleAddtoCart(product, cart, usersize)}>
                    <i className="fas fa-shopping-cart position-relative mx-2" aria-hidden="true"></i>
                    ADD TO CART
                </button>}
                {!auth.user && <Link href='/signin'>
                    <a className="btn cart-btn my-2" id="cart-buttons"
                        style={{ borderRadius: "0" }}>Sign In to Add to Cart
                    </a>
                </Link>}
                <div className='product-details'>
                    <div className="my-2">
                        {parse(product.content)}
                    </div>






                    {/* <div className="more-details my-4">
                        <p style={{ color: "darkgray" }}>
                            <b> MATERIAL AND CARE</b>
                        </p>
                        <ul >
                            <li> <b> Cotton</b> </li>
                            <li> <b> Machine-wash</b></li>
                        </ul>
                        <p style={{ color: "#11998e" }}>
                            <b>ASSOCIATES</b>
                        </p>
                        <ul>
                            <li>DESIGN BY-Designer's name</li>
                            <li>Type-Half sleeve Tshirt</li>
                        </ul>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ params: { id } }) {

    const res = await getData(`product/${id}`)
    // server side rendering
    return {
        props: { product: res.product }, // will be passed to the page component as props
    }
}


export default DetailProduct