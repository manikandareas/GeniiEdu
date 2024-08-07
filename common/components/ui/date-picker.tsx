'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/common/libs/utils';
import { Button } from '@/common/components/ui/button';
import { Calendar } from '@/common/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/common/components/ui/popover';
type DatePickerProps = {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    disabled?: boolean;
};
const DatePicker: React.FC<DatePickerProps> = ({
    date,
    setDate,
    disabled = false,
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    type='button'
                    disabled={disabled}
                    className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
                <Calendar
                    mode='single'
                    fromDate={new Date()}
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default DatePicker;
