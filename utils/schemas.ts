import * as z from 'zod'
import { ZodSchema } from 'zod'

export const profileSchema = z.object({
    //firstName: z.string().max(5, {message: 'max length is 5'})
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
    username: z.string().min(2, { message: 'User name must be at least 2 characters' }),
})

//  Zod 라이브러리를 사용하여 데이터 유효성을 검사하는 함수 validateWithZodSchema를 정의
// 이 함수는 제네릭 타입 <T>를 사용하여 Zod 스키마와 데이터를 인수로 받습니다.
// schema는 Zod 스키마를 나타내고, data는 검증할 데이터입니다. 데이터는 unknown 타입으로 지정되어 유연성을 제공합니다.
// 반환 타입은 T, 즉 유효성 검사를 통과한 데이터의 타입입니다.

export function validateWithZodSchema<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data) // safeParse 메서드는 주어진 데이터를 스키마에 따라 안전하게 검증

    if (!result.success) {
        const errors = result.error.errors.map((error) => error.message)
        throw new Error(errors.join(','))
    }
    return result.data // 검증이 성공한 경우, result.data를 반환합니다. 이 데이터는 주어진 Zod 스키마를 통과한 유효한 데이터입니다.
}

// 왜 이렇게 폼을 확인하는가?

// 	1.	안전성:
// 	•	safeParse 메서드를 사용하여 데이터의 유효성을 검사함으로써, 애플리케이션의 다른 부분에서 오류가 발생할 가능성을 줄입니다. 잘못된 데이터가 시스템에 들어오는 것을 방지합니다.
// 	2.	오류 메시지 제공:
// 	•	사용자가 폼을 제출할 때 유효성 검사 오류를 쉽게 식별할 수 있도록 명확한 오류 메시지를 제공합니다. 이는 사용자 경험을 개선합니다.
// 	3.	타입 안전성:
// 	•	제네릭 타입을 사용하여 Zod 스키마에서 정의한 타입이 데이터의 반환 타입으로 사용됩니다. 이를 통해 코드의 타입 안전성을 보장할 수 있습니다.
// 	4.	간단한 재사용:
// 	•	이 함수는 다양한 Zod 스키마와 데이터에 대해 유효성 검사를 수행할 수 있도록 설계되었습니다. 따라서 코드 중복을 줄이고, 유효성 검사 로직을 중앙 집중화할 수 있습니다.

export const imageSchema = z.object({
    image: validateFile(),
})

function validateFile() {
    const maxUploadSize = 1024 * 1024;
    const acceptedFileTypes = ['image/']
    return z.instanceof(File)
        .refine((file) => {
            return !file || file.size <= maxUploadSize
        }, 'File size must be less than 1 MB')
        .refine((file) => {
            return !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
        }, 'File must be an image')
}

export const propertySchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'name must be at least 2 characters.',
        })
        .max(100, {
            message: 'name must be less than 100 characters.',
        }),
    tagline: z
        .string()
        .min(2, {
            message: 'tagline must be at least 2 characters.',
        })
        .max(100, {
            message: 'tagline must be less than 100 characters.',
        }),
    price: z.coerce.number().int().min(0, {
        message: 'price must be a positive number.',
    }),
    category: z.string(),
    description: z.string().refine(
        (description) => {
            const wordCount = description.split(' ').length;
            return wordCount >= 10 && wordCount <= 1000;
        },
        {
            message: 'description must be between 10 and 1000 words.',
        }
    ),
    country: z.string(),
    guests: z.coerce.number().int().min(0, {
        message: 'guest amount must be a positive number.',
    }),
    bedrooms: z.coerce.number().int().min(0, {
        message: 'bedrooms amount must be a positive number.',
    }),
    beds: z.coerce.number().int().min(0, {
        message: 'beds amount must be a positive number.',
    }),
    baths: z.coerce.number().int().min(0, {
        message: 'bahts amount must be a positive number.',
    }),
    amenities: z.string(),
});