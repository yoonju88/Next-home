import { findCountryByCode } from '@/utils/countries'
import React from 'react'

function CountryFlagAndName({ countryCode }: { countryCode: string }) {
    const validCountry = findCountryByCode(countryCode)!
    // findCountryByCode 함수가 반드시 유효한 값을 반환할 것이라고 확신
    // !를 사용하면, 컴파일러는 더 이상 null이나 undefined일 가능성을 경고하지 않으며, 해당 값을 강제로 non-null 타입으로 취급
    const countryName = validCountry.name.length > 20
        ? `${validCountry.name.substring(0, 20)}...`
        : validCountry.name;
    return (
        <span className='flex justifbetween items-center gap-2 text-sm'>
            {validCountry.flag}<span className='pl-0'>{countryName}</span>
        </span >
    )
}
export default CountryFlagAndName


