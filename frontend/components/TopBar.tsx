import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const TopBar = () => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{
            paddingTop: insets.top + 10,
            paddingBottom: 20,
            paddingHorizontal: 20,
            backgroundColor: Colors.chatgpt.darkBg,
            borderBottomWidth: 1,
            borderBottomColor: Colors.chatgpt.border,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <TouchableOpacity>
                <Ionicons name="menu" size={26} color="white" />
            </TouchableOpacity>

            <Text style={{ fontSize: 18, fontWeight: "600", color: "white" }}>clone GPT</Text>

            <TouchableOpacity>
                <MaterialCommunityIcons name="square-edit-outline" size={26} color="white" />
            </TouchableOpacity>
        </View>
    )
}