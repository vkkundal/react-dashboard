import React, { useEffect, useState } from "react"
import AdminLayout from "../../components/adminlayout/adminlayout"
import { Paper } from "../../components/paper/paper"
import { Table } from "../../components/table/table"
import { BsEye } from "react-icons/bs"
import { ICustomerData } from "../../helpers/interfaces"
import { navigate } from "gatsby"
import withAuth from "../../components/withAuth/withAuth"
import { useToasts } from "react-toast-notifications"
import { useGet } from "hooks/useGet"
import FilterInputGroup from "components/filterinputgroup/filterinputgroup"



const Customer = () => {
    const { isReady, data, refetchData } = useGet<
    ICustomerData[],
        {
            page: number
            last_name: string
            first_name: string
            mobile: number
        }
    >(`/api/v2/customers`, [], [null])

    const [pagenumber, setPagenumber] = useState(1)

    const handleNext = () => {
        setPagenumber(pagenumber + 1)
    }

    const handlePrev = () => {
        if (pagenumber === 1) {
            return
        }
        setPagenumber(pagenumber - 1)
    }

    const { addToast } = useToasts()
    const [firstname, setFirstname] : [any , any] = useState()

    const [lastname , setLastname] :  [any , any] = useState()
    const [mobile , setMobile] :  [any , any] = useState()

    useEffect(() => {
        refetchData({ page: pagenumber , first_name : firstname ? firstname : undefined ,  last_name : lastname ? lastname : undefined , mobile : mobile ? mobile : undefined   }).then(data => {
            if (data && data.length === 0) {
                addToast("No more Customers", {
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
        <AdminLayout title="Customer">
            <Paper className="mt-5 p-4">
                <div className="filter">
                    <h3 className="font-weight-normal">Filters</h3>
                    <button
                        className="btn filter-search"
                        onClick={() => {
                            setPagenumber(1)
                            refetchData({  page: pagenumber , first_name : firstname ? firstname : undefined ,  last_name : lastname ? lastname : undefined , mobile : mobile ? mobile : undefined   })
                        }}
                    >
                        Go
                    </button>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        
                        <FilterInputGroup
                                type="text"
                                label="First name"
                                placeholder="Enter First Name"
                                onChange={e => {
                                    setFirstname(e.target.value)
                                }}
                            />
                    </div>
                    <div className="col-md-4">
                        
                          <FilterInputGroup
                                type="text"
                                label="Last name"
                                placeholder="Enter Last Name"
                                onChange={e => {
                                    setLastname(e.target.value)
                                }}
                            />
                    </div>
                    <div className="col-md-4">
                        
                        <FilterInputGroup
                                type="tel"
                                label="Mobile"
                                placeholder="Enter Mobile Number"
                                onChange={e => {
                                    setMobile(e.target.value)
                                }}
                            />
                    </div>
                </div>
            </Paper>
            <Table loading={!isReady} title="Latest Customers" pagesnext={handleNext} pagesprevious={handlePrev} pagination={true} pageNo={pagenumber}>
                <thead className="table-head">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Roles</th>
                        <th scope="col">Balance</th>
                        <th scope="col">Status</th>
                        <th scope="col">View</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => {
                        return (
                            <tr key={item.user.id}>
                                <td scope="row">{item.user.id}</td>
                                <td>{item.user.first_name}</td>
                                <td>{item.user.last_name}</td>
                                <td>{item.user.mobile}</td>
                                <td>{item.role.name}</td>
                                <td>{item.customer.balance}</td>
                                <td>
                                    {item.user.is_active
                                        ? "Active"
                                        : "Disabled"}
                                </td>
                                <td
                                    onClick={e => {
                                        navigate(
                                            `/dashboard/customerdetail?id=${item.user.id}`
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
    )
}

export default withAuth(Customer)
