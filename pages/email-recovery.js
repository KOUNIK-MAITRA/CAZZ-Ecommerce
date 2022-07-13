import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head'
import { DataContext } from '../store/GlobalState'
import { useRouter } from 'next/router'
import Link from 'next/link';
import jwt from 'jsonwebtoken'
import { getData, patchData } from "../utils/fetchData";
function emailrecovery() {

    const { state, dispatch } = useContext(DataContext)
    const [falseEmail, setfalseEmail] = useState(false);
    const [current_user_id, setCurrent_user_id] = useState("");
    const [noToken, setNoToken] = useState(true);
    const [UserPassword, setUserPassword] = useState({ password: '', cf_password: '' });
    const router = useRouter();
    const { atkn } = router.query;
    useEffect(async () => {
        if (!router.isReady) return;
        if (atkn) {
            setNoToken(false);
            var decoded;
            try {
                decoded = jwt.verify(atkn, process.env.ACCESS_TOKEN_SECRET);
                const res = await getData('/user/recoveryPassword?forget_password_token=' + atkn);
                if (res.status == 500) {
                    setfalseEmail(true);
                    return dispatch({ type: 'NOTIFY', payload: { error: "Something went wrong. Try again." } })
                }
                if (res.status == 400) {
                    setfalseEmail(true);
                    return dispatch({ type: 'NOTIFY', payload: { error: "This user email id does not exist." } })
                }
                if (res.status == 200) {
                    const { email, _id } = res.user;

                    if (email != decoded.email) {
                        setfalseEmail(true);
                        return dispatch({ type: 'NOTIFY', payload: { error: "Invalid Link. Try again." } })
                    }
                    else {
                        setCurrent_user_id(_id)
                    }
                }
            } catch (err) {
                setfalseEmail(true);
                return dispatch({ type: 'NOTIFY', payload: { error: "The link has been expired. Try again." } })
            }

        }
    }, [atkn]);
    const handleChangeInput = (e) => {
        const { value, name } = e.target
        setUserPassword({ ...UserPassword, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (UserPassword.password.length < 6) {
            return dispatch({ type: 'NOTIFY', payload: { error: "Password must be at least 6 characters long" } })
        }
        if (UserPassword.password !== UserPassword.cf_password) {
            return dispatch({ type: 'NOTIFY', payload: { error: "Confirm password did not match." } })
        }
        const res = await patchData('/user/recoveryPassword', { id: current_user_id, password: UserPassword.password });
        if (res.status == 500 || res.status == 400) {
            return dispatch({ type: 'NOTIFY', payload: { error: "Something went wrong. Try again." } })
        }
        if (res.status == 200) {
            dispatch({ type: 'NOTIFY', payload: { success: "Your password has been successfully updated." } })
            setTimeout(() => {
                router.push('/signin');
            }, 2000);
        }
    }

    return (
        <div style={{ height: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Head>
                <title>Email Recovery</title>
            </Head>
            {
                noToken &&
                (
                    <div style={{ textAlign: "center" }}>
                        <h2>Invalid link.</h2>
                    </div>
                )
            }
            {
                falseEmail &&
                (
                    <div style={{ textAlign: "center" }}>
                        <h2>Something went wrong. Try recovering again.</h2>
                        <Link href={`/forgot-password`}>
                            Click here to recover your password.
                        </Link>
                    </div>
                )
            }
            {
                (!noToken && !falseEmail) &&
                (
                    <div className="wrapper" id="wrapper" style={{ paddingTop: "78px" }}>

                        <div>
                            <img src="/CazzLogo.png" className="logo" alt="logo" style={{ width: "25%" }} />
                            <div className="outer-form">
                                <h1 style={{ textAlign: "center" }}>Reset your password</h1>
                                <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
                                    <div className="form-group details">
                                        <label htmlFor="exampleInputPassword1">Password</label>
                                        <input type="password" className="form-control" id="exampleInputPassword1"
                                            name="password" value={UserPassword.password} onChange={handleChangeInput} />
                                    </div>

                                    <div className="form-group details">
                                        <label htmlFor="exampleInputPassword2">Confirm Password</label>
                                        <input type="password" className="form-control" id="exampleInputPassword2"
                                            name="cf_password" value={UserPassword.cf_password} onChange={handleChangeInput} />
                                    </div>
                                    <button type="submit" className="btn login-btn my-5 ">Submit</button>
                                </form>
                            </div>
                        </div>

                    </div>
                )
            }
        </div>
    );
}

export default emailrecovery;
