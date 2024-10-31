import React from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'

function Rating({ rating }: { rating: number }) {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1 <= rating)
    // 1.	Array.from({ length: 5 }): 길이가 5인 배열을 생성
    // { length: 5 }를 사용하여 길이가 5인 빈 배열을 만들고, 각 요소를 특정 방식으로 채울 수 있게 합니다.
    // 2.	매개변수 (_, i): Array.from의 두 번째 매개변수로 함수를 제공하며, 함수의 두 매개변수 중 _는 배열의 요소 (이 경우 의미가 없기 때문에 사용되지 않음)이고, i는 인덱스입니다 (0부터 시작).
    // 3.	i + 1 <= rating: i + 1은 1부터 5까지의 숫자를 나타내며, rating과 비교합니다.
    // 만약 i + 1이 rating 이하라면 true, 그렇지 않다면 false를 반환합니다.
    // 4.	stars 배열 결과: rating이 3이면 [true, true, true, false, false]가 됩니다. 이는 별 3개가 채워지고, 나머지 2개는 비어 있음을 나타냅니다.
    return (
        <div className='flex items-center gap-x-1'>
            {stars.map((isFilled, i) => {
                const className = `w-3 h-3 ${isFilled ? 'text-primary' : 'text-gray-400'}`
                return isFilled ? (
                    <FaStar className={className} key={i} />
                ) : (
                    <FaRegStar className={className} key={i} />
                )
            })}
        </div>
    )
}

export default Rating
