import React from 'react'
import Link from 'next/link'
const Footer = () => {
    return (
        <div className='footer-wrapper '>


            <div className="footer-content row">

                <div className='logo-div container col-lg-3 col-xs-12 px-10'>

                    <div >
                        <img src="/footerLogo.png" className="Cazz_logo_footer mx-1" alt="" style={{ width: "fit-content" }} />
                    </div>



                </div>


                <div className="company col-lg-3 col-xs-12 px-10">
                    <h4 className="footer-info-headings">COMPANY</h4>
                    <ul className="footer-info-links">
                        <p >
                            <Link href="/terms_and_conditions ">
                                <a >Terms and Conditions </a>
                            </Link>
                        </p>
                        <p>
                            <Link href="/contact_us">
                                <a >Contact Us </a>
                            </Link>
                        </p>
                        <p>
                            <Link href="/privacy_policy">
                                <a >Privacy Policy </a>
                            </Link>
                        </p>

                        <p>
                            <Link href="/about">
                                <a >About Us </a>
                            </Link>
                        </p>

                    </ul>
                </div>
                <div className="information col-lg-3 col-xs-12 px-10">
                    <h4 className="footer-info-headings"> INFORMATION </h4>
                    <ul className="footer-info-links">

                        <p>
                            <Link href="/pricing">
                                <a >Pricing</a>
                            </Link>
                        </p>

                        <p>
                            <Link href="/Return_and_Refund">
                                <a >Cancellation/Refund</a>
                            </Link>
                        </p>

                        <p>
                            <Link href="/delivery">
                                <a >Delivery </a>
                            </Link>
                        </p>
                    </ul>
                </div>

                <div className="socials col-lg-3 col-xs-12 px-5">
                    <h4 className="footer-info-headings">FIND US AT</h4>
                    <ul className="footer-info-links">
                        <span className='mx-2'>
                            <a href="https://www.instagram.com/cazz_designs/ " target="_blank" >
                                <i className="fab fa-instagram social-icon"></i>
                            </a>
                        </span>

                        <span className='mx-2'>
                            <a href="https://www.facebook.com/cazz.designs " target="_blank">
                                <i className="fab fa-facebook-square social-icon"></i>
                            </a>
                        </span>

                        <span className='mx-2'>
                            <a href="mailto:official@cazz.in" target="_blank">
                                <i className="fas fa-envelope social-icon"></i>
                            </a>
                        </span>
                    </ul>
                </div>

            </div>


            <div className="min-footer">
                <div className="min-footer-text">
                    © CAZZ, All Rights Reserved
                    <p>
                        Website by Kounik Maitra and Sayak China
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Footer
