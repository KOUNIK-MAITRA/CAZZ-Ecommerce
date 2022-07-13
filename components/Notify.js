import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import Loading from './Loading'
import Toast from './Toast'

const Notify = () => {
    const { state, dispatch } = useContext(DataContext)
    const { notify } = state

    // const [showalert, setShowAlert] = useState(true);



    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowAlert(false)
    //     }, 3000);
    //     return () => clearTimeout(timer);
    // }, []);



    // if (!showalert)
    //     return null;

    return (
        <>
            {notify.loading && <Loading />}

            {notify.error &&
                <Toast
                    msg={{ msg: notify.error, title: "Error" }}
                    handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
                    bgColor="bg-danger"
                />
            }

            {notify.success &&
                <Toast
                    msg={{ msg: notify.success, title: "Success" }}
                    handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
                    bgColor="bg-success"
                />
            }

            {notify.info &&
                <Toast
                    msg={{ msg: notify.info, title: "Info" }}
                    handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
                    bgColor="bg-info"
                />
            }
        </>
    )
}


export default Notify
