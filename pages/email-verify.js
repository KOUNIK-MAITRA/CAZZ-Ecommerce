import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData'
import Link from 'next/link'
import Head from 'next/head'
function email_verify() {
    const { state, dispatch } = useContext(DataContext)
    const router = useRouter();
    const [falseEmail, setfalseEmail] = useState(false);
    const [existingUser, setexistingUser] = useState(false);
    const [noToken, setNoToken] = useState(true);
    const query = router.query;
    const { atkn } = query;
    useEffect(async () => {
        if (!router.isReady) return;
        if (atkn) {
            setNoToken(false);
            var decoded;
            try {
                decoded = jwt.verify(atkn, process.env.ACCESS_TOKEN_SECRET);
            } catch (err) {
                setfalseEmail(true);
                return dispatch({ type: 'NOTIFY', payload: { error: "The link has been expired. Try again." } })
            }
            dispatch({ type: 'NOTIFY', payload: { loading: true } })

            const res = await postData('auth/register', decoded)

            if (res.err) {
                if (res.err == "This email already exists.") {
                    setexistingUser(true);
                }
                else {
                    setfalseEmail(true);
                }
                return dispatch({ type: 'NOTIFY', payload: { info: res.err } })
            }

            else {
                dispatch({ type: 'NOTIFY', payload: { loading: false } })
                dispatch({ type: 'NOTIFY', payload: { success: "Your account has been successfully registered." } })
                setTimeout(() => {
                    router.push('/signin');
                }, 2000);

            }
        }
        // else{
        //     setNoToken(true);
        // }
    }, [atkn]);

    return (
        <div style={{ height: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Head>
                <title>Verify Email</title>
            </Head>
            {
                noToken &&
                (
                    <div style={{ textAlign: "center" }}>
                        <h2>Redirecting to login...</h2>
                        <p>Note: if you are not redirected then the link is invalid.</p>
                    </div>
                )
            }
            {
                falseEmail &&
                (
                    <div style={{ textAlign: "center" }}>
                        <h2>Something went wrong. Please register again.</h2>
                        <Link href={`/register`}>
                            Click here to register
                        </Link>
                    </div>
                )
            }
            {
                existingUser &&
                (
                    <div style={{ textAlign: "center" }}>
                        <h2>Your email is already registered with us.</h2>
                        <Link href={`/forgot-password`}>
                            Forgot password? Click here
                        </Link>
                        <div>
                            Or
                        </div>
                        <Link href={`/signin`}>
                            Login here.
                        </Link>
                    </div>
                )
            }
        </div>
    )
        ;
}

export default email_verify;
