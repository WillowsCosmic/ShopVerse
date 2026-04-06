import Swal from 'sweetalert2'

export const alert = (type, message) => {
    switch (type) {
        case 'success':
            Swal.fire({
                icon: "success",
                text: message,
            });
            break; 
        case 'error':
            Swal.fire({
                icon: "error",
                text: message,
            });
            break;
        
        default:
            Swal.fire({
                icon: "error",
                text: message,
            });
            break;
    }
}