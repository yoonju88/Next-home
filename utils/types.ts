export type actionFunction =(
    PrevState:any, 
    formData:FormData
) => Promise<{ message: string }>