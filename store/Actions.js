import { useContext } from 'react'
import { DataContext } from '../store/GlobalState'
export const ACTIONS = {
    NOTIFY: 'NOTIFY',
    AUTH: 'AUTH',
    ADD_CART: 'ADD_CART',
    ADD_MODAL: 'ADD_MODAL',
    ADD_ORDERS: 'ADD_ORDERS',
    ADD_USERS: 'ADD_USERS',
    ADD_CATEGORIES: 'ADD_CATEGORIES',
    ADD_COUPONS: 'ADD_COUPONS'

}

export const addToCart = (product, cart, userSize) => {

    if (product.inStock === 0)
        return ({ type: 'NOTIFY', payload: { error: 'This product is currently out of stock.' } })
    if (userSize === "")
        return ({ type: 'NOTIFY', payload: { error: 'Please select a size' } })
    if (product.size[userSize] < 1) {
        const error_msg = 'This product is out of stock for size: ' + userSize;
        return ({ type: 'NOTIFY', payload: { error: error_msg } })

    }
    const check = cart.every(item => {
        return item._id !== product._id
    })
    if (!check) return ({ type: 'NOTIFY', payload: { error: 'This product is already in your cart.' } })

    return ({ type: 'ADD_CART', payload: [...cart, { ...product, quantity: 1, userSize: userSize }] }
    )
}

export const decrease = (data, id) => {
    const newData = [...data]
    newData.forEach(item => {
        if (item._id === id) item.quantity -= 1
    })

    return ({ type: 'ADD_CART', payload: newData })
}

export const increase = (data, id) => {
    const newData = [...data]
    newData.forEach(item => {
        if (item._id === id) item.quantity += 1
    })

    return ({ type: 'ADD_CART', payload: newData })
}


export const deleteItem = (data, id, type) => {
    const newData = data.filter(item => item._id !== id)
    return ({ type, payload: newData })
}

export const updateItem = (data, id, post, type) => {
    const newData = data.map(item => (item._id === id ? post : item))
    return ({ type, payload: newData })
}