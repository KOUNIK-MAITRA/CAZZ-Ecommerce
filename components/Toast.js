import { useEffect, useState } from "react"

const Toast = ({ msg, handleShow, bgColor }) => {


    const [toastcolor, setToastcolor] = useState('')
    const [toasticon, setToasticon] = useState('');
    useEffect(() => {
        setTimeout(() => {
            handleShow()
        }, 2000);
    })
    useEffect(() => {

        if (bgColor === 'bg-danger') {
            setToastcolor('rgb(234 71 97 / 98%)')
            setToasticon('fas fa-times-circle')
        }
        if (bgColor === 'bg-success') {
            setToastcolor('rgb(79 200 44 / 98%)')
            setToasticon('fas fa-check-circle')
        }
        if (bgColor === 'bg-warning') {
            setToastcolor('rgb(234 185 36 / 98%)')
            setToasticon('fas fa-exclamation-triangle')
        }
        if (bgColor === 'bg-info') {
            setToastcolor('rgb(12 113 122 / 98%)')
            setToasticon('fas fa-info-circle')
        }

    }, [])



    return (
        <div className={`toast toast-custom d-flex justify-content-between show position-fixed text-light`}
            style={{ backgroundColor: toastcolor, width: "max-content" }} >
            <div className="toast-icon">
                <i className={toasticon} style={{ fontSize: "180%" }}></i>
            </div>
            <div style={{ padding: "0 12px" }}>
                <div>
                    <b className="mr-auto toast-body text-light" style={{ padding: "0" }}>{msg.title}</b>
                </div>

                <div>
                    <b className="toast-body" style={{ padding: "0" }}>{msg.msg}</b>
                </div>

            </div>
            <div>
                <div>
                    <button type="button" className="ml-2 mb-1 close text-light"
                        style={{ outline: 'none', padding: "5px" }}
                        onClick={handleShow}>x</button>
                </div>
            </div>

        </div>
    )
}

export default Toast