import { ToastOptions, toast } from "react-toastify";

export const toastOptions: ToastOptions = {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
}

/**
 * For Toast notifications.
 * @param args 
 * @returns 
 */
export default function notify<NotifyParamsT extends NotifyParams>(args: NotifyParamsT) {
    const { type } = args

    if (type === 'promise') {
        const { promise, messages } = args
        return toast[type](
            promise,
            messages,
            toastOptions
        ) as NotifyReturnType[NotifyParamsT['type']]
    } else {
        const { message } = args
        return toast[type](
            message,
            toastOptions
        ) as NotifyReturnType[NotifyParamsT['type']]
    }
}