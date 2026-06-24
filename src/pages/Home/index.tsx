import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, View, Image, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SessionList } from '@/src/components/Home/SessionList';
import { CustomButton } from '@/src/components/ui/Button';
import { SearchInput } from '@/src/components/ui/Input/SearchInput';
import { useSessionStore } from '@/src/store/sessionStore';
import { InspectionCreateModal } from '@/src/components/Home/InspectionCreateModal';

import { styles } from './styles';

type RootStackParamList = {
    Home: undefined;
    StepsMenu: { id: string; formId: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const {
        sessions,
        createSession,
        deleteSession,
        initializeStore
    } = useSessionStore();

    useEffect(() => {
        initializeStore();
    }, [initializeStore]);

    const filteredSessions = sessions.filter((s) =>
        !searchQuery ||
        (s.osNumber && s.osNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCreateSession = () => {
        setModalVisible(true);
    };

    const handleConfirmCreate = async (data: { osNumber: string; serialNumber: string; formName: string; formId: string }) => {
        const newId = await createSession(data);
        if (newId) {
            navigation.navigate('StepsMenu', { id: newId, formId: data.formId });
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
        const session = sessions.find(s => s.id === id);
        if (session) {
            navigation.navigate('StepsMenu', { id, formId: session.formId || '' });
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="dark" />

            <View style={styles.logoContainer}>
                <Image style={styles.logoImage} source={require('@/assets/images/check-mobile.png')} />
                <Text style={styles.logoText}>CP-LHF</Text>
            </View>

            <View style={styles.buttonWrapper}>
                <CustomButton
                    title="Iniciar Nova OP"
                    onPress={handleCreateSession}
                />
            </View>

            <SearchInput
                placeholder="Pesquisar por OP..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <SessionList
                sessions={filteredSessions}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
            />

            <InspectionCreateModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleConfirmCreate}
            />
        </View>
    );
}
