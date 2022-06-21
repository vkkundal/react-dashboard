import React from "react"
import { Paper } from "../paper/paper"
import Spinner from "../spinner/spinner"
import { HiOutlineChevronLeft } from "react-icons/hi"
import { HiOutlineChevronRight } from "react-icons/hi"

export const Table = ({
    children,
    title,
    loading = false,
    button,
    pagesnext,
    pagesprevious,
    pagination,
    pageNo,
    content,
}: {
    children?: React.ReactNode
    title: string
    button?: React.ReactElement
    loading?: boolean
    pagesnext?: () => void
    pagesprevious?: () => void
    pagination?: boolean
    pageNo?: number
    content?: React.ReactNode
}) => {
    return (
        <Paper className="mt-5">
            <div className="table-title d-flex align-items-center justify-content-between">
                <span>{title}</span>
                <span>{button}</span>
            </div>
            {loading ? (
                <div className="d-flex py-4 justify-content-center">
                    <Spinner color="#333" />
                </div>
            ) : content ? (
                content
            ) : (
                <div className="table-wrapper">
                    <table className="table">{children}</table>
                </div>
            )}

            {pagination && (
                <div className="table-footer d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <button
                            className="nextpage pagination mx-3"
                            onClick={pagesprevious}
                        >
                            <HiOutlineChevronLeft />
                        </button>
                        {pageNo}
                        <button className="nextpage mx-3" onClick={pagesnext}>
                            <HiOutlineChevronRight />
                        </button>
                    </div>
                </div>
            )}
        </Paper>
    )
}
