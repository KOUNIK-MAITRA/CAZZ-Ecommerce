import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import Link from 'next/link'
const contact_us = () => {
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    let userEmail;
    if (auth.user)
        userEmail = auth.user.email;



    const handleSubmit = () => {

        if (!name || !subject || !message)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Please add all feilds.' } })
        else {
            const emailInfo = {

                name: name,
                email: userEmail,
                subject: subject,
                message: message,

            }

            fetch('/api/mail/mailgun-mail', {
                method: 'post',
                body: JSON.stringify(emailInfo)
            }).then((res) => {
                if (res.status == 200) {
                    dispatch({ type: 'NOTIFY', payload: { success: 'Your message has been sent to Cazz. Someone from our team will contact you shortly.' } })
                }
            }).catch(() => {
                dispatch({ type: 'NOTIFY', payload: { error: 'Something went wrong.' } })
            })
        }

    }
    return (
        <div className='footer-pages contact-us-background'>

            <div className='contact-us-content mx-5 my-5'>
                <div className='mt-3'>
                    <h1 style={{ textAlign: "center", color: "#333" }}><b style={{ paddingBottom: "1rem" }}>GET IN TOUCH</b></h1>

                </div>

                <div className="contact-us-wrapper">
                    <div className="contact-us-info">
                        <div className='contact-us-detail-icons'>
                            <span>
                                <i className="fas fa-phone"></i>
                            </span>
                            <span className='pl-3'>
                                6289536428
                            </span>
                        </div>
                        <div className='contact-us-detail-icons'>
                            <span>
                                <i className="fas fa-mobile-alt"></i>
                            </span>
                            <span className='pl-3'>
                                7633976205
                            </span>
                        </div>

                        <div className='contact-us-detail-icons'>
                            <span>
                                <i className="fas fa-envelope-open-text"></i>
                            </span>
                            <span className='pl-3'>
                                official@cazz.in
                            </span>
                        </div>

                        <div className="contact-us-social-icons" style={{ fontSize: "200%" }}>
                            <span className='mr-2'>
                                <a href="https://www.instagram.com/cazz_designs/ " target="_blank" >
                                    <i className="fab fa-instagram "></i>
                                </a>
                            </span>

                            <span className='mr-2'>
                                <a href="https://www.facebook.com/cazz.designs " target="_blank">
                                    <i className="fab fa-facebook-square "></i>
                                </a>
                            </span>

                            <span className='mr-2'>
                                <a href="mailto:official@cazz.in" target="_blank">
                                    <i className="fas fa-envelope "></i>
                                </a>
                            </span>

                        </div>

                    </div>
                    <div className='contactUs-form-div'>
                        <form>
                            <div className="form-group" >
                                <label htmlFor="exampleInputEmail1">Name</label>
                                <input type="text" className="form-control contactform-input-field" id="FirstName" value={name}
                                    aria-describedby="emailHelp" placeholder="Name" onChange={(e) => { setName(e.target.value) }} />

                            </div>
                            <div className="form-group" >
                                <label htmlFor="exampleInputEmail1">Subject</label>
                                <input type="text" className="form-control contactform-input-field" id="FirstName" value={subject}
                                    aria-describedby="emailHelp" placeholder="Subject"
                                    onChange={(e) => { setSubject(e.target.value) }}
                                />

                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleFormControlTextarea1">Message</label>
                                <textarea className="form-control contactform-input-field contact-us-message"
                                    value={message}
                                    id="exampleFormControlTextarea1" rows="3" placeholder='Message' onChange={(e) => { setMessage(e.target.value) }}></textarea>
                            </div>

                            <Link href={auth.user ? '#!' : '/signin'}>
                                <button type="submit" className="btn contact-us-submit-button" onClick={handleSubmit}>Submit</button>
                            </Link>

                        </form>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default contact_us
