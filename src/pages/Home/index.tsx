import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeTabs } from '@/src/components/Home/HomeTabs';
import { InspectionCreateModal } from '@/src/components/Home/InspectionCreateModal';
import { SessionList } from '@/src/components/Home/SessionList';
import { CustomButton } from '@/src/components/ui/Button';
import { SearchInput } from '@/src/components/ui/Input/SearchInput';
import { PasswordModal } from '@/src/components/ui/Modal/PasswordModal';
import { useHomeSessions } from '@/src/hooks/useHomeSessions';
import { useProtectedSessionDelete } from '@/src/hooks/useProtectedSessionDelete';
import { useSessionStore } from '@/src/store/sessionStore';
import { HomeTab } from '@/src/types/home';
import { RootStackParamList } from '@/src/types/navigation';
import { CreateSessionData } from '@/src/types/session';

import { styles } from './styles';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<HomeTab>('abertas');

    const {
        sessions,
        createSession,
        deleteSession,
        initializeStore
    } = useSessionStore();

    const displayedSessions = useHomeSessions(sessions, searchQuery, activeTab);
    const {
        passwordModalVisible,
        requestDelete,
        confirmDelete,
        cancelDelete,
    } = useProtectedSessionDelete({ sessions, deleteSession });

    useEffect(() => {
        initializeStore();
    }, [initializeStore]);

    const handleConfirmCreate = async (data: CreateSessionData) => {
        const newId = await createSession(data);
        if (newId) {
            navigation.navigate('StepsMenu', { id: newId, formId: data.formId });
        }
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
                <Text style={styles.logoText}>FCP-LHF</Text>
            </View>

            <View style={styles.buttonWrapper}>
                <CustomButton
                    title="Iniciar Nova OP"
                    onPress={() => setModalVisible(true)}
                />
            </View>

            <SearchInput
                placeholder="Pesquisar por OP..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <HomeTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <SessionList
                sessions={displayedSessions}
                onSelectSession={handleSelectSession}
                onDeleteSession={requestDelete}
            />

            <InspectionCreateModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleConfirmCreate}
            />

            <PasswordModal
                visible={passwordModalVisible}
                onClose={cancelDelete}
                onSuccess={confirmDelete}
                title="Excluir OP Protegida"
                description="Digite a senha para autorizar a exclusão desta OP em estoque ou finalizada."
            />
        </View>
    );
}
