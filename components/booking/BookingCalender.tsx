'use client'
import { Calendar } from '@/components/ui/calendar'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useProperty } from '@/utils/store'
import { useToast } from '@/hooks/use-toast'
import {
    generateDisabledDates,
    generateDateRange,
    defaultSelected,
    generateBlockedPeriods
} from '@/utils/calender'

export default function BookingCalender() {
    const currentDate = new Date();
    const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
    const bookings = useProperty((state) => state.bookings)
    const { toast } = useToast()
    const blockedPeriods = generateBlockedPeriods({
        bookings,
        today: currentDate,
    })
    const unavailableDates = generateDisabledDates(blockedPeriods)

    useEffect(() => {
        const selectedRange = generateDateRange(range)
        // some: 배열의 요소 중 하나라도 특정 조건을 만족하는지 확인하는 데 사용
        selectedRange.some((date) => {
            if (unavailableDates[date]) {
                setRange(defaultSelected)
                toast({
                    description: 'Some dates are booked. please select again.'
                })
                return true;
            }
            return false;
        })
        useProperty.setState({ range })
    }, [range, unavailableDates, toast])

    return (
        <Calendar
            mode='range'
            defaultMonth={currentDate}
            selected={range}
            onSelect={setRange}
            className='mb-4'
            disabled={blockedPeriods}
        />
    )
}