import React from 'react'
import { FaStar } from 'react-icons/fa'
async function PropertyRating({
    propertyId,
    inPage,
}: {
    inPage: boolean;
    propertyId: string;
}) {
    const rating = 4.7
    const count = 100
    const className = `flex gap-1 items-center ${inPage ? 'text-md' : 'text-xs'}`
    const countText = count > 1 ? 'reviews' : 'review'
    const countValue = `(${count}) ${inPage ? countText : ''}`
    const id = await propertyId
    return (
        <span className={className} key={id}>
            <FaStar className='w-3 h-3' />
            {rating} {countValue}
        </span>
    )
}
export default PropertyRating
