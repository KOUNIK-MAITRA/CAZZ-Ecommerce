import Head from 'next/head'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData'
import Cookie from 'js-cookie'
import { useRouter } from 'next/router'


const Signin = () => {
  const initialState = { email: '', password: '' }
  const [userData, setUserData] = useState(initialState)
  const { email, password } = userData

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
    dispatch({ type: 'NOTIFY', payload: { loading: true } })
    const res = await postData('auth/login', userData)

    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
    dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

    dispatch({
      type: 'AUTH', payload: {
        token: res.access_token,
        user: res.user
      }
    })

    Cookie.set('refreshtoken', res.refresh_token, {
      path: 'api/auth/accessToken',
      expires: 7
    })

    localStorage.setItem('firstLogin', true)
  }

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/home")
  }, [auth])

  return (
    <div >
      <Head>
        <title>Sign in Page</title>
      </Head>
      <div className="wrapper" id="wrapper">

        <div className="second-div" >
          <div className="register">
            <h1 className="welcome-back mx-5" > Welcome Back</h1>
            <p >New Here?</p>
            <button className="btn register-btn my-2">
              <Link id="register-now" href="/register" ><a>Register Now</a></Link>
            </button>
          </div>
        </div>

        <div className="first-div" >

          <a >
            <img src="/CazzLogoGif.gif" className="logo" alt="" />
          </a>

          <div className=" outer-form">
            <h1 style={{ textAlign: "center" }}> <b>Sign in to Cazz</b> </h1>

            <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
              <div className="form-group details">
                {/* <label htmlFor="exampleInputEmail1">Email address</label> */}
                <input type="email" className="form-control login-signup-input" id="exampleInputEmail1" aria-describedby="emailHelp"
                  name="email" value={email} onChange={handleChangeInput} placeholder='Email' />

              </div>

              <div className="form-group details">
                {/* <label htmlFor="exampleInputPassword1">Password</label> */}
                <input type="password" className="form-control login-signup-input" id="exampleInputPassword1"
                  name="password" value={password} onChange={handleChangeInput} placeholder='Password' />
              </div>
              <p className="my-2 text-center forgot-password">
                <Link href="/forgot-password"><a >Forgot Password ?</a></Link>
              </p>

              <button type="submit" className="btn login-btn my-5 ">Login</button>

              <p className="text-center responsive-login-link">
                New here? <Link id="register-now" href="/register" ><a className="responsiveLink">Register Now </a></Link>
              </p>

            </form>
          </div>
        </div>

      </div>
    </div >
  )
}

export default Signin