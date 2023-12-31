import { useState } from "react"

import { DatePicker } from "@/components/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type DialogInputProps = {
    title: string
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const DialogInput = ({ title, label, value, onChange }: DialogInputProps) => {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={label} className="text-right">
                {title}
            </Label>
            <Input
                id={label}
                value={value}
                onChange={onChange}
                className="col-span-3"
            />
        </div>
    )
}


type DialogDateProps = {
    date: Date
    label: string
    onSelect: (date: Date | undefined) => void
}

export const DialogDate = ({ date, label, onSelect }: DialogDateProps) => {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={label} className="text-right">
                Date
            </Label>
            <DatePicker
                date={date}
                onSelect={onSelect}
            />
        </div>
    )
}


type DialogSelectorProps = {
    title: string;
    label: string;
    selected: string[];
    setSelected: (selected: string[]) => void;
};

export const DialogSelector = ({ title, label, selected, setSelected }: DialogSelectorProps) => {
    const [newSelection, setNewSelection] = useState('');

    const handleSelectionInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const selectedValue = newSelection.trim();
            if (selectedValue) {
                setSelected([...selected, selectedValue]);
                setNewSelection('');
            }
        }
    };

    const removeSelection = (selection: string) => {
        setSelected(selected.filter((s) => s !== selection));
    }

    return (
        <>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={label} className="text-right">
                    {title}
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                    <Input
                        id={label}
                        value={newSelection}
                        onChange={(e) => setNewSelection(e.target.value)}
                        onKeyDown={handleSelectionInput}
                        className="w-full"
                    />
                    <Button onClick={() => {
                        const selectedValue = newSelection.trim();
                        if (selectedValue) {
                            setSelected([...selected, selectedValue]);
                            setNewSelection('');
                        }
                    }}>
                        Add {title}
                    </Button>
                </div>
            </div>
            <div className="flex flex-wrap mt-2 ml-20">
                {selected.map((selection, index) => (
                    <Badge
                        key={index}
                        className="mr-2 mb-2 cursor-pointer transform transition hover:scale-110"
                        onClick={() => removeSelection(selection)}
                    >
                        {selection}
                    </Badge>
                ))}
            </div>
        </>
    );
};