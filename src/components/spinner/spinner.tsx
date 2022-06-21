import React from "react"

export default function Spinner({color = "#fff"}) {
    return <div className="position-relative">
        <div style={{backgroundColor: color}} className="spinner-1" />
        <div style={{backgroundColor: color}} className="spinner-2" />
        <div style={{backgroundColor: color}} className="spinner-3" />
    </div>
}
