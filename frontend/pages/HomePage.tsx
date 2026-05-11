import {
    View, Image, Animated, Easing,
    Platform, TouchableWithoutFeedback, Keyboard, FlatList, Text, ActivityIndicator
} from "react-native";
import { TopBar } from "../components/TopBar";
import { Colors } from "../constants/colors";
import { useRef, useEffect, useContext, useState } from "react";
import { Entry } from "../components/Entry";
import { DataContext, Message } from "../context/DataContext";

const openAILogo = require('../assets/images/openai.png');

export const HomePage = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const { data, isLoading } = useContext(DataContext)!;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();

        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
        }).start();
    }, []);

    const rotateInterpolation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={{
            flexDirection: 'row',
            paddingHorizontal: 15,
            marginVertical: 12,
            justifyContent: item.role === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-start'
        }}>
            {/* Avatar de ChatGPT para sus respuestas */}
            {item.role === 'assistant' && (
                <View style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: '#10a37f',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                    marginTop: 2
                }}>
                    <Image
                        source={openAILogo}
                        style={{ width: 20, height: 20, tintColor: 'white' }}
                        resizeMode="contain"
                    />
                </View>
            )}

            <View style={{
                backgroundColor: item.role === 'user' ? Colors.chatgpt.userBubble : 'transparent',
                padding: item.role === 'user' ? 12 : 5,
                paddingHorizontal: item.role === 'user' ? 18 : 5,
                borderRadius: 22,
                maxWidth: item.role === 'user' ? '80%' : '85%',
            }}>
                <Text style={{
                    color: 'white',
                    fontSize: 16,
                    lineHeight: 24,
                }}>
                    {item.content}
                </Text>
            </View>
        </View>
    );

    const flatListRef = useRef<FlatList>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => setKeyboardHeight(e.endCoordinates.height)
        );
        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardHeight(0)
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <View style={{
            flex: 1,
            backgroundColor: Colors.chatgpt.darkBg,
            paddingBottom: keyboardHeight // Salto instantáneo
        }}>
            <View style={{ flex: 1 }}>
                <TopBar />

                {data.length === 0 ? (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Animated.View style={{
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                                opacity: fadeAnim,
                                transform: [{ rotate: rotateInterpolation }],
                            }}>
                                <Image
                                    source={openAILogo}
                                    style={{ width: 45, height: 45 }}
                                    resizeMode="contain"
                                />
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={data}
                        renderItem={renderMessage}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={{ paddingVertical: 20 }}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="handled"
                        removeClippedSubviews={true}
                        ListFooterComponent={
                            isLoading ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginVertical: 10 }}>
                                    <ActivityIndicator size="small" color={Colors.chatgpt.green} />
                                    <Text style={{ color: Colors.chatgpt.textSecondary, marginLeft: 10, fontSize: 14 }}>
                                        ChatGPT está escribiendo...
                                    </Text>
                                </View>
                            ) : null
                        }
                    />
                )}

                <Entry />
            </View>
        </View>
    )
}