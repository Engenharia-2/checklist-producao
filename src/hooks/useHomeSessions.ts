import { useMemo } from 'react';

import { HomeTab } from '@/src/types/home';
import { Session } from '@/src/types/session';

const belongsToTab = (session: Session, activeTab: HomeTab) => {
    if (activeTab === 'estoque') {
        return session.status === 'estoque';
    }

    if (activeTab === 'finalizadas') {
        return session.status === 'finalizada';
    }

    return session.status !== 'estoque' && session.status !== 'finalizada';
};

export const useHomeSessions = (
    sessions: Session[],
    searchQuery: string,
    activeTab: HomeTab
) => useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return sessions.filter((session) => {
        const matchesSearch = !normalizedQuery
            || session.osNumber?.toLowerCase().includes(normalizedQuery);

        return matchesSearch && belongsToTab(session, activeTab);
    });
}, [sessions, searchQuery, activeTab]);
