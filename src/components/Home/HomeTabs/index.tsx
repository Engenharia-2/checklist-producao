import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { HomeTab } from '@/src/types/home';

import { styles } from './styles';

interface HomeTabsProps {
    activeTab: HomeTab;
    onTabChange: (tab: HomeTab) => void;
}

const tabs: { key: HomeTab; label: string }[] = [
    { key: 'abertas', label: 'Abertas' },
    { key: 'estoque', label: 'Estoque' },
    { key: 'finalizadas', label: 'Finalizadas' },
];

export const HomeTabs: React.FC<HomeTabsProps> = ({ activeTab, onTabChange }) => (
    <View style={styles.container}>
        {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
                <TouchableOpacity
                    key={tab.key}
                    style={[styles.tab, isActive && styles.activeTab]}
                    onPress={() => onTabChange(tab.key)}
                >
                    <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            );
        })}
    </View>
);
