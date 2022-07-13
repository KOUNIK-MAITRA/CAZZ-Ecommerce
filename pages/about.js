import React from 'react'
import Link from 'next/link'
const about = () => {
    return (
        <div className='footer-pages'>
            <div className="mt-3 d-flex justify-content-around info-title-div">
                <div className=''>
                    <h1>
                        <h2><b>ABOUT US</b></h2>
                    </h1>
                    <div>
                        <span className='d-flex justify-content-around home-link-info-page'>
                            <div>
                                <Link href="./home" >
                                    <a> Home </a>
                                </Link>
                                / About Us
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            <div className='container' style={{ width: "100%" }}>

                <div className="AboutUs-info">

                    <div className='my-2'>
                        <p>
                            Cazz is an initiative by a group of youngsters with big dreams in their eyes, of creating an
                            impact and bringing a change. We bring to you the best of artistic graphic t-shirts. At Cazz
                            we work closely with artists. In almost 6 months of our inception, many independent
                            artists from India and Bangladesh have integrated with us.
                            Our primary goals are:
                        </p>
                    </div>

                    <div className='my-2'>
                        <h2><b>Providing appropriate credit to our artists</b></h2>
                        <p>
                            We communicate our thoughts to the artists who personify these thoughts through their
                            creations which reaches you through our products. We recognise their hard work on our
                            social media handles by giving appropriate credit along with providing them their
                            deserved compensation.
                        </p>
                    </div>

                    <div className='my-2'>
                        <h2><b>
                            Delivering Art works to common people
                        </b></h2>
                        <p>
                            Art is conventionally seen as a luxury, only feasible to upper class of the society. Many
                            artists remain unrecognised due to this. On the other hand, common people cannot
                            afford expensive pieces of art. We wish to bridge this gap between art and common
                            people so that art is no longer a decorative luxury, but a medium to convey a message
                            that becomes a part of our daily lives.
                        </p>
                    </div>

                    <div className='my-2' style={{ paddingBottom: "4%" }}>
                        <h2><b>
                            5% of our revenue goes towards the upliftment of underprivileged children
                        </b></h2>
                        <p>
                            We aim to spend a part of our revenue for helping the underprivileged children who
                            cannot afford decent clothing. Our aim is to become a medium for our customers who
                            can bring a change by supporting independent artists and helping those who are in
                            need. We also aim to provide employments to a large number of people in future. All
                            we need is your love and support to move forward.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default about
