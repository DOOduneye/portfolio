import {useState} from 'react';

import {DatePicker, PresentState} from '@/components/date-picker';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Textarea} from '@/components/ui/textarea';
import {Checkbox} from '@/components/ui/checkbox';

type DialogCheckboxProps = {
  title: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
};

export const DialogCheckbox = ({
  title,
  label,
  value,
  onChange,
  className,
}: DialogCheckboxProps) => {
  return (
    <div className={`grid grid-cols-4 items-center gap-4 ${className}`}>
      <Label htmlFor={label} className="text-right">
        {title}
      </Label>
      <Checkbox
        id={label}
        checked={value}
        onCheckedChange={onChange}
        className="col-span-3"
      />
    </div>
  );
};

type DialogInputProps = {
  title: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export const DialogInput = ({
  title,
  label,
  value,
  onChange,
  className,
}: DialogInputProps) => {
  return (
    <div className={`grid grid-cols-4 items-center gap-4 ${className}`}>
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
  );
};

type DialogTextAreaProps = {
  title: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
};

export const DialogTextArea = ({
  title,
  label,
  value,
  onChange,
  className,
}: DialogTextAreaProps) => {
  return (
    <div className={`grid grid-cols-4 items-center gap-4 ${className}`}>
      <Label htmlFor={label} className="text-right">
        {title}
      </Label>
      <Textarea
        id={label}
        value={value}
        onChange={onChange}
        className="col-span-3"
        rows={Math.max(2, Math.ceil(value.length / 45))}
      />
    </div>
  );
};

type DialogDateProps = {
  date: Date;
  title: string;
  label: string;
  onSelect: (date: Date | undefined) => void;
  className?: string;
  present?: boolean;
};

export const DialogDate = ({
  title,
  date,
  label,
  onSelect,
  className,
  present,
}: DialogDateProps) => {
  return (
    <div className={`grid grid-cols-4 items-center gap-4 ${className}`}>
      <Label htmlFor={label} className="text-right">
        {title}
      </Label>
      {present ? (
        <PresentState />
      ) : (
        <DatePicker date={date} onSelect={onSelect} />
      )}
    </div>
  );
};

type DialogSelectorProps = {
  title: string;
  label: string;
  selected: string[];
  setSelected: (selected: string[]) => void;
  className?: string;
};

export const DialogSelector = ({
  title,
  label,
  selected,
  setSelected,
  className,
}: DialogSelectorProps) => {
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
    setSelected(selected.filter(s => s !== selection));
  };

  return (
    <>
      <div className={`grid grid-cols-4 items-center gap-4 ${className}`}>
        <Label htmlFor={label} className="text-right">
          {title}
        </Label>
        <div className="col-span-3 flex items-center gap-2">
          <Input
            id={label}
            value={newSelection}
            onChange={e => setNewSelection(e.target.value)}
            onKeyDown={handleSelectionInput}
            className="w-full"
          />
          <Button
            onClick={() => {
              const selectedValue = newSelection.trim();
              if (selectedValue) {
                setSelected([...selected, selectedValue]);
                setNewSelection('');
              }
            }}
          >
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
