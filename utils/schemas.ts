import * as z from 'zod'
import { ZodSchema } from 'zod'

type Profile = {
    firstName: string;
    lastName: string;
    userName: string;
  }

export const profileSchema : ZodSchema<Profile> = z.object ({
    firstName:z.string().min(2), 
    lastName:z.string().min(2), 
    userName:z.string().min(2),
})