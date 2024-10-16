'use client';

import * as React from 'react';

import {CalendarIcon} from '@radix-ui/react-icons';
import {format} from 'date-fns';

import {cn} from '@/lib/utils';

import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';

interface DatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export const DatePicker = ({date, onSelect}: DatePickerProps) => {
  const handleSelect = (selectedDate: Date | undefined) => {
    console.log(selectedDate);
    onSelect(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] sm:w-[340px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export const PresentState = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={
            'w-[240px] sm:w-[340px] justify-start text-left font-normal'
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Present
        </Button>
      </PopoverTrigger>
    </Popover>
  );
};
