'use client';

import { usePathname } from 'next/navigation';
import FormContainer from '../form/FormContainer';
import { toggleFavoriteAction } from '@/utils/action';
import { CardSubmitButton } from '../form/Buttons';

type FavoriteToggleFormProps = {
    propertyId: string;
    favoriteId: string | null;
}

async function FavortieToggleForm({ propertyId, favoriteId, }: FavoriteToggleFormProps) {
    const pathname = usePathname()
    const toggleAction = toggleFavoriteAction.bind(null, {
        propertyId,
        favoriteId,
        pathname,
    });

    return (
        <FormContainer action={toggleAction}>
            <CardSubmitButton isFavorite={favoriteId ? true : false} />
        </FormContainer>
    )
}

export default FavortieToggleForm