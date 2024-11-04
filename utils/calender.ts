import { DataRange, DateRange } from 'react-day-picker'
import { Booking } from './types'

export const defaultSelected: DateRange = {
    from: undefined,
    to: undefined,
}
// 예약(bookings)과 오늘 날짜(today)를 바탕으로 차단된 날짜 범위(DateRange[])를 생성
export const generateBlockedPeriods = ({
    bookings,
    today,
}: {
    bookings: Booking[];
    today: Date;
}) => {
    today.setHours(0, 0, 0, 0) // set the time to  00:00:00.000 
    // today의 시간을 자정(00:00:00.000)으로 설정하여 날짜 비교 시 시간으로 인한 오류를 방지

    const disabledDays: DateRange[] = [
        ...bookings.map((booking) => ({
            from: booking.checkIn,
            to: booking.checkOut,
        })),
        {
            from: new Date(0), //This is first of january 1970 00:00:00 UTC.
            to: new Date(today.getTime() - 24 * 60 * 60 * 1000) // This is yesterday.
        }, // 1970년 1월 1일부터 어제까지의 기간을 추가하여 오늘 이전의 모든 날짜를 차단
    ]
    return disabledDays
}
// 주어진 날짜 범위(DateRange | undefined)에 포함된 날짜들을 문자열 배열(string[])로 반환
//generateDateRange는 특정 날짜 범위에 있는 모든 날짜를 배열로 반환
export const generateDateRange = (range: DateRange | undefined): string[] => {
    if (!range || !range.from || !range.to) return []
    let currentDate = new Date(range.from) // 날짜 범위의 시작 날짜를 현재 날짜로 설정
    const endDate = new Date(range.to) // 범위의 끝 날짜를 정의
    const dateRange: string[] = [] //  날짜 문자열을 저장할 빈 배열을 생성
    //currentDate가 endDate보다 작거나 같을 때까지 반복
    while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0]
        //현재 날짜를 ISO 형식으로 변환하고, 'T'로 분리한 후, 날짜 부분만 가져옵니다.
        dateRange.push(dateString) // 생성한 날짜 문자열을 dateRange 배열에 추가합니다.
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return dateRange;
}

export const generateDisabledDates = (
    disabledDays: DateRange[]
): { [key: string]: boolean } => {
    if (disabledDays.length === 0) return {}

    const disableDates: { [key: string]: boolean } = {}
    const today = new Date()
    today.setHours(0, 0, 0, 0) // set time to 00:00:00 to compare only the date part

    disabledDays.forEach((range) => {
        if (!range.from || !range.to) return
        let currentDate = new Date(range.from)
        const endDate = new Date(range.to)

        while (currentDate <= endDate) {
            if (currentDate < today) {
                currentDate.setDate(currentDate.getDate() + 1)
                continue;
            }
            const dateString = currentDate.toString().split('T')[0];
            disableDates[dateString] = true;
            currentDate.setDate(currentDate.getDate() + 1)

        }
    })
    return disableDates;
}
