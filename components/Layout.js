import React from 'react'
import NavBar from './NavBar'
import Notify from './Notify'
import Modal from './Modal'
import { useRouter } from 'next/router'
import Footer from './Footer'

function Layout({ children }) {
    const router = useRouter()

    return (
        <div >
            <div>{router.pathname != "/signin" && router.pathname != "/register" && <NavBar />}</div>

            <div className="">

                <Notify />
                <Modal />
                {children}
                <div>
                    {
                        router.pathname != "/signin" && router.pathname != "/register" && router.pathname != "/product/[id]" && <div>   <Footer /></div>
                    }
                </div>
            </div>
        </div>

    )
}

export default Layout
