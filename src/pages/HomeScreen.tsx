import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { SessionList } from '@/src/components/Home/SessionList';
import { CustomButton } from '@/src/components/ui/Button';
import { SearchInput } from '@/src/components/ui/Input/SearchInput';
import { useSessionStore } from '@/src/store/sessionStore';

// Define the params for our stack
type RootStackParamList = {
    Home: undefined;
    Entry: { id: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #f7f7f7;
  align-items: center;
`;

const Header = styled.View`
  align-items: center;
  width: 100%;
`;

const LogoImage = styled.Image`
  width: 100%;
  height: 20%; 
  resize-mode: contain;
`;

const ButtonWrapper = styled.View`
  width: 100%;
  height: 8%;
  margin-bottom: 16px;
`;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');

    // FIX: Destructure sessions to ensure component re-renders when list changes
    const {
        sessions,
        isCreating,
        createSession,
        deleteSession,
        initializeStore
    } = useSessionStore();

    useEffect(() => {
        initializeStore();
    }, []);

    // Filter locally or use a memoized selector, but ensuring 'sessions' dependency
    const filteredSessions = sessions.filter((s) =>
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.osNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateSession = async () => {
        const mockOS = Math.floor(Math.random() * 10000).toString();
        const newId = await createSession('Cliente Exemplo', mockOS);
        navigation.navigate('Entry', { id: newId });
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
        <Container style={{ paddingTop: insets.top }}>
            <StatusBar style="dark" />

            <LogoImage source={require('@/assets/images/logoCianoEscritaLHF.png')} />

            <ButtonWrapper>
                <CustomButton
                    title={isCreating ? "Criando..." : "Iniciar Nova OP"}
                    onPress={handleCreateSession}
                    isLoading={isCreating}
                />
            </ButtonWrapper>

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
        </Container>
    );
}
