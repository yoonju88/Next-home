import { Label } from '../ui/label';
import { Input } from '../ui/input';

const name = 'price'
type PriceInputProps = {
    defaultValue?: number;
}

function PriceInput({ defaultValue }: PriceInputProps) {
    return (
        <div className='mb-2'>
            <Label htmlFor='price' className='capitalize'>
                Price ($)
            </Label>
            <Input
                id={name}
                type='number'
                name={name}
                min={0}
                defaultValue={defaultValue || 100}
                required
            />
        </div>
    )
}

export default PriceInput
