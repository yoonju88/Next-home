import { fetchChartsData } from '@/utils/action'
import Chart from './Chart'

export default async function ChartsContainer() {
    const bookings = await fetchChartsData()
    if (bookings.length < 1) return null

    return <Chart data={bookings} />
}
