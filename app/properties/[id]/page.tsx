
import FavoriteToggleButton from '@/components/card/FavoriteToggleButton';
import BreadCrumbs from '@/components/properties/BreadCrumbs';
import { fetchPropertyDetails } from '@/utils/action';
import { redirect } from 'next/navigation';
import ShareButton from '@/components/properties/ShareButton';
import { headers } from 'next/headers';
import ImageContainer from '@/components/properties/ImageContainer';
import PropertyRating from '@/components/card/PropertyRating';
import BookingCalender from '@/components/properties/BookingCalender';
import PropertyDetails from '@/components/properties/PropertyDetails';
import UserInfo from '@/components/properties/UserInfo';

async function PropertyDetailsPage({ params }: { params: { id: string } }) {
    const property = await fetchPropertyDetails(params.id)
    if (!property) { redirect('/') }
    const { baths, bedrooms, beds, guests } = property;
    const details = { bedrooms, baths, guests, beds }
    const firstName = property.profile.firstName
    const profileImage = property.profile.profileImage
    return (
        <section >
            <BreadCrumbs name={property.name} />
            <header className='flex justify-between items-center mt-4'>
                <h1 className='text-4xl font-bold capitalize'>
                    {property.tagline}
                </h1>
                <div className='flex items-center gap-x-4'>
                    <ShareButton
                        name={property.name}
                        propertyId={property.id}
                    />
                    <FavoriteToggleButton
                        propertyId={property.id}
                    />
                </div>
            </header>
            <ImageContainer mainImage={property.image} name={property.name} />
            <section className='lg:grid lg:grid-cols-12 gap-x-12 mt-12'>
                <div className='lg:col-span-8'>
                    <div className='flex gap-x-4 items-center'>
                        <h1 className='text-xl font-bold'>{property.name}</h1>
                        <PropertyRating inPage propertyId={property.id} />
                    </div>
                    <PropertyDetails details={details} />
                    <UserInfo profile={{ firstName, profileImage }} />
                </div>
                <div className='lg:col-span-4 flex flex-col items-center'>
                    <BookingCalender />
                </div>
            </section>
        </section>
    )
}

export default PropertyDetailsPage