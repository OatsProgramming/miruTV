import { create } from 'zustand'

type TurnstileStore = {
    isSuccess: boolean,
    isValidToken: boolean,
    TSResponse: TurnstileResponse,
    setIsSuccess: (isSuccess: TurnstileStore['isSuccess']) => void,
    setIsValidToken: (isValidToken: TurnstileStore['isValidToken']) => void,
    setTSResponse: (TSResponse: TurnstileStore['TSResponse']) => void,
    resetTurnstileStore: () => void,
}

const useTurnstileStore = create<TurnstileStore>((set, get) => ({
    isSuccess: false,
    isValidToken: false,
    TSResponse: {} as TurnstileResponse,
    setIsSuccess: (isSuccess: TurnstileStore['isSuccess']) => {
        const expires = 1_000 * 60 * 60 // 1 hr
        set({ isSuccess })

        setTimeout(() => {
            get().resetTurnstileStore()
        }, expires)
    },
    setTSResponse: (TSResponse: TurnstileStore['TSResponse']) => set({ TSResponse }),
    setIsValidToken: (isValidToken: TurnstileStore['isValidToken']) => set({ isValidToken }),
    resetTurnstileStore: () => set({ isSuccess: false, isValidToken: false, TSResponse: {} as TurnstileResponse })
}))

export default useTurnstileStore