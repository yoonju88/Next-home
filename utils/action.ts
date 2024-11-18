'use server'
import db from './db';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createReviewSchema, imageSchema, profileSchema, propertySchema, validateWithZodSchema } from "./schemas"
import { uploadImage } from './supabase';
import { calculateTotals } from './calculateTotals';
//import { formatDate } from './format';

const getAuthUser = async () => {
    const user = await currentUser()
    if (!user) {
        throw new Error('Please logged in to access this page')
    }
    if (!user.privateMetadata.hasProfile) redirect('/profile/create')
    return user
}

const renderError = (error: unknown): { message: string } => {
    console.log(error)
    return { message: error instanceof Error ? error.message : 'An error occurred' }
}
export const createProfileAction = async (
    prevState: any,
    formData: FormData
) => {
    try {
        const user = await currentUser()
        if (!user) throw new Error('Please login to create a profile')
        const rawData = Object.fromEntries(formData)
        const validatedFields = validateWithZodSchema(profileSchema, rawData)
        await db.profile.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                profileImage: user.imageUrl ?? '',
                ...validatedFields,
            },
        })
        await clerkClient.users.updateUserMetadata(user.id, {
            privateMetadata: {
                hasProfile: true,
            }
        })
    } catch (error) {
        return renderError(error)
    }
    redirect('/')
}

export const fetchProfileImage = async () => {
    const user = await currentUser()
    if (!user) return null
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id,
        },
        select: {
            profileImage: true,
        },
    })
    return profile?.profileImage;
}

export const fetchProfile = async () => {
    const user = await getAuthUser();
    console.log('userID:', user.id)
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id,
        },
    })
    if (!profile) redirect('/profile/create')
    return profile;
}

export const updateProfileAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser()
    try {
        const rawData = Object.fromEntries(formData)
        const validatedFields = validateWithZodSchema(profileSchema, rawData)
        await db.profile.update({
            where: {
                clerkId: user.id,
            },
            data: validatedFields,
        })
        revalidatePath('/profile')
        return { message: 'Profile updated successfully' }
    } catch (error) {
        return renderError(error)
    }
}

export const updateProfileImageAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
        const image = formData.get('image') as File
        const validatedFields = validateWithZodSchema(imageSchema, { image })
        const fullPath = await uploadImage(validatedFields.image)
        await db.profile.update({
            where: {
                clerkId: user.id,
            },
            data: {
                profileImage: fullPath,
            },
        })
        revalidatePath('/profile')
        return { message: 'Profile image updated successfully' };
    } catch (error) {
        return renderError(error)
    }
};

export const createPropertyAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser()
    try {
        const rawData = Object.fromEntries(formData)
        const file = formData.get('image') as File
        const validatedFields = validateWithZodSchema(propertySchema, rawData)
        const validatedFile = validateWithZodSchema(imageSchema, { image: file })
        const fullPath = await uploadImage(validatedFile.image)
        await db.property.create({
            data: {
                ...validatedFields,
                image: fullPath,
                profileId: user.id,
            },
        })
    } catch (error) {
        return renderError(error)
    }
    redirect('/')
}

// to search bar
export const fetchProperties = async ({
    search = '',
    category,
}: {
    search?: string;
    category?: string;
}) => {
    const properties = await db.property.findMany({
        where: {
            category,
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { tagline: { contains: search, mode: 'insensitive' } },
            ],
        },
        select: {
            id: true,
            name: true,
            tagline: true,
            country: true,
            image: true,
            price: true,
        },
    })
    return properties;
}

export const fetchFavoriteId = async ({ propertyId }: { propertyId: string }) => {
    const user = await getAuthUser();
    const favorite = await db.favorite.findFirst({
        where: {
            propertyId,
            profileId: user.id,
        },
        select: {
            id: true,
        },
    })
    return favorite?.id || null;
}

export const toggleFavoriteAction = async (prevState: {
    propertyId: string;
    favoriteId: string | null;
    pathname: string,
}) => {
    const user = await getAuthUser()
    const { propertyId, favoriteId, pathname } = prevState
    try {
        if (favoriteId) {
            await db.favorite.delete({
                where: {
                    id: favoriteId,
                },
            })
        } else {
            await db.favorite.create({
                data: {
                    propertyId,
                    profileId: user.id,
                },
            })
        }
        revalidatePath(pathname)
        return { message: favoriteId ? 'Removed from favorites' : 'Added to Favorites' }

    } catch (error) {
        return renderError(error)
    }
}

export const fetchFavorites = async () => {
    const user = await getAuthUser()
    const favorites = await db.favorite.findMany({
        where: {
            profileId: user.id,
        },
        select: {
            property: {
                select: {
                    id: true,
                    name: true,
                    tagline: true,
                    price: true,
                    country: true,
                    image: true,
                },
            },
        },
    })
    return favorites.map((favorite) => favorite.property);
}
export const createReviewAction = async (
    prevState: any,
    formData: FormData
) => {
    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData)
        const validatedFields = validateWithZodSchema(createReviewSchema, rawData)
        await db.review.create({
            data: {
                ...validatedFields,
                profileId: user.id,
            },
        })
        revalidatePath(`/properties/§{validatedFields.propertyId}`)
        return { message: 'Review submitted successfully' }
    } catch (error) {
        return renderError(error)
    }
};

export const fetchPropertyReviews = async (propertyId: string) => {
    const reviews = await db.review.findMany({  // review 테이블에서 여러 개의 리뷰를 조회
        where: {
            propertyId, // propertyId와 일치하는 리뷰만 가져옵니다.
        },
        select: { // select는 필요한 컬럼(필드)만 선택하여 가져오는 옵션
            id: true,
            rating: true,
            comment: true,
            profile: {
                select: {
                    firstName: true,
                    profileImage: true,
                },
            },
        },
        orderBy: { // orderBy는 결과를 정렬하는 옵션
            createdAt: 'desc' // createdAt(리뷰 작성일)을 기준으로 내림차순(desc) 정렬
        },
    })
    return reviews;
};
// 현재 인증된 사용자가 남긴 리뷰 목록을 조회
export const fetchPropertyReviewsByUser = async () => {
    const user = await getAuthUser()
    const reviews = await db.review.findMany({
        where: {
            profileId: user.id,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            property: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    })
    return reviews
};
//prevState를 인수로 받는 이유는 삭제하려는 리뷰의 ID (reviewId)를 함수에 전달하기 위해
export const deleteReviewAction = async (prevState: { reviewId: string }) => {
    const { reviewId } = prevState;
    const user = await getAuthUser()
    try {
        await db.review.delete({
            where: { // where 조건에 따라 reviewId와 profileId가 일치하는 경우에만 삭제
                id: reviewId,
                profileId: user.id,
            },
        })
        revalidatePath('/reviews')
        return { message: 'Review deleted successfully' }
    } catch (error) {
        return renderError(error)
    }
};

export async function fetchPropertyRating(propertyId: string) {
    const result = await db.review.groupBy({
        by: ['propertyId'],
        _avg: { //average
            rating: true,
        },
        _count: {
            rating: true,
        },
        where: {
            propertyId,
        },
    })
    return {
        rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
        count: result[0]?._count.rating ?? 0,
    }
}

export const findExistingReview = async (
    userId: string,
    propertyId: string
) => {
    return await db.review.findFirst({
        where: {
            profileId: userId,
            propertyId: propertyId,
        },
    })
}

export const fetchPropertyDetails = (id: string) => {
    return db.property.findUnique({
        where: {
            id,
        },
        include: {
            profile: true,
            bookings: {
                select: {
                    checkIn: true,
                    checkOut: true,
                },
            },
        },
    })
}

export const createBookingAction = async (prevState: {
    propertyId: string;
    checkIn: Date;
    checkOut: Date;
}) => {

    let bookingId: null | string = null;
    const user = await getAuthUser()
    await db.booking.deleteMany({
        where: {
            profileId: user.id,
            paymentStatus: false,
        },
    })
    const { propertyId, checkIn, checkOut } = prevState;
    const property = await db.property.findUnique({
        where: { id: propertyId },
        select: { price: true },
    })
    if (!property) {
        return { message: 'Property not found' };
    }
    const { orderTotal, totalNights } = calculateTotals({
        checkIn,
        checkOut,
        price: property.price,
    })
    await db.booking.deleteMany({
        where: {
            profileId: user.id,
            paymentStatus: false,
        }
    })

    try {
        const booking = await db.booking.create({
            data: {
                checkIn,
                checkOut,
                orderTotal,
                totalNights,
                profileId: user.id,
                propertyId,
            },
        });
        bookingId = booking.id
    } catch (error) {
        return renderError(error)
    }
    redirect(`/checkout?bookingId=${bookingId}`)
}

export const fetchBookings = async () => {
    const user = await getAuthUser()
    const bookings = await db.booking.findMany({
        where: {
            profileId: user.id,
            paymentStatus: true,
        },
        include: {
            property: {
                select: {
                    id: true,
                    name: true,
                    country: true,
                },
            },
        },
        orderBy: {
            checkIn: 'desc',
        }
    })
    return bookings;
}

export async function deleteBookingAction(prevState: { bookingId: string }) {
    const { bookingId } = prevState;
    const user = await getAuthUser();

    try {
        await db.booking.delete({
            where: {
                id: bookingId,
                profileId: user.id,
            },
        })
        revalidatePath('/bookings')
        return { message: 'Booking deleted successfully' }
    } catch (error) {
        return renderError(error)
    }
}
//이 코드는 렌탈(숙소) 정보와 관련된 데이터를 DB에서 가져오고, 
//그에 대한 **예약 정보(예약된 총 밤 수 및 총 금액)**를 함께 계산해서 반환하는 함수
export const fetchRentals = async () => {
    const user = await getAuthUser()
    const rentals = await db.property.findMany({
        where: {
            profileId: user.id,
        },
        select: {
            id: true,
            name: true,
            price: true,
        },
    })

    const rentalsWithBookingSums = await Promise.all(
        rentals.map(async (rental) => {
            const totalNightsSum = await db.booking.aggregate({
                where: {
                    propertyId: rental.id,
                },
                _sum: {
                    totalNights: true,
                }
            })

            const oderTotalSum = await db.booking.aggregate({
                where: {
                    propertyId: rental.id,
                    paymentStatus: true,
                },
                _sum: {
                    orderTotal: true,
                },
            })
            return {
                ...rental,
                totalNightsSum: totalNightsSum._sum.totalNights,
                orderTotalSum: oderTotalSum._sum.orderTotal,
            }
        })
    )
    return rentalsWithBookingSums
}

export async function deleteRentalAction(prevState: { propertyId: string }) {
    const { propertyId } = prevState
    const user = await getAuthUser()

    try {
        await db.property.delete({
            where: {
                id: propertyId,
                profileId: user.id,
            }
        })
        revalidatePath('/rentals')
        return { message: 'Rental deleted succefully' }
    } catch (error) {
        return renderError(error)
    }
}

//_sum 앞에 붙은 _는 Prisma의 집계 결과를 반환할 때 사용하는 구분자로, 집계된 값을 명확히 구분하기 위한 것입니다. aggregate 쿼리에서 합계를 구할 때 sum 연산을 사용할 경우, 그 결과는 항상 _sum 객체 안에 포함됩니다.

export const fetchRentalDetails = async (propertyId: string) => {
    const user = await getAuthUser()

    return db.property.findUnique({
        where: {
            id: propertyId,
            profileId: user.id,
        },
    })
}

export const updatePropertyAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {

    const user = await getAuthUser()
    const propertyId = formData.get('id') as string

    try {
        const rawData = Object.fromEntries(formData)
        const validatedFields = validateWithZodSchema(propertySchema, rawData)
        await db.property.update({
            where: {
                id: propertyId,
                profileId: user.id
            },
            data: {
                ...validatedFields,
            },
        })
        revalidatePath('/rentals/${propertyId}/edit')
        return { message: 'Update Successful' }
    } catch (error) {
        return renderError(error)
    }
}

export const updatePropertyImageAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {

    const user = await getAuthUser()
    const propertyId = formData.get('id') as string

    try {
        const image = formData.get('image') as File;
        const validateFields = validateWithZodSchema(imageSchema, { image })
        const fullPath = await uploadImage(validateFields.image);

        await db.property.update({
            where: {
                id: propertyId,
                profileId: user.id,
            },
            data: {
                image: fullPath,
            },
        })
        revalidatePath(`/rentals/${propertyId}/edit`)
        return { message: 'Property Image Updated Successful' }
    } catch (error) {
        return renderError(error)
    }
}


//Fetch Reservations

export const fetchReservations = async () => {
    const user = await getAuthUser()
    const reservations = await db.booking.findMany({
        where: {
            property: {
                profileId: user.id,
            },
            paymentStatus: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            property: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    country: true,
                },
            },
        },
    })
    return reservations
}

//Admin user -fetch stats

const getAdminUser = async () => {
    const user = await getAuthUser()
    if (user.id !== process.env.ADMIN_USER_ID) redirect('/')
    return user;
}

export const fetchStats = async () => {
    await getAdminUser()

    const userCount = await db.profile.count()
    const propertyCount = await db.property.count()
    const bookingsCount = await db.booking.count(
        {
            where: {
                paymentStatus: true,
            }
        }
    )

    return {
        userCount,
        propertyCount,
        bookingsCount,
    }
}
/*
export const fetchChartsData = async () => {
    await getAdminUser()
    const date = new Date()
    date.setMonth(date.getMonth() - 6)
    const sixMonthsAgo = date;

    const bookings = await db.booking.findMany({
        where: {
            createdAt: {
                gte: sixMonthsAgo,
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    })
    const bookingsPerMonth = bookings.reduce((total, current) => {
        const createAt = new Date(current.createdAt)
        const date = formatDate(createAt, true)
        const existingEntry = total.find((entry) => entry.date === date)
        if (existingEntry) {
            existingEntry.count += 1
        } else {
            total.push({ date, count: 1 })
        }
        return total
    }, [] as Array<{ date: string, count: number }>)
    return bookingsPerMonth;
}
    */