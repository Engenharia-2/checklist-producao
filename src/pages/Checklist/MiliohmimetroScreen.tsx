import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { CalibrationStep } from '../../components/Checklist/Miliohmimetro/CalibrationStep';
import { EnergizationStep } from '../../components/Checklist/Miliohmimetro/EnergizationStep';
import { FinalizationStep } from '../../components/Checklist/Miliohmimetro/FinalizationStep';
import { IdentificationStep } from '../../components/Checklist/Miliohmimetro/IdentificationStep';
import { ImageStep } from '../../components/Checklist/Miliohmimetro/ImageStep';
import { InitialAnalysisStep } from '../../components/Checklist/Miliohmimetro/InitialAnalysisStep';
import { MechanicsStep } from '../../components/Checklist/Miliohmimetro/MechanicsStep';
import { PreEnergizationStep } from '../../components/Checklist/Miliohmimetro/PreEnergizationStep';
import { SoftwareStep } from '../../components/Checklist/Miliohmimetro/SoftwareStep';

type ParamList = {
    Miliohmimetro: { id: string };
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

export default function MiliohmimetroScreen() {
    const route = useRoute<RouteProp<ParamList, 'Miliohmimetro'>>();
    const { id } = route.params;
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 9;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                <View key="1">
                    <InitialAnalysisStep sessionId={id} />
                </View>
                <View key="2">
                    <MechanicsStep sessionId={id} />
                </View>
                <View key="3">
                    <PreEnergizationStep sessionId={id} />
                </View>
                <View key="4">
                    <EnergizationStep sessionId={id} />
                </View>
                <View key="5">
                    <SoftwareStep sessionId={id} />
                </View>
                <View key="6">
                    <CalibrationStep sessionId={id} />
                </View>
                <View key="7">
                    <ImageStep sessionId={id} />
                </View>
                <View key="8">
                    <FinalizationStep sessionId={id} />
                </View>
                <View key="9">
                    <IdentificationStep sessionId={id} />
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
