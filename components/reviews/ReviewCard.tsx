import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Rating from './Rating'
import Comment from './Comment'
import Image from 'next/image'
type ReviewCardProps = {
    reviewInfo: {
        comment: string;
        rating: number;
        name: string;
        image: string;
    }
    children?: React.ReactNode;
}

function ReviewCard({ reviewInfo, children }: ReviewCardProps) {
    return (
        <Card className='relative'>
            <CardHeader>
                <div className='flex items-center'>
                    <Image
                        src={reviewInfo.image}
                        alt='profile'
                        className='w-12 h-12 rounded-full object-cover'
                        width="120"
                        height="120"
                    />
                    <div className='ml-4'>
                        <h3 className="text-sm font-bold capitalize mb-1">
                            {reviewInfo.name}
                        </h3>
                        <Rating rating={reviewInfo.rating} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Comment comment={reviewInfo.comment} />
            </CardContent>
            {/*delete button here */}
            <div className='absolute top-3 right-3'>{children}</div>
        </Card>
    )
}

export default ReviewCard
