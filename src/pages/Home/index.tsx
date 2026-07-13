import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, View, Image, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SessionList } from '@/src/components/Home/SessionList';
import { CustomButton } from '@/src/components/ui/Button';
import { SearchInput } from '@/src/components/ui/Input/SearchInput';
import { useSessionStore } from '@/src/store/sessionStore';
import { InspectionCreateModal } from '@/src/components/Home/InspectionCreateModal';
import { PasswordModal } from '@/src/components/ui/Modal/PasswordModal';

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
    const [activeTab, setActiveTab] = useState<'abertas' | 'finalizadas'>('abertas');
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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

    const openSessions = filteredSessions.filter(s => s.status !== 'finalizada');
    const closedSessions = filteredSessions.filter(s => s.status === 'finalizada');

    const handleCreateSession = () => {
        setModalVisible(true);
    };

    const handleConfirmCreate = async (data: { osNumber: string; serialNumber: string; formName: string; formId: string }) => {
        const newId = await createSession(data);
        if (newId) {
            navigation.navigate('StepsMenu', { id: newId, formId: data.formId });
        }
    };

    const handleConfirmDelete = () => {
        if (pendingDeleteId) {
            deleteSession(pendingDeleteId);
            setPendingDeleteId(null);
        }
    };

    const handleDeleteSession = (id: string) => {
        const session = sessions.find(s => s.id === id);
        if (session?.status === 'finalizada') {
            setPendingDeleteId(id);
            setPasswordModalVisible(true);
        } else {
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
                    onPress={handleCreateSession}
                />
            </View>

            <SearchInput
                placeholder="Pesquisar por OP..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'abertas' && styles.activeTab]}
                    onPress={() => setActiveTab('abertas')}
                >
                    <Text style={[styles.tabText, activeTab === 'abertas' && styles.activeTabText]}>
                        Abertas 
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'finalizadas' && styles.activeTab]}
                    onPress={() => setActiveTab('finalizadas')}
                >
                    <Text style={[styles.tabText, activeTab === 'finalizadas' && styles.activeTabText]}>
                        Finalizadas 
                    </Text>
                </TouchableOpacity>
            </View>

            <SessionList
                sessions={activeTab === 'abertas' ? openSessions : closedSessions}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
            />

            <InspectionCreateModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleConfirmCreate}
            />

            <PasswordModal
                visible={passwordModalVisible}
                onClose={() => {
                    setPasswordModalVisible(false);
                    setPendingDeleteId(null);
                }}
                onSuccess={handleConfirmDelete}
                title="Excluir OP Finalizada"
                description="Digite a senha para autorizar a exclusão desta OP finalizada."
            />
        </View>
    );
}
