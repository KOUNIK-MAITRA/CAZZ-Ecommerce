import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import InfiniteScroll from 'react-infinite-scroll-component';
import { getData } from '../utils/fetchData'
import ProductItem from '../components/product/ProductItem'
import filterSearch from '../utils/filterSearch'
import { useRouter } from 'next/router'
import Filter from '../components/Filter'
import Loading from '../components/Loading'


const Home = (props) => {

    const [products, setProducts] = useState(props.products)

    const [isCheck, setIsCheck] = useState(false)
    const [page, setPage] = useState(1)
    const router = useRouter()
    const [currentCategory, setCurrentCategory] = useState("Cazz Showcase");
    const { state, dispatch } = useContext(DataContext)
    const { auth, categories } = state
    const [sort, setSort] = useState('Latest Designs')


    useEffect(() => {
        setProducts(props.products)
    }, [props.products])

    useEffect(() => {
        if (Object.keys(router.query).length === 0) setPage(1)
    }, [router.query])

    const handleCheck = (id) => {
        products.forEach(product => {
            if (product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const handleCheckALL = () => {
        products.forEach(product => product.checked = !isCheck)
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const handleDeleteAll = () => {
        let deleteArr = [];
        products.forEach(product => {
            if (product.checked) {
                deleteArr.push({
                    data: '',
                    id: product._id,
                    title: 'Delete all selected products?',
                    type: 'DELETE_PRODUCT'
                })
            }
        })

        dispatch({ type: 'ADD_MODAL', payload: deleteArr })
    }

    const handleLoadmore = () => {
        setPage(page + 1)
        filterSearch({ router, page: page + 1 })
    }
    const { query } = useRouter();
    const handleSort = (e) => {
        if (document.getElementById("navbarNavDropdown"))
            document.getElementById("navbarNavDropdown").classList.remove("show");
        setSort(e.target.id)
        filterSearch({ router, sort: e.target.value })
    }
    useEffect(() => {


        let res = categories.filter((item) => {
            return item._id == query.category;
        });
        if (query.category === "all")
            setCurrentCategory("CAZZ SHOWCASE");
        else if (res.length > 0) {
            setCurrentCategory(res[0].name);
        }

    }, [query.category])



    return (

        <div className="home_page"

        // style={{
        //     backgroundImage: "url(/website-background-mobile.PNG)",
        //     backgroundSize: "cover",
        //     minWidth: "100%", minHeight: "100%",
        //     backgroundRepeat: "no-repeat"
        // }}

        >
            <Head>
                <title>Home Page</title>
            </Head>

            {/* <Filter state={state} /> */}

            {
                auth.user && auth.user.role === 'admin' &&
                <div className="delete_all btn btn-danger mt-5 mx-5" style={{ marginBottom: '-10px' }}>
                    <input type="checkbox" checked={isCheck} onChange={handleCheckALL}
                        style={{ width: '25px', height: '25px', transform: 'translateY(8px)' }} />

                    <button className="btn btn-danger ml-2"
                        data-toggle="modal" data-target="#exampleModal"
                        onClick={handleDeleteAll}>
                        DELETE ALL
                    </button>
                </div>
            }


            <div className='row category-title-sort px-5'>

                <h1 className='Home-Category-name col-md-6'>
                    <b>
                        {currentCategory}
                    </b>
                </h1>

                <div className='col-md-6' style={{ textAlign: "right" }}>
                    <div className="dropdown custom-select sort text-capitalize" id="dropDown-menu"
                    >
                        <b className="dropbtn navbar-tshirts" style={{ cursor: "pointer" }} >
                            {sort}
                        </b>
                        <div className="dropdown-content" style={{ cursor: "pointer" }}>
                            <option className="sort-item" id="Latest Designs" value="-createdAt" onClick={handleSort}>Latest Designs</option>
                            <option className="sort-item" id="Intial Designs" value="oldest" onClick={handleSort}>Intial Designs</option>
                            <option className="sort-item" id="Best sales" value="-sold" onClick={handleSort}>Best sales</option>
                            <option className="sort-item" id="Price: High-Low" value="-price" onClick={handleSort}>Price: High-Low</option>
                            <option className="sort-item" id="Price: Low-High" value="price" onClick={handleSort}>Price: Low-High</option>

                        </div>

                    </div>
                    <i className="fas fa-filter filter-icon"></i>
                </div>

            </div>

            <div className="products">
                {
                    products.length === 0
                        ? <h2>No Products</h2>

                        : products.map(product => (
                            <ProductItem key={product._id} product={product} handleCheck={handleCheck} />
                        ))
                }
            </div>
            {/* </InfiniteScroll> */}
            {/* {
                props.result < page * 8 ? ""
                    : <button className="btn d-block mx-auto mb-4 load-more"
                        onClick={handleLoadmore}
                    >
                        Load more
                    </button>
            } */}
            <InfiniteScroll
                dataLength={products.length}
                next={handleLoadmore}
                hasMore={!props.result < page * 8}
                loader={!props.result < page * 8 ? "" : <Loading />}
            />

        </div>
    )
}



export async function getServerSideProps({ query }) {
    const page = query.page || 1
    const category = query.category || 'all'
    const sort = query.sort || ''
    const search = query.search || 'all'

    const res = await getData(
        `product?limit=${page * 8}&category=${category}&sort=${sort}&title=${search}`
    )
    // server side rendering
    return {
        props: {
            products: res.products,
            result: res.result
        }, // will be passed to the page component as props
    }
}

export default Home