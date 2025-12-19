import { useCallback } from 'react';

type UpdateStepFunction = (
  index: number,
  field: string,
  value: string | boolean,
) => void;

export const useChecklistStep = (
  index: number,
  updateStep: UpdateStepFunction,
) => {
  const handleChange = useCallback(
    (field: string, value: string | boolean) => {
      updateStep(index, field, value);
    },
    [index, updateStep],
  );

  return { handleChange };
};
