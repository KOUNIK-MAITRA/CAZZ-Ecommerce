import React, { useState, useEffect } from 'react'
import filterSearch from '../utils/filterSearch'
import { getData } from '../utils/fetchData'
import { useRouter } from 'next/router'

const Filter = ({ state }) => {
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('')
    const [category, setCategory] = useState('')

    const { categories } = state

    const router = useRouter()


    const handleCategory = (e) => {
        setCategory(e.target.value)
        filterSearch({ router, category: e.target.value })
    }

    const handleSort = (e) => {
        setSort(e.target.value)
        filterSearch({ router, sort: e.target.value })
    }

    useEffect(() => {
        filterSearch({ router, search: search ? search.toLowerCase() : 'all' })
    }, [search])

    return (

        <div className=" filter-wrap input-group ">

            {/* <div className=" search-bar my-3">
                <form autoComplete="off" >
                    <input type="text" className="form-control searchBar" list="title_product"
                        placeholder="Search"
                        value={search.toLowerCase()} onChange={e => setSearch(e.target.value)} />
                </form>

            </div>

            <div className=" category-selector my-3 ">
                <select className="custom-select text-capitalize " id="dropDown-menu"
                    value={category} onChange={handleCategory}>

                    <option value="all">All Products</option>

                    {
                        categories.map(item => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))
                    }
                </select>
            </div> */}


            <div className=" sort-filter input-group-prepend my-3">
                <select className="custom-select text-capitalize" id="dropDown-menu"
                    value={sort} onChange={handleSort}>

                    <option value="-createdAt">Latest Designs</option>
                    <option value="oldest">Intial Designs</option>
                    <option value="-sold">Best sales</option>
                    <option value="-price">Price: High-Low</option>
                    <option value="price">Price: Low-High</option>

                </select>
            </div>


        </div>



    )
}

export default Filter
