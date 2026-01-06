import { Bounce } from "react-toastify";

export const showToast = (type, message) => {
    let options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };
    switch(type){
        case 'info':
            toast.info(message,options)
        case 'success':
            toast.success(message,options)
        case 'warning':
            toast.warning(message,options)
        case 'error':
            toast.error(message,options)
        default:
            toast(message,options)
    }
}
