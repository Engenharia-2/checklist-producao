import React from 'react';
import { CustomCheckbox } from '../ui/Checkbox/CustomCheckbox';

interface ChecklistItemProps {
    id: string; // Add ID to track specific items
    label: string;
    isChecked: boolean;
    onToggle: (id: string, value: boolean) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
    id,
    label,
    isChecked,
    onToggle
}) => {
    return (
        <CustomCheckbox
            label={label}
            value={isChecked}
            onValueChange={(val) => onToggle(id, val)}
        />
    );
};
