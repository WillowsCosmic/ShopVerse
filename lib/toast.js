import { toast } from "sonner"

export const showToast = (type, message) => {
    
    switch(type){
        case 'info':
            toast.info(message)
            break;
        case 'success':
            toast.success(message)
            break;
        case 'warning':
            toast.warning(message)
            break;
        case 'error':
            toast.error(message)
            break;
        case 'promise':
            toast.promise<{ name: string }>(
                () =>
                  new Promise((resolve) =>
                    setTimeout(() => resolve({ name: "Event" }), 2000)
                  ),
                {
                  loading: "Loading...",
                  success: (data) => `${data.name} has been created`,
                  error: "Error",
                }
              )
            break;
        default:
            toast(message)
    }
}
