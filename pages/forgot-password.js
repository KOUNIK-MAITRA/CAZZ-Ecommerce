import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head'
import { DataContext } from '../store/GlobalState'
import { useRouter } from 'next/router'
import { createAccessToken } from '../utils/generateToken'
import { putData } from "../utils/fetchData";
function forgotpassword() {
  const [email, setEmail] = useState("");
  const { state, dispatch } = useContext(DataContext)
  const router = useRouter()

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (!email) {
      return dispatch({ type: 'NOTIFY', payload: { error: "Please provide us with your user email." } })
    }

    if (!validateEmail(email)) {
      return dispatch({ type: 'NOTIFY', payload: { error: "Please provide a valid email." } })
    }
    const access_token = createAccessToken({ email: email });
    const res = await putData('user/recoveryPassword', { email }, access_token)
    if (res.status == 500) {
      return dispatch({ type: 'NOTIFY', payload: { error: "Something went wrong. Try again." } })
    }
    if (res.status == 400) {
      return dispatch({ type: 'NOTIFY', payload: { error: "This user email id does not exist." } })
    }
    if (res.status == 200) {
      const email_recovery_link = `${process.env.BASE_URL}/email-recovery?atkn=${access_token}&ref=signin`;
      const emailInfo = {
        email: email,
        templateId: 'd-0817128001e6403e8469aebbe267913b',
        dynamic_template_data: {
          subject: 'Reset-Password',
          verifyUrl: `${email_recovery_link}`
        }
      }

      fetch('/api/mail/sendgrid-mail', {
        method: 'post',
        body: JSON.stringify(emailInfo)
      }).then((res) => {
        if (res.status == 200) {
          dispatch({ type: 'NOTIFY', payload: { info: "Check your email to activate your account within 15 minutes." } })
          setTimeout(() => {
            router.push('/email-wait')
          }, 2000);
        }
      }).catch(() => {
        dispatch({ type: 'NOTIFY', payload: { error: 'Something went wrong while sending you the recovery link. Try again.' } })
      })
    }

  }

  const handleChangeInput = (e) => {
    const { value } = e.target
    setEmail(value);
  }
  return (
    <div >
      <Head>
        <title>Forgot Password</title>
      </Head>
      <div className="wrapper" id="wrapper" style={{ paddingTop: "78px" }}>

        <div className="" >
          <img src="/CazzLogo.png" className="logo" alt="logo" style={{ width: "25%" }} />
          <div className="outer-form">
            <h1 style={{ textAlign: "center" }}>Forgot your password?</h1>
            <p style={{ textAlign: "center" }}>Dont't worry, we will help you to recover it.</p>
            <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
              <div className="form-group details">
                <label htmlFor="exampleInputEmail1">Enter your email address</label>
                <input type="email" className="form-control" aria-describedby="emailHelp" id="exampleInputEmail1"
                  name="email" value={email} onChange={handleChangeInput} />
              </div>
              <button type="submit" className="btn login-btn my-5">Submit</button>
            </form>
          </div>
        </div>

      </div>
    </div >);
}

export default forgotpassword;
