import { createContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

interface DataContextProps {
    data: Message[];
    setData: Dispatch<SetStateAction<Message[]>>;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const DataContext = createContext<DataContextProps | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <DataContext.Provider value={{ data, setData, isLoading, setIsLoading }}>
            {children}
        </DataContext.Provider>
    )
}