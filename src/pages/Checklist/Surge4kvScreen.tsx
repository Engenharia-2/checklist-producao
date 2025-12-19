import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { AnaliseHardwareStep } from '../../components/Checklist/Surge4kv/AnaliseHardwareStep';
import { AnaliseInicialStep } from '../../components/Checklist/Surge4kv/AnaliseInicialStep';
import { CalibracaoStep } from '../../components/Checklist/Surge4kv/CalibracaoStep';
import { EnergizacaoStep } from '../../components/Checklist/Surge4kv/EnergizacaoStep';
import { FinalizacaoStep } from '../../components/Checklist/Surge4kv/FinalizacaoStep';
import { IdentificacaoStep } from '../../components/Checklist/Surge4kv/IdentificacaoStep';
import { ImageStep } from '../../components/Checklist/Surge4kv/ImageStep';

type ParamList = {
    Surge4kv: { id: string };
};

const Header = styled.View`
  padding: 16px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`; 

const StepIndicator = styled.Text`
  font-size: 14px;
  color: #666;
`;

export default function Surge4kvScreen() {
    const route = useRoute<RouteProp<ParamList, 'Surge4kv'>>();
    const { id } = route.params;
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 7;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                <View key="1">
                    <AnaliseInicialStep sessionId={id} />
                </View>
                <View key="2">
                    <AnaliseHardwareStep sessionId={id} />
                </View>
                <View key="3">
                    <EnergizacaoStep sessionId={id} />
                </View>
                <View key="4">
                    <CalibracaoStep sessionId={id} />
                </View>
                <View key="5">
                    <FinalizacaoStep sessionId={id} />
                </View>
                <View key="6">
                    <ImageStep sessionId={id} />
                </View>
                <View key="7">
                    <IdentificacaoStep sessionId={id} />
                </View>
            </PagerView>
            <StepIndicator>Etapa {currentPage + 1} de {totalPages}</StepIndicator>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
    },
});
