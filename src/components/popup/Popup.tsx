import { Paper } from "@material-ui/core"
import React from "react";

export const Popup = ({
    onClose,
    title,
    children,
}: {
    onClose?: () => void
    title: React.ReactNode
    children: React.ReactNode
}) => {
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-10">
                        <Paper
                            onClick={e => e.stopPropagation()}
                            className="p-5"
                        >
                            <div className="text-center">
                                <h2 className="popup-heading">{title}</h2>
                            </div>
                            {children}
                        </Paper>
                    </div>
                </div>
            </div>
        </div>
    )
}
