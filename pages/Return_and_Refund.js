import React from 'react'
import Link from 'next/link'

const Return_and_Refund = () => {

    return (
        <div className='footer-pages'>
            <div className="my-5 d-flex justify-content-around info-title-div">
                <div className=''>
                    <h1>
                        <b>Cancellation/Refund</b>
                    </h1>
                    <div>
                        <span className='d-flex justify-content-around home-link-info-page'>
                            <div>
                                <Link href="./home" >
                                    <a> Home </a>
                                </Link>
                                / Cancellation and Refund
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <div className='container my-3' style={{ paddingBottom: "4%" }}>
                *We donot have any return policy*
                <div className='my-3'>
                    <p>Q. What if there is a size problem and you want to exchange it?</p>
                    <br />
                    <p> A. Cazz provides you one-time free size exchange services. Contact us as soon as possible via Email/ Facebook/ WhatsApp or simple Call us. Although we recommend you to check our Size Guide and clear any size related issues before purchasing. Kindly read the following paragraph for detailed understanding of the processes.</p>
                </div>

                <div className='my-3'>
                    <p> You can do either of these following processes :</p>
                    <br />
                    You can parcel the t-shirt to our E-Hub (exchange hub) through any courier services of your choice. Kindly keep the product intact and unused, we will not exchange any used products. Cazz can arrange a pickup which is chargeable (depends on pincodes). Once we receive your parcel, a verification will be done and thereafter the new product/new desired size will be shipped with your consent. We donot accept any (To-Pay) orders, so kindly donot send any orders on to-pay basis. (Cazz exchanges are also subject to availability. If the new required size is not available then you can choose any other design on available sizes.)
                    <br />

                    <p> You can also directly visit our E-Hub (exchange hub) to exchange the product personally, exchanges will be done on spot. Kindly keep the product intact and unused, we will not exchange any used products. Also it is very important to note that if you are planning to visit our exchange e-hub, you would need to inform us a day prior via Phone/ WhatsApp only. We will guide you through the process with ease. E-Hub (exchange hub) Address is given bellow. (Cazz exchanges are also subject to availability. If the new required size is not available then you can choose any other design on available sizes.) Hub is closed on Sundays and major holidays.</p>
                </div>

                <p>  * Kindly note that the Exchange will be done only if we receive the product within 10 days from the date of delivery.

                </p>
                <br />

                <p>
                    E-Hub (exchange hub) Address :
                    136,Banamalipur Barasat , Kolkata 700124, W.B

                </p>

                <p>
                    Phone: +91 6289536428
                </p>

                <p>
                    *Kindly note that our exchange hub is not an outlet therefore it is not open all the time, kindly call/ WhatsApp us to fix a date for the exchange process.</p>
                <p>
                    Q. What if you receive a defected product, how will you get an exchange in such cases ?
                </p>

                <p>

                    A. It’s highly unlikely as we check the products before dispatching, but just in case you do receive one, then call us as soon as possible. Cazz will exchange your product with ease. You can also WhatsApp us on our helpdesk number 7059203643. Our associate will get in touch with you. You can also directly contact us on Facebook reporting such issues.
                </p>

                <p>
                    Q. What if the new size for the exchange isn’t available ?
                </p>

                <p> A. Cazz exchanges are also subject to availability. If the new required size isn’t available then you can choose any other design on available sizes.</p>

            </div>
        </div>
    )
};

export default Return_and_Refund;
