import {Input} from '@/components/ui/input'

function NavSearch() {
  return (
    <Input 
      type='text' 
      placeholder='find a property...' 
      className='max-w-xs dark:bg-mute' 
    /> 
  )
}

export default NavSearch
