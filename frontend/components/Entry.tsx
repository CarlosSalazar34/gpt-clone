import { Colors } from "../constants/colors"
import { TextInput, View, TouchableOpacity, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useContext } from "react";
import { InputContext } from "../context/InputContext";
import { DataContext, Message } from "../context/DataContext";



export const Entry = () => {
    const { message, setMessage } = useContext(InputContext)!;
    const { data, setData, setIsLoading } = useContext(DataContext)!;

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMessage: Message = { role: "user", content: message };
        const updatedHistory = [...data, userMessage];
        
        setData((prev: Message[]) => [...prev, userMessage]);
        setMessage("");
        setIsLoading(true);

        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    messages: updatedHistory
                })
            });

            const resData = await response.json();

            if (resData.response) {
                const assistantMessage: Message = { role: "assistant", content: resData.response };
                setData((prev: Message[]) => [...prev, assistantMessage]);
            }
        } catch (error) {
            console.error("Error enviando mensaje:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={{
            padding: 10,
            paddingHorizontal: 16,
            backgroundColor: Colors.chatgpt.darkBg,
            borderTopWidth: 1,
            borderTopColor: Colors.chatgpt.border,
            paddingBottom: Platform.OS === 'ios' ? 30 : 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 12
        }}>
            <TextInput
                placeholder="Escribe un mensaje..."
                style={{
                    height: 50,
                    flex: 1,
                    borderColor: Colors.chatgpt.border,
                    borderWidth: 1,
                    borderRadius: 25,
                    paddingHorizontal: 16,
                    color: "white",
                    fontSize: 18
                }}
                placeholderTextColor="gray"
                onChangeText={(text) => setMessage(text)}
                value={message}
            />
            <TouchableOpacity style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: Colors.chatgpt.border,
                justifyContent: "center",
                alignItems: "center"
            }} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
}