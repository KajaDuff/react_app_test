import React, {useState} from 'react'
import { Table, Button } from 'reactstrap';
import ModalClusterCorrection from './modalClusterCorrection'

import { baseURL } from '../_helpers/base_url'

function ClusterTable(props) {

  const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))
  const confirmItem = (item) => {
    //event.preventDefault()
    let confirm = window.confirm('Do you want to confirm assigned cluster?')
    const controller = new AbortController();
    const { signal } = controller;
    if (confirm) {
      fetch(`${baseURL}/update/cluster`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${authToken}`
        },
        body: JSON.stringify({
          column_id: item.column_id,
          category: item.category,
          assigned_category: item.category,
          user_category: item.category,
        })
      }, { signal })
        .then(console.log('authToken', `${authToken}`))
        .then(response => { console.log('confirmCluster completed', `${baseURL}/update/cluster`) })
        .catch(err => console.log(err))
        //.then(setTimeout(() => controller.abort(), 2000))
        .then(controller.abort())
        .then(setTimeout(() => window.location.reload(false), 1000))
      //.then(window.location.reload(false)) //skus prerobit cez setState
    }
  }

  const items = props.items.map((item, index) => {
    let button = ''
    let title = ''
    let condition = item.user_category

    if (condition === null) {
      title = 'Confirm'
      button = <Button
        color="warning"
        onClick={() => confirmItem(item)}
        style={{
          float: "left", width: "95px", opacity: '.65',
          color: 'white'
        }}>{title}
      </Button>

    } else {
      title = 'Approved'
      button = <Button
        color="success"
        disabled={true}
        style={{ float: "left", marginRight: "10px", width: "95px" }}>{title}
      </Button>

    }

    return (
      <tr key={index} >
        <th scope="row"
          style={{ width: '100px' }}>{item.column_id} </th>
        <td style={{ width: '300px' }}>{item.category}</td>
        <td style={{ width: '300px' }}></td>
        <td style={{ width: '300px' }}>{item.category}</td>
        <td>
          <div style={{ width: "300px" }}>
            <ModalClusterCorrection
              buttonLabel="Edit"
              page='columnView'
              item={item} updateState={props.updateState} />
            {' '}
            {button}
          </div>
        </td>
      </tr>
    )
  })

  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cluster</th>
          <th></th>
          <th>Assigned Cluster</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items}
      </tbody>
    </Table>
  )
}

export default ClusterTable