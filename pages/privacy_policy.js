import React from 'react'
import Link from 'next/link'
const privacy_policy = () => {
    return (
        <div className='footer-pages'>
            <div className="my-5 d-flex justify-content-around info-title-div">
                <div className=''>
                    <h1>
                        <b> PRIVACY POLICY</b>
                    </h1>
                    <div>
                        <span className='d-flex justify-content-around home-link-info-page'>
                            <div>
                                <Link href="./home" >
                                    <a> Home </a>
                                </Link>
                                / Privacy Policy
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <div className='container my-3' style={{ paddingBottom: "4%" }}>
                Cazz values the privacy of information pertaining to its associates. We do not use or disclose information about your individual visits to our website, or any information that you may give us, such as your name, address, email address or telephone number,etc to any outside sources. Your details are safe with us. The data that collected from our customers are only used for sending out promotional messages or products/website related updates. Our website is SSL Certificate Secured which gives you a spam free user experience.

                <div className='my-3'>
                    Prepaid orders cannot be cancelled, incase of cancellation there will be no refund initiated.
                </div>

                <div className='my-3'>
                    We may use contact details shared by you, to contact you via email, phone, or SMS to send details regarding your purchase/order, ongoing offers, new products or other such information.
                </div>

                <div className='my-3'>
                    <div className='my-3'>
                        Pricing :
                    </div>
                    Prices for items may change from time to time without notice. However, these changes will not affect orders that have already been placed/dispatched. The price of an item includes GST (or similar sales tax) at the prevailing rate for which we are responsible as a seller. Please note that the prices listed on the website are only applicable for items purchased on the website and not through any other source.
                </div>
            </div>
        </div>
    )
}

export default privacy_policy
