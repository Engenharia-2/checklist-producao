import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SessionList } from '@/src/components/Home/SessionList';
import { CustomButton } from '@/src/components/ui/Button';
import { SearchInput } from '@/src/components/ui/Input/SearchInput';
import { useSessionStore } from '@/src/store/sessionStore';

import { styles } from './styles';

// Define the params for our stack
type RootStackParamList = {
    Home: undefined;
    Entry: { id: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');

    const {
        sessions,
        isCreating,
        createSession,
        deleteSession,
        initializeStore
    } = useSessionStore();

    useEffect(() => {
        initializeStore();
    }, [initializeStore]);

    const filteredSessions = sessions.filter((s) =>
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.osNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateSession = async () => {
        const mockOS = Math.floor(Math.random() * 10000).toString();
        const newId = await createSession('Cliente Exemplo', mockOS);
        if (newId) {
            navigation.navigate('Entry', { id: newId });
        }
    };

    const handleDeleteSession = (id: string) => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja deletar esta sessão? Esta ação não pode ser desfeita.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Deletar",
                    onPress: () => deleteSession(id),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const handleSelectSession = (id: string) => {
        navigation.navigate('Entry', { id });
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="dark" />

            <Image style={styles.logoImage} source={require('@/assets/images/logoCianoEscritaLHF.png')} />

            <View style={styles.buttonWrapper}>
                <CustomButton
                    title={isCreating ? "Criando..." : "Iniciar Nova OP"}
                    onPress={handleCreateSession}
                    isLoading={isCreating}
                />
            </View>

            <SearchInput
                placeholder="Pesquisar por OP ou Cliente..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <SessionList
                sessions={filteredSessions}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
            />
        </View>
    );
}
