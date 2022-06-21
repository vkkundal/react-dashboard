import React from "react"
import { IDevice } from "../../helpers/interfaces"
import { Table } from "../table/table"

export const DevicesTable = ({  devices }: {  devices: IDevice[] }) => {
    
 
    return (
        <Table  title="Devices">
            <thead className="table-head">
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">App</th>
                    <th scope="col">Name</th>
                    <th scope="col">Model</th>
                    <th scope="col">Platform</th>
                    <th scope="col">Version</th>
                </tr>
            </thead>
            <tbody>
                {devices.map(item => {
                    if(!item){
                        return null;
                    }
                    return (
                        <tr key={item.id}>
                            <td scope="row"> {item.id} </td>
                            <td>{item.app_id}</td>
                            <td>{item.name}</td>
                            <td>{item.model}</td>
                            <td>{item.platform}</td>
                            <td>{item.version}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}
