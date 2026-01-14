import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { EnergizacaoStep } from '../../components/Checklist/Megohmetro/EnergizacaoStep';
import { FinalizacaoStep } from '../../components/Checklist/Megohmetro/FinalizacaoStep';
import { IdentificacaoStep } from '../../components/Checklist/Megohmetro/IdentificacaoStep';
import { MontagemStep } from '../../components/Checklist/Megohmetro/MontagemStep';
import { PreEnergizacaoStep } from '../../components/Checklist/Megohmetro/PreEnergizacaoStep';
import { SoftwareStep } from '../../components/Checklist/Megohmetro/SoftwareStep';

type ParamList = {
    Megohmetro: { id: string };
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
  display: flex;
  text-align: center;
`;

export default function MegohmetroScreen() {
    const route = useRoute<RouteProp<ParamList, 'Megohmetro'>>();
    const { id } = route.params;
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 6;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                <View key="1">
                    <MontagemStep sessionId={id} />
                </View>
                <View key="2">
                    <PreEnergizacaoStep sessionId={id} />
                </View>
                <View key="3">
                    <EnergizacaoStep sessionId={id} />
                </View>
                <View key="4">
                    <SoftwareStep sessionId={id} />
                </View>
                <View key="5">
                    <FinalizacaoStep sessionId={id} />
                </View>
                <View key="6">
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
