import React from 'react'
import Link from 'next/link'
const delivery = () => {
    return (
        <div className='footer-pages'>
            <div className="my-5 d-flex justify-content-around info-title-div">
                <div className=''>
                    <h1>
                        <b>DELIVERY</b>
                    </h1>
                    <div>
                        <span className='d-flex justify-content-around home-link-info-page'>
                            <div>
                                <Link href="./home" >
                                    <a> Home </a>
                                </Link>
                                / Delivery
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <div className='container my-3' style={{ paddingBottom: "4%" }}>
                <b> Q. When will I receive my order ?</b>

                <div className='my-3'>
                    <p>Within Kolkata delivered in ( 2– 3 business days from the day of dispatch ).</p>
                    <p>Other areas in West Bengal ( 2 – 5 business days from the day of dispatch ).</p>
                    <p> Metro cities ( 4 – 5 business days from the day of dispatch ).</p>
                    <p>Rest of India delivered in ( 5 – 7 business days from the day of dispatch ).</p>
                </div>

                <div className='my-3'>
                    <b> Q. Through which courier will I receive my order ?</b>
                </div>

                <div className='my-3'>
                    A. If you order is via COD (cash on delivery) then you can expect to receive it through Ekart | Delhivery | Ecom Express | FedEx |Expressbees . If you order is Prepaid then you can expect to receive it through FedEx | Delhivery | Ekart | Ecom Express | Indiapost | Bluedart | DTDC.
                </div>
            </div>
        </div>
    )
}

export default delivery
