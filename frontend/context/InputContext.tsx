import { createContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

interface InputContextProps {
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
}

export const InputContext = createContext<InputContextProps | null>(null);

export const InputProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState<string>("");
    return (
        <InputContext.Provider value={{ message, setMessage }}>
            {children}
        </InputContext.Provider>
    )
}