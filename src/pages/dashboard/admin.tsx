import React, { useEffect, useState } from "react"
import AdminLayout from "../../components/adminlayout/adminlayout"
import { Paper } from "../../components/paper/paper"
import { Table } from "../../components/table/table"
import { BsEye } from "react-icons/bs"
import { navigate } from "gatsby"
import Adminpopup from "../../components/popup/adminpopup"
import { IAdminDetail } from "../../helpers/interfaces"
import { AiOutlinePlus } from "react-icons/ai"
import withAuth from "../../components/withAuth/withAuth"
import { useToasts } from "react-toast-notifications"
import { useGet } from "hooks/useGet"
import FilterInputGroup from "components/filterinputgroup/filterinputgroup"
import Button from "../../components/button/button"

const Admin = () => {

    
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    
    function gotonextpage() {
    
        setPagenumber(pagenumber + 1)
    }

    function gotopreviouspage() {
        if(pagenumber == 1) return; 
        setPagenumber(pagenumber - 1)
    }

        const [firstname, setFirstname] : [any , any] = useState()
    
        const [lastname , setLastname] :  [any , any] = useState()
        const [mobile , setMobile] :  [any , any] = useState()
        const [email , setEmail] :  [any , any] = useState()
        const { isReady, data, refetchData } = useGet<
        IAdminDetail[],
            {
                page: number
                last_name: string
                first_name: string
                mobile: number
                email : string
                
            }
        >(`/api/v2/admins`, [], [null])
        
        const [pagenumber, setPagenumber] = useState(1)
    
        const { addToast } = useToasts()
        
    
        useEffect(() => {
            refetchData({ page: pagenumber , first_name : firstname ? firstname : undefined ,  last_name : lastname ? lastname : undefined , mobile : mobile ? mobile : undefined ,   email : email ? email : undefined ,  }).then(data => {
                if (data && data.length === 0) {
                    addToast("No more Admins", {
                        autoDismiss: true,
                        appearance: "error",
                    })
                    if(pagenumber == 1) {
                         return;
                    }
                    setPagenumber(pagenumber - 1)
                }
            })
        }, [pagenumber])
    
    return (
        <>
        <AdminLayout title="Admins">
            <div className="mt-5 d-flex justify-content-between align-items-center">
                <Button
                    onClick={() => setIsPopupOpen(true)}
                >
                    <AiOutlinePlus className="plus-icon" />
                    Add
                </Button>
               
            </div>
            {isPopupOpen && (
                <Adminpopup
                    onAdd={refetchData}
                    onClose={() => setIsPopupOpen(false)}
                />
            )}
            <Paper className="mt-5 p-4">
                <div className="filter">
                    <h3 className="font-weight-normal">Filters</h3>
                    <button
                        onClick={() => {
                            setPagenumber(1)
                            refetchData({  page: pagenumber , first_name : firstname ? firstname : undefined ,  last_name : lastname ? lastname : undefined , mobile : mobile ? mobile : undefined , email : email ? email : undefined })
                        }}
                        className="btn filter-search"
                    >
                        Go
                    </button>
                </div>
                <div className="row mt-3 mt-lg-0">
                    <div className="col-md">
                        
                        <FilterInputGroup
                                type="text"
                                label="First name"
                                placeholder="Enter First Name"
                                onChange={e => {
                                    setFirstname(e.target.value)
                                }}
                            />
                    </div>
                    <div className="col-md">
                        
                        <FilterInputGroup
                                type="text"
                                label="Last name"
                                placeholder="Enter Last Name"
                                onChange={e => {
                                    setLastname(e.target.value)
                                }}
                            />
                    </div>
                    <div className="col-md">
                       
                        <FilterInputGroup
                                type="tel"
                                label="Mobile"
                                placeholder="Enter Mobile Number"
                                onChange={e => {
                                    setMobile(e.target.value)
                                }}
                            />
                    </div>
                    <div className="col-md">
                        
                        <FilterInputGroup
                                type="email"
                                label="Email"
                                placeholder="Enter email"
                                onChange={e => {
                                    setEmail(e.target.value)
                                }}
                            />
                    </div>
                </div>
            </Paper>
            
            <Table loading={!isReady} title="Latest Admins" pagesnext={gotonextpage} pagesprevious={gotopreviouspage} pagination={true} pageNo={pagenumber}>
                <colgroup>
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Roles</th>
                        <th scope="col">Email</th>
                        <th scope="col">Status</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody id="adminbody">
                    {data.map((admin  ) => {

                        return (
                            <tr key={admin.user.id}>
                                <td scope="row">{admin.user.id}</td>
                                <td>{admin.user.first_name}</td>
                                <td>{admin.user.last_name}</td>
                                <td>{admin.user.mobile}</td>
                                <td>{admin.role.name}</td>
                                <td>{admin.admin.email}</td>
                                <td>
                                    {admin.user.is_active
                                        ? "Active"
                                        : "Disabled"}
                                </td>
                                <td
                                    onClick={e => {
                                        navigate(
                                            `/dashboard/admindetail?id=${admin.user.id}`
                                        )
                                    }}
                                    className="eye-icon cursor-pointer"
                                >
                                    <BsEye />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            
        </AdminLayout>
        </>
    )
}

export default withAuth(Admin)
