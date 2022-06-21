import React from "react"
import { Paper } from "../paper/paper"

type ICardProps = {
    value: string
    title: string
    className: string
}

export const Card = (props: ICardProps) => {
    const { title, value, className } = props

    return (
        <Paper className="inner">
            <div className={`inner-details ${className}`}>
                <p>{value}</p>
                <span>{title}</span>
            </div>
        </Paper>
    )
}
