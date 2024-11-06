'use client';
import { useState } from 'react';
import { amenities, Amenity } from '@/utils/amenities';
import { Checkbox } from '@/components/ui/checkbox';

export default function AmenitiesInput({ defaultValue }: { defaultValue?: Amenity[] }) {
    const amenitiesWithIcons = defaultValue?.map(({ name, selected }) => ({
        name,
        selected,
        icon: amenities.find((amenity) => amenity.name === name)!.icon,
    }))

    const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(amenitiesWithIcons || amenities)

    const handleChange = (amenity: Amenity) => {
        setSelectedAmenities((prev) => {
            return prev.map((a) => {
                if (a.name === amenity.name) {
                    return { ...a, selected: !a.selected } /* 	name이 같은 Amenity 객체를 찾으면, 그 객체의 selected 값을 반전시킵니다. */
                }
                return a
            })
        })
    }
    return (
        <section>
            <input
                type='hidden'
                name='amenities'
                value={JSON.stringify(selectedAmenities)}
            />
            <div className='grid grid-cols-2 gap-4'>
                {selectedAmenities.map((amenity) => {
                    return (
                        <div key={amenity.name} className='flex items-center space-x-3'>
                            <Checkbox
                                id={amenity.name}
                                checked={amenity.selected}
                                onCheckedChange={() => { handleChange(amenity) }}
                            />
                            <label
                                htmlFor={amenity.name}
                                className='text-xm font-medium leading-none capitalize flex gap-x-2 items-center'
                            >
                                {amenity.name}
                                <amenity.icon className='w-4 h-4' />
                            </label>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}