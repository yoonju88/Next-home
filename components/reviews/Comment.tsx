'use client'
import { useState } from "react"
import { Button } from "../ui/button"

function Comment({ comment }: { comment: string }) {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }
    const longComment = comment.length > 100
    const displayComment = longComment && !isExpanded ? `${comment.slice(0, 100)}...` : comment
    return (
        <div>
            <p className='text-sm'>{displayComment}</p>
            {longComment && (
                <Button
                    variant='link'
                    className='pl-0 text-muted-foreground'
                    onClick={toggleExpanded}
                >
                    {isExpanded ? 'show Less' : 'Show More'}
                </Button>
            )}
        </div>
    )
}

export default Comment
