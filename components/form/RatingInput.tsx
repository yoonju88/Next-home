import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

function RatingInput({ name, labelText }: { name: string; labelText?: string; }) {
    const numbers = Array.from({ length: 5 }, (_, i) => {
        const value = i + 1;
        return value.toString() // value를 문자열로 변환하여 반환, 생성되는 배열은 ['1', '2', '3', '4', '5']
    }).reverse(); // 생성된 배열을 뒤집음, 최종 배열은 ['5', '4', '3', '2', '1']

    return (
        <div className='mb-2 max-w-xs'>
            <Label htmlFor={name} className='capitalize'>
                {labelText || name}
            </Label>
            <Select defaultValue={numbers[0]} name={name} required>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {numbers.map((number) => {
                        return (
                            <SelectItem key={number} value={number}>
                                {number}
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>
        </div>
    )
}

export default RatingInput