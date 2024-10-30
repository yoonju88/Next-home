'use client'
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic'

export const DynamicMap = dynamic(() => import('./PropertyMap'), {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
});