import emailjs from '@emailjs/browser'
import notify from "../toast/toast"

export default function contactReducer(state: Email, action: Action): Email {
    switch (action.type) {
        case 'updating': {
            return {
                ...state,
                ...action.newInfo,
            }
        }
        case 'deleting': {
            action.form!.reset()
            return {} as Email
        }
        case 'sending': {
            const emailRegex = /^(("[\w\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w\s]+")([\w-]+(?:\.[\w-]+)*))@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
            
            if (!state.email || !state.name || !state.message) {
                // Check for missing props
                notify({ type: 'error', message: "It seems you're missing a few things..." })
                return state

            } else if (!emailRegex.test(state.email)) {
                // Check for email validation
                notify({ type: 'error', message: "Please enter a valid email" })
                return state
            }

            // emailjs does not work on backend; frontend only
            notify({ 
                type: 'promise',
                promise: emailjs.send(`${process.env.NEXT_PUBLIC_SERVICE_ID}`, `${process.env.NEXT_PUBLIC_TEMPLATE_ID}`, state, `${process.env.NEXT_PUBLIC_EMAIL_KEY}`),
                messages: {
                    pending: "Sending...",
                    error: "Email failed to send",
                    success: "Email sent"
                },
            })  
            action.form!.reset()
            return state
        }
        default: {
            console.log(`Unknown action type: ${action.type}`)
            return state
        }
    }
}