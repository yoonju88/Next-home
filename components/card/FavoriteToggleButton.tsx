import { auth } from '@clerk/nextjs/server'
import { CardSignInButton } from "../form/Buttons"
import { fetchFavoriteId } from "@/utils/action"
import FavortieToggleForm from "./FavortieToggleForm"

async function FavoriteToggleButton({ propertyId }: { propertyId: string }) {
    const { userId } = await auth();
    if (!userId) {
        return <CardSignInButton />
    }
    const favoriteId = await fetchFavoriteId({ propertyId })
    return (
        <FavortieToggleForm favoriteId={favoriteId} propertyId={propertyId} />
    )
}

export default FavoriteToggleButton
