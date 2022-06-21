import { useState } from "react"

export const useInputState = (initialVal: string ="") => {
    const [val, setVal] = useState(initialVal)
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value)
    }
    return [val, onChange] as const
}