import React from "react"
import AdminLayout from "../../components/adminlayout/adminlayout"
import line from "../../images/dashboardlines/Blue-Line.svg"
import Orangeline from "../../images/dashboardlines/orange-line.svg"
import Greenline from "../../images/dashboardlines/green-line.svg"
import { FaOpencart } from "react-icons/fa"
import { RiLuggageCartLine } from "react-icons/ri"
import { MdDone } from "react-icons/md"
import { Card } from "../../components/card/card"
import withAuth from "../../components/withAuth/withAuth"

const Lines = () => (
    <>
        <img src={line} />
    </>
)
const Orange = () => (
    <>
        <img src={Orangeline} />
    </>
)

const Green = () => (
    <>
        <img src={Greenline} />
    </>
)

const Dashboard = () => {

    


    return (
        <AdminLayout title="Dashboard">
        

            <div className="row">
                <div className="col-md-4">
                    <div className="inner">
                        <div className="inner-content">
                            <div className="inner-icon">
                                <FaOpencart></FaOpencart>
                            </div>
                            <div className="inner-heading">
                                <h4>12</h4>
                            </div>
                            <div className="inner-text">
                                <p>Orders Today</p>
                                <span>Today</span>
                            </div>
                        </div>
                        <div className="inner-line">
                            <Lines></Lines>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="inner">
                        <div className="inner-content">
                            <div className="inner-icon orange">
                                <RiLuggageCartLine></RiLuggageCartLine>
                            </div>
                            <div className="inner-heading">
                                <h4>26</h4>
                            </div>
                            <div className="inner-text">
                                <p>Current Orders</p>
                                <span>Current</span>
                            </div>
                        </div>
                        <div className="inner-line">
                            <Orange></Orange>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="inner">
                        <div className="inner-content">
                            <div className="inner-icon green">
                                <MdDone />
                            </div>
                            <div className="inner-heading">
                                <h4>223</h4>
                            </div>
                            <div className="inner-text">
                                <p>Canceled Orders</p>
                                <span>Completed</span>
                            </div>
                        </div>
                        <div className="inner-line">
                            <Green></Green>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <Card
                        value={"22"}
                        title="Accepted Orders"
                        className="layout-2"
                    />
                </div>
                <div className="col-md-4">
                    <Card
                        value={"57"}
                        title="Total Served Orders"
                        className="layout-2 orange"
                    />
                </div>
                <div className="col-md-4">
                    <Card
                        value={"Ali Khan"}
                        title="Top Provider"
                        className="layout-2 green"
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-4">
                    <div className="inner">
                        <div className="inner-details layout-2 pink">
                            <p>Battrey</p>
                            <span>Most Bought Items</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="inner">
                        <div className="inner-details layout-2 purple">
                            <p>Car Wash</p>
                            <span>Most Bought Services</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="inner">
                        <div className="inner-details layout-2 red">
                            <p>13</p>
                            <span>Canceled Orders</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default withAuth(Dashboard)
