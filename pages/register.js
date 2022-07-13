import Head from 'next/head'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import valid from '../utils/valid'
import { DataContext } from '../store/GlobalState'
import { useRouter } from 'next/router'
import { createAccessToken } from '../utils/generateToken'

const Register = () => {
  const initialState = { name: '', email: '', password: '', cf_password: '' }
  const [userData, setUserData] = useState(initialState)
  const { name, email, password, cf_password } = userData

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  const router = useRouter()

  const handleChangeInput = e => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    dispatch({ type: 'NOTIFY', payload: {} })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errMsg = valid(name, email, password, cf_password)
    if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } })
    const access_token = createAccessToken(userData);

    const email_activation_link = `${process.env.BASE_URL}/email-verify?atkn=${access_token}&ref=register`;
    const emailInfo = {
      name: userData.name,
      email: userData.email,
      templateId: 'd-0c81af9e30364fb9a37451f8d12f7ca4',
      dynamic_template_data: {
        subject: 'Email-Verification',
        verifyUrl: `${email_activation_link}`
      }
      // html: ` <h3><strong>Click on the following link to activate your account</strong></h3>
      //         <a href="${email_activation_link}">${email_activation_link}</a>
      //       `
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
      dispatch({ type: 'NOTIFY', payload: { error: 'Something went wrong while creating your account. Try again.' } })
    })
  }

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/")
  }, [auth])

  return (
    <div className="wrapper">
      <Head>
        <title>Register Page</title>
      </Head>
      <div className="wrapper" id="wrapper">


        <div className="second-register-div" >

          <a >
            <img src="/CazzLogoGif.gif" className="register-logo" alt="" />
          </a>


          <div className="outer-form">

            <h1 style={{ textAlign: "center" }}> <b>Create Account</b> </h1>

            <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
              <div className="form-group details">
                {/* <label htmlFor="name">Name</label> */}
                <input type="text" className="form-control login-signup-input" id="name"
                  name="name" value={name} onChange={handleChangeInput} placeholder='Name' />
              </div>

              <div className="form-group details">
                {/* <label htmlFor="exampleInputEmail1">Email address</label> */}
                <input type="email" className="form-control login-signup-input" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Email'
                  name="email" value={email} onChange={handleChangeInput} />

              </div>

              <div className="form-group details">
                {/* <label htmlFor="exampleInputPassword1">Password</label> */}
                <input type="password" className="form-control login-signup-input" id="exampleInputPassword1"
                  name="password" value={password} onChange={handleChangeInput} placeholder='Password' />
              </div>

              <div className="form-group details">
                {/* <label htmlFor="exampleInputPassword2">Confirm Password</label> */}
                <input type="password" className="form-control login-signup-input" id="exampleInputPassword2"
                  name="cf_password" value={cf_password} onChange={handleChangeInput} placeholder='Confirm Password' />
              </div>

              <button type="submit" className="btn Register-btn ">Register</button>
              <p className=" text-center my-5 " >
                Already have an account? <Link href="/signin"><a className='responsiveLink'>Login Now</a></Link>
              </p>
            </form>
          </div>
        </div>
        <div className="first-register-div">
          <div className="signin">
            <h1>Welcome to our family!</h1>

            <button className="btn loginNow-btn my-2">
              <Link href="/signin"><a>Login Now</a></Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register