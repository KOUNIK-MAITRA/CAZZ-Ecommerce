import React from 'react'
import Link from 'next/link'

const pricing = () => {
    return (
        <div className='footer-pages'>
            <div className="my-5 d-flex justify-content-around info-title-div">
                <div className=''>
                    <h1>
                        <b> PRICING </b>
                    </h1>
                    <div>
                        <span className='d-flex justify-content-around home-link-info-page'>
                            <div>
                                <Link href="./home" >
                                    <a> Home </a>
                                </Link>
                                / Pricing
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <div className='container my-3' style={{ paddingBottom: "4%" }}>


                <div className='my-3'>
                    Prices for items may change from time to time without notice. However, these changes will not affect orders that have already been placed/dispatched. The price of an item includes GST (or similar sales tax) at the prevailing rate for which we are responsible as a seller. Please note that the prices listed on the website are only applicable for items purchased on the website and not through any other source.
                </div>


            </div>
        </div>
    )
};

export default pricing;
