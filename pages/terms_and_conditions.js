import React from 'react'
import Link from 'next/link'

const terms_and_conditions = () => {
    return (
        <div className='footer-pages'>
            <div className="my-5 d-flex justify-content-around info-title-div">
                <div className=''>
                    <h1>
                        <b> TERMS AND CONDITIONS</b>
                    </h1>
                    <div>
                        <span className='d-flex justify-content-around home-link-info-page'>
                            <div>
                                <Link href="./home" >
                                    <a> Home </a>
                                </Link>
                                / Terms and Condition
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <div className='container my-3' style={{ paddingBottom: "4%" }}>
                Access to and use of Cazz and the products and service available through the website are subject to the following terms, conditions and notices (“Terms of Service”). By browsing through these Terms of Service and using the services provided by our website (www.cazz.com), you agree to all Terms of Service along with the Privacy Policy on our website, which may be updated by us from time to time. Please check this page regularly to take notice of any changes we may have made to the Terms of Service. We reserve the right to review and withdraw or amend the services without notice. We will not be liable if for any reason this Website is unavailable at any time or for any period. From time to time, we may restrict access to some parts or this entire Website.

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

export default terms_and_conditions

