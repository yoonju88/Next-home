'use client'

import { useActionState } from "react"
import { useEffect } from "react"
import { useToast } from '@/hooks/use-toast'
import { actionFunction } from '@/utils/types'

const initialState = {
    message: '',
}

export default function FormContainer({
    action,
    children,

}: {
    action: actionFunction,
    children: React.ReactNode
}) {
    const [state, formAction] = useActionState(action, initialState)
    const { toast } = useToast()

    useEffect(() => {
        if (state.message) {
            toast({ description: state.message })
        }
    }, [state, toast])

    return (
        <form action={formAction}>{children}</form>
    )
}