import { useCallback } from 'react';
import { useSessionStore } from '../store/sessionStore';

export const useChecklistItem = (sessionId: string) => {
  const { updateChecklistItem } = useSessionStore();

  const handleChange = useCallback(
    (key: string, value: string | boolean) => {
      updateChecklistItem(sessionId, { [key]: value });
    },
    [sessionId, updateChecklistItem],
  );

  return { handleChange };
};
