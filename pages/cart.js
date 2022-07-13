import Head from 'next/head'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import CartItem from '../components/CartItem'
import Link from 'next/link'
import { getData, postData } from '../utils/fetchData'
import { useRouter } from 'next/router'
import { Country, State, City } from 'country-state-city';



const Cart = () => {
  const { state, dispatch } = useContext(DataContext)
  const { coupons, cart, auth, orders } = state

  const [total, setTotal] = useState(0)
  const [address, setAddress] = useState('')
  const [pincode, setpinCode] = useState('')
  const [mobile, setMobile] = useState('')
  const [_State, setState] = useState('null')
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState('null')
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState('')
  const [totaldiscount, setTotalDiscount] = useState(0);
  const [deliverycharge, setDeliveryCharge] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [callback, setCallback] = useState(false)
  const router = useRouter()
  let totalQuantity;
  let deliveryCharge;

  // console.log(Country.getCountryByCode('IN'))
  const states = State.getStatesOfCountry('IN')

  // states.map(state => (console.log(state.name)))
  const handleStateName = (e) => {
    const { value } = e.target;
    setState(value);
    states.map(state => ((state.name === value ? setCities(City.getCitiesOfState('IN', state.isoCode)) : console.log("not found"))))
  }

  const handleCityName = (e) => {
    const { value } = e.target;
    setCity(value);

  }

  useEffect(() => {
    totalQuantity = 0;
    deliveryCharge = 0;
    if (cart) {

      cart.map(item => (totalQuantity += item.quantity))
      if (totalQuantity > 0) {

        deliveryCharge = 50 + (10 * (totalQuantity - 1));

        setDeliveryCharge(deliveryCharge);
      }
    }


    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + (item.price * item.quantity)
      }, 0)

      setTotal(res)
    }

    getTotal()
  }, [cart])


  if (auth) {
    useEffect(async () => {

      if (auth && auth.user) {

        const res = await getData(`cart?email=${auth.user.email}`)


        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        const cartLocal = res.cart;

        if (cartLocal && cartLocal.length > 0) {


          let newArr = []
          const updateCart = async () => {
            for (const item of cartLocal) {

              const res = await getData(`product/${item._id}`)

              const { _id, title, images, price, inStock, sold, category } = res.product

              if (inStock > 0) {
                newArr.push({
                  _id, title, images, price, inStock, sold, category,
                  quantity: item.quantity > inStock ? 1 : item.quantity, userSize: item.userSize
                })
              }


              //  dispatch({ type: 'ADD_CART', payload: [1, 2, 3, 4] })

            }

          }
          updateCart()
        }

      }




    }, [])
  }


  const handleConfirmOrderModal = async () => {
    setShowModal(false);
    let newCart = [];
    for (const item of cart) {
      const res = await getData(`product/${item._id}`)

      if (res.product.inStock - item.quantity >= 0) {
        newCart.push(item)
      }
    }

    if (newCart.length < cart.length) {
      setCallback(!callback)
      return dispatch({
        type: 'NOTIFY', payload: {
          error: 'The product is out of stock or the quantity is insufficient.'
        }
      })
    }

    const address_with_pincode = `${address}\nState- ${_State}\nCity- ${city}\nPincode-${pincode}`;
    const mobile_with_alternate_mobile = mobile + "\nAlternate Number-" + secondaryPhoneNumber
    console.log(cart)
    postData('order', { address: address_with_pincode, mobile: mobile_with_alternate_mobile, cart, total, discount: totaldiscount, shipping: deliverycharge }, auth.token)
      .then(res => {
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

        dispatch({ type: 'ADD_CART', payload: [] })

        const newOrder = {
          ...res.newOrder,
          user: auth.user
        }
        dispatch({ type: 'ADD_ORDERS', payload: [...orders, newOrder] })
        return router.push(`/order/${res.newOrder._id}`)
      })


  }

  const handleCancelOrderModal = () => {
    setShowModal(false);

  }


  const handleConfirmOrder = async () => {

    if (!address || !mobile || !pincode || !_State || !city)
      return dispatch({ type: 'NOTIFY', payload: { error: 'Please add all feilds.' } })

    if (mobile.length != 10)
      return dispatch({ type: 'NOTIFY', payload: { error: 'Mobile number must be of 10 digits.' } })

    if (mobile.match(/^[0-9]+$/) == null)
      return dispatch({ type: 'NOTIFY', payload: { error: 'Please enter a valid mobile number.' } })

    if (secondaryPhoneNumber.length > 0) {
      if (secondaryPhoneNumber.length != 10)
        return dispatch({ type: 'NOTIFY', payload: { error: ' Alternate Mobile number must be of 10 digits.' } })

      if (secondaryPhoneNumber.match(/^[0-9]+$/) == null)
        return dispatch({ type: 'NOTIFY', payload: { error: 'Please enter a valid Alternate mobile number.' } })
    }
    if (pincode.length != 6 || pincode[0] == 0 || pincode.match(/^[0-9]+$/) == null)
      return dispatch({ type: 'NOTIFY', payload: { error: 'Please enter a valid pincode.' } })

    setShowModal(true);
    // const finalConfirmation = confirmOrderModal(address, _State, city, pincode, mobile, secondaryPhoneNumber)


  }


  if (cart.length === 0)
    return (

      <Link href="/home">
        <div className="container" style={{ paddingTop: "74px" }}>
          <img className="img-responsive  w-100 my-10" src="/EmptyCart.png" alt="empty" />
        </div>
      </Link>

    )



  return (
    <div className="cart-page-div" >
      <Head>
        <title>Cart Page</title>
      </Head>

      <section className='main-cart-section '>
        <div className='Your-Cart-title' style={{ padding: "2%", paddingLeft: "4%" }}>
          <h1 style={{ fontSize: "500%", textTransform: "uppercase" }}><b>Your Cart</b></h1>
          <p className="total-items">
            Items in your Cart :  <span className="total-items-count text-info"> <b>{cart.length}</b> </span>
          </p>
        </div>

        <div className="cart-items" >

          <div className='cart-items-container'>

            {
              cart.map(item => (
                <CartItem key={item._id} item={item} dispatch={dispatch} cart={cart} totaldiscount={totaldiscount} setTotalDiscount={setTotalDiscount} />
              ))
            }

          </div>
        </div>

        <div className="cart-total">
          <h3 className="cart-total" >
            Cart Total : <span>Rs {total - totaldiscount + deliverycharge}/-</span>
          </h3>
        </div>

      </section>

      <div className='cart-form-faq-wrapper'>
        <div className='faq-div'>
          <div >
            <h4 style={{ padding: "1rem", borderBottom: "1px solid darkgray", marginBottom: "0" }}>F.A.Q</h4>
          </div>
          <div id="accordion">
            <div className="card faq-card">
              <div className="card-header" id="headingOne" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" style={{ cursor: "pointer" }}>
                <h5 className="mb-0 d-flex justify-content-between">
                  <div className="collapsed">
                    Q. Estimated Delivery Date.
                  </div>
                  <i className="fas fa-chevron-down mt-1"></i>
                </h5>
              </div>

              <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                <div className="card-body card-body-faq">
                  <ul>
                    <li>Within Kolkata: 2 – 3 business days from the day of dispatch  </li>
                    <li>Other areas in West Bengal: 2 – 5 business days from the day of dispatch </li>
                    <li>Metro cities: 4 – 5 business days from the day of dispatch</li>
                    <li>Rest of India: 5 – 7 business days from the day of dispatch</li>
                  </ul>
                  <p>* Estimated time of delivery may vary due to certain unavoidable circumstances (lockdown, natural disaster, etc.) </p>
                </div>
              </div>
            </div>
            <div className="card faq-card">
              <div className="card-header" id="headingTwo" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" style={{ cursor: "pointer" }}>
                <h5 className="mb-0 d-flex justify-content-between">
                  <div className="collapsed" >
                    Q. Order Change and Cancellation
                  </div>
                  <i className="fas fa-chevron-down mt-1"></i>
                </h5>
              </div>
              <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                <div className="card-body card-body-faq">
                  Order can be changed before it’s dispatched. Simply Email/ Facebook/ WhatsApp/ Call us along with your order ID and let us know your desired design.

                  Once paid, you won’t be able to cancel the order nor get any refund. However you can change your order. Order once dispatched can’t be cancelled or changed.


                </div>
              </div>
            </div>
            <div className="card faq-card">
              <div className="card-header" id="headingThree" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" style={{ cursor: "pointer" }}>
                <h5 className="mb-0 d-flex justify-content-between">
                  <div className="collapsed">
                    Online Payment
                  </div>
                  <i className="fas fa-chevron-down mt-1"></i>
                </h5>
              </div>
              <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                <div className="card-body card-body-faq">
                  <ul>
                    <li>100% Secured Online payments. </li>
                    <li>All major Credit and Debit cards accepted.</li>
                    <li>Pay through Net Banking. </li>
                    <li>Pay using mobile payments. </li>
                    <li>Pay using wallets. </li>
                    <li>Pay using UPI </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cart-form-wrapper">
          <div className="cart-form-div " style={{ fontSize: "150%" }} >

            <div className="text-uppercase" style={{ color: "black" }}>

              <form className="shipping-form" action="/action_page.php">
                <h2 ><b style={{ fontWeight: "bolder" }}>Cart Summary</b></h2>
                <hr />
                <div className='d-flex justify-content-between my-1' style={{ fontSize: "120%", textTransform: "capitalize" }}>
                  <b>Subtotal</b>
                  <b>Rs {total}</b>
                </div>
                {totaldiscount > 0 &&
                  <div className='d-flex justify-content-between text-danger' style={{ fontSize: "120%", textTransform: "capitalize" }}>
                    <b>Discount</b>
                    <b> - Rs {totaldiscount}</b>
                  </div>
                }
                <div className='d-flex justify-content-between my-1' style={{ fontSize: "120%", textTransform: "capitalize" }} >
                  <b>Shipping</b>
                  <b>Rs {deliverycharge}</b>
                </div>
                <hr />
                <div className='address-detail-div mb-2'>
                  <label htmlFor="address"> <b>Address</b> </label>
                  <input type="text" name="address" id="address"
                    className="form-control mb-2" value={address}
                    onChange={e => setAddress(e.target.value)} />

                  <label htmlFor="state"> <b>State</b> </label>
                  <select type="text" name="state" id="state"
                    className="form-control mb-2 text-uppercase" value={_State}
                    onChange={handleStateName}>
                    <option value="null" disabled>State</option>
                    {
                      states.map(state => (
                        <option className="text-uppercase" key={state.isoCode} value={state.name}>
                          {state.name}
                        </option>
                      ))
                    }
                  </select>

                  {cities.length > 1 && <label htmlFor="city"> <b>City</b> </label>}
                  {cities.length > 1 && <select type="text" name="city" id="city"
                    className="form-control mb-2 text-uppercase" value={city}
                    onChange={handleCityName} >

                    <option value="null" disabled>City</option>
                    {
                      cities.map(city => (
                        <option className="text-uppercase state-city-options" value={city.name}>
                          {city.name}
                        </option>
                      ))
                    }

                  </select>}


                  <label htmlFor="pincode"><b> PinCode </b></label>
                  <input type="number" name="pincode" id="pincode"
                    className="form-control mb-2 number-field" value={pincode}
                    onChange={e => setpinCode(e.target.value)}

                  />

                  <label htmlFor="mobile" >  <b>Mobile</b> </label>
                  <input type="number" name="mobile" id="mobile"
                    className="form-control mb-2 number-field" value={mobile}
                    onChange={e => setMobile(e.target.value)}

                  />

                  <label htmlFor="secondaryPhoneNumber" ><b>Alternate Mobile</b> </label>
                  <input type="number" name="secondaryPhoneNumber" id="secondaryPhoneNumber"
                    className="form-control mb-2 number-field" value={secondaryPhoneNumber}
                    onChange={e => setSecondaryPhoneNumber(e.target.value)}

                  />
                </div>
              </form>
            </div>
            <h3 className="" style={{ color: "black", textAlign: "right" }}>Grand Total: <span className="text" style={{ color: "black" }}>
              Rs {total - totaldiscount + deliverycharge}
            </span></h3>

            <div className='d-flex justify-content-end'>
              <Link href={auth.user ? '#!' : '/signin'}>
                <a className="btn confirm-form-button my-2" id="cart-buttons"
                  onClick={handleConfirmOrder} style={{ borderRadius: "0" }}>Confirm Order
                </a>
              </Link>
            </div>


          </div>

        </div >
      </div>




      {showModal &&
        <div className='cart-confirm-modal-backdrop'>
          <div className='modal-dialog modal-dialog' role='document' style={{ top: "78px" }}>
            <div className="ConfirmOrderModal modal-content">
              <div className='modal-header modal-header-confirmOrder' style={{ width: "100.1%" }}>
                <i className="mt-1 fas fa-map-marked-alt"></i>
                <h5 className='ml-3 modal-title text-capitalize'>
                  Confirm Your Address Details
                </h5>
                <button type="button" className="close close-modal-confirmOrder" aria-label="Close"><span aria-hidden="true" onClick={() => {
                  setShowModal(false)
                }}>×</span>
                </button>
              </div>
              <div className='modal-body' style={{ padding: "1.3rem", paddingTop: "0" }}>
                <div className='d-flex justify-content-center'>
                  <img
                    style={{ width: "100px", height: "100px", horizontalAlign: "middle !important" }}
                    src="/CazzLogo.png"
                    className=""
                    alt="" />
                </div>

                <div>
                  <div className='addressConfirm'>
                    <b>ADDRESS- </b> {address}
                  </div>
                  <div className='StateConfirm'>
                    <b>STATE- </b>{_State}
                  </div>
                  <div className='cityConfirm'>
                    <b>CITY- </b>{city}
                  </div>
                  <div className='pincodeConfirm'>
                    <b>PINCODE- </b>{pincode}
                  </div>
                  <div className='mobileConfirm'>
                    <b>MOBILE- </b>{mobile}
                  </div>
                  {secondaryPhoneNumber.length > 0 &&
                    <div className='AlternateMobileConfirm'>
                      <b>ALTERNATE MOBILE- </b>{secondaryPhoneNumber}
                    </div>}
                </div>


              </div>

              <div className="modalButtons modal-footer">
                <button className="btn ml-2 modal-cancel-button" onClick={handleCancelOrderModal} style={{ width: "46.5%" }}>
                  Cancel
                </button>

                <button className="btn btn-dark modal-confirm-button" onClick={handleConfirmOrderModal} style={{ width: "46.5%" }}>
                  Confirm Order
                </button>

              </div>

            </div>
          </div>
        </div>

      }
    </div >
  )
}

export default Cart

