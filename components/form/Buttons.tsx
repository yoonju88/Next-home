'use client'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { LuTrash2, LuPenSquare } from 'react-icons/lu';

type btnSize = 'default' | 'lg' | 'sm'
type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
}

export default function SubmitButton({
  className = '',
  text = 'submit',
  size = 'lg',
}: SubmitButtonProps) {

  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      disabled={pending}
      className={`capitalize ${className}`}
      size={size}
    >
      {pending ?
        (
          <>
            <ReloadIcon className='mr-2 h-4 w-4 animte-spin' />
            Please wait...
          </>) : (
          text
        )
      }
    </Button>
  )
}

export const CardSignInButton = () => {
  return (
    <SignInButton mode='modal'>
      <Button
        type='button'
        size='icon'
        variant='outline'
        className='p-2 cursor-pointer'
        asChild
      >
        <FaRegHeart />
      </Button>
    </SignInButton>

  )
}

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      size='icon'
      variant='outline'
      className='p-2 cursor-pointer'
    >
      {pending ? (
        <ReloadIcon className='animate-spin' />
      ) : isFavorite ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </Button>
  )
}

type actionType = 'edit' | 'delete';

export const IconButton = ({ actionType }: { actionType: actionType }) => {
  const { pending } = useFormStatus()

  const renderIcon = () => {
    switch (actionType) {
      case 'edit':
        return <LuPenSquare />
      case 'delete':
        return <LuTrash2 />
      default:
        const never: never = actionType;
        throw new Error(`Invalide action type: ${never}`)
      // never 타입을 사용하는 이유는, actionType이 'edit'나 'delete' 외의 다른 값을 가질 경우를 방지
      //'edit'와 'delete' 외에 다른 값이 들어오는 것을 원치 않으므로, default 케이스에서 never 타입을 사용하여 다른 값이 들어오면 오류가 발생하도록 처리
    }
  }
  return (
    <Button
      type='submit'
      size='icon'
      variant='link'
      className='p-2 cursor-pointer'
    >
      {pending ? <ReloadIcon className='animate-spin' /> : renderIcon()}
    </Button>
  )
}


