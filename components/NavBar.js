import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import filterSearch from '../utils/filterSearch'
import { DataContext } from '../store/GlobalState'
import Cookie from 'js-cookie'

function NavBar() {
    const [search, setSearch] = useState('')
    const router = useRouter()
    const { state, dispatch } = useContext(DataContext)
    const { auth, cart } = state

    const [category, setCategory] = useState('')

    const { categories } = state




    const handleCategory = (e) => {
        handleCloseNavbar();
        router.push(`/home?category=${e.target.value}`)
        setCategory(e.target.value)
        filterSearch({ router, category: e.target.value })
    }

    const isActive = (r) => {
        if (r === router.pathname) {
            return " active"
        } else {
            return ""
        }
    }

    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: 'api/auth/accessToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {} })
        dispatch({ type: 'NOTIFY', payload: { success: 'Logged out!' } })
        handleCloseNavbar();
        return router.push('/')
    }

    const adminRouter = () => {
        return (
            <>
                <Link href="/users">
                    <a className="dropdown-item">Manage Users</a>
                </Link>
                <Link href="/create">
                    <a className="dropdown-item">Upload Products</a>
                </Link>
                <Link href="/categories">
                    <a className="dropdown-item">Manage Categories</a>
                </Link>
                <Link href="/coupons">
                    <a className="dropdown-item">Manage Coupon Codes</a>
                </Link>
            </>
        )
    }

    const loggedRouter = () => {
        return (
            <div className="nav-item" style={{ paddingTop: "7px" }}>

                <div className='dropdown'>

                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img src={auth.user.avatar} alt={auth.user.avatar}
                            style={{
                                borderRadius: '50%', width: '30px', height: '30px',
                                transform: 'translateY(-3px)', marginRight: '3px'
                            }} /> <b className="dropbtn navbar-tshirts"> {auth.user.name} </b>
                    </a>



                    <div className="dropdown-content" aria-labelledby="navbarDropdownMenuLink" style={{ cursor: "pointer" }} >

                        <Link href="/profile">
                            <option className="profile-item" onClick={handleCloseNavbar}>Profile</option>
                        </Link>

                        {
                            auth.user.role === 'admin' && adminRouter()
                        }

                        <option className="logout-item" onClick={handleLogout}>Logout</option>
                    </div>

                </div>

            </div>

        )
    }
    useEffect(() => {
        filterSearch({ router, search: search ? search.toLowerCase() : 'all' })
    }, [search])

    const handleCloseNavbar = () => {
        setTimeout(() => {
            if (document.getElementById("navbarNavDropdown"))
                document.getElementById("navbarNavDropdown").classList.remove("show");
        }, 300);

    }
    return (
        <>
            <nav className="  navbar navbar-expand-lg  nav-background " style={{ width: "100%" }}>
                <Link href="/home">
                    <a className="">
                        <img
                            style={{ verticalAlign: "middle !important" }}
                            src="/CazzLogoGif.gif"
                            width="auto"
                            height="50"
                            className="d-inline-block align-top"
                            alt="" />
                    </a>

                </Link>
                <Link href="/home">
                    <span className='CAZZ-title' style={{ cursor: "pointer" }}>CAZZ</span>
                </Link>



                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >


                    <span className="dark-blue-text">
                        <i
                            className="fas fa-bars fa-1x">
                        </i>
                    </span>


                </button>

                <div className="collapse navbar-collapse  justify-content-end" id="navbarNavDropdown">
                    <ul className="navbar-nav p-1">

                        {router.pathname === "/home" && <li>
                            <form className="searchbar" style={{ paddingTop: "15px" }}>
                                <input type="search"
                                    placeholder="Search any product"
                                    name="search"
                                    className="searchbar-input input-field mx-2"
                                    value={search.toLowerCase()}
                                    onChange={e => setSearch(e.target.value)} />
                                <span className="searchbar-icon">
                                    <i className="fa fa-search icon" aria-hidden="true"></i>
                                </span>

                            </form>
                        </li>
                        }
                        <li className='navbar-home navbar-items mx-3'>
                            <Link href="/home">
                                <span style={{ cursor: "pointer" }} onClick={handleCloseNavbar}>HOME</span>
                            </Link>
                        </li>
                        {
                            (router.pathname !== "/signin" && router.pathname !== "/register") &&
                            <li className='navbar-items mx-3'>
                                <div className="dropdown">
                                    <b className="dropbtn navbar-tshirts" style={{ cursor: "pointer" }}>
                                        T-SHIRTS
                                    </b>

                                    <div className="dropdown-content" style={{ cursor: "pointer" }}>
                                        <option className="category-item mx-1"
                                            value="all"
                                            onClick={handleCategory} >ALL PRODUCTS</option>

                                        {
                                            categories.map(item => (
                                                <option className="category-item mx-1 my-1 text-uppercase"
                                                    key={item._id}
                                                    value={item._id}
                                                    onClick={handleCategory} >{item.name}</option>
                                            ))
                                        }

                                    </div>

                                </div>

                            </li>
                        }


                        <li className="nav-item " style={{ paddingTop: "8px" }}>
                            {router.pathname !== "/" && router.pathname !== "/signin" && router.pathname !== "/register" && <Link href="/cart" >
                                <a className={"nav-link navbar-cart-icon" + isActive('/cart')} onClick={handleCloseNavbar}>
                                    {/* shopping cart icon */}
                                    <i className="fas fa-shopping-cart position-relative" aria-hidden="true" onClick={handleCloseNavbar}>
                                        <span className="position-absolute"

                                            style={{
                                                padding: '3px 6px',
                                                background: 'rgb(236 50 20 / 76%)',
                                                borderRadius: '50%',
                                                top: '-10px',
                                                right: '-10px',
                                                color: 'white',
                                                fontSize: '14px'
                                            }}>
                                            {cart.length}
                                        </span>
                                    </i>
                                    <b onClick={handleCloseNavbar}>
                                        Cart
                                    </b>
                                </a>
                            </Link>}
                        </li>


                        {
                            (Object.keys(auth).length === 0)
                                ? (router.pathname !== "/signin" && router.pathname !== "/register") &&
                                <li className="nav-item" style={{ paddingTop: "8px" }}>
                                    <Link href="/signin" >
                                        <b>
                                            <a className={"nav-link" + isActive('/signin')} style={{ cursor: "pointer" }}
                                                onClick={handleCloseNavbar}>

                                                {/* user icon */}
                                                <i className="fas fa-user" aria-hidden="true" ></i> Sign in

                                            </a>
                                        </b>
                                    </Link>
                                </li>
                                : loggedRouter()
                        }
                    </ul>

                </div>
            </nav>

        </>
    )
}

export default NavBar
