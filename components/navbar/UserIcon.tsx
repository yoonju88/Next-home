import { LuUser2 } from "react-icons/lu"
import { fetchProfileImage } from "@/utils/action"
import Image from 'next/image'

async function UserIcon() {
  const profileImage = await fetchProfileImage()
  if (profileImage) {
    return (
      <Image src={profileImage} alt='profile image' className="'w-6 h-6 rounded-full object-cover" width={25} height={25} />
    )
  }
  return (
    <LuUser2 className="w-6 h-6 bg-primary rounded-full text-white" />
  )
}
export default UserIcon