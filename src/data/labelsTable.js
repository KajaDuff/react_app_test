import React, { useState } from 'react'
import { Table, Button } from 'reactstrap';
import ModalLabelCorrection from './modalLabelCorrection'
import { baseURL } from '../_helpers/base_url'

function LabelsTable(props) {

  const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))

  const confirmItem = (item) => {
    //event.preventDefault()
    let confirm = window.confirm('Do you want to confirm assigned label?')
    const controller = new AbortController();
    const { signal } = controller;
    if (confirm) {
      fetch(`${baseURL}/update/label`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${authToken}`
        },
        body: JSON.stringify({
          column_id: item.column_id,
          label: item.label,
          probability: item.probability,
          assigned_label: item.label,
          user_label: item.label,
        })
      }, { signal })
        .then(console.log('authToken', `${authToken}`))
        .then(response => { console.log('confirmLabel completed', `${baseURL}/update/label`) })
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
    let condition = item.user_label

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
        disabled = {true}
        style={{ float: "left", marginRight: "10px", width: "95px" }}>{title}
      </Button>

    }

    return (
      <tr key={index} >

        <th scope="row"
          style={{ width: '100px' }}>{item.column_id}</th>

        <td style={{ width: '300px' }}>{item.label}</td>
        {(item.probability === 'NA' |
          item.probability === undefined) ? (
            <td style={{ width: '300px' }}>{item.probability}</td>
          ) : (
            <td style={{ width: '300px' }}>{Math.round(item.probability * 100) + '%'}</td>
          )}

        <td style={{ width: '300px' }}>{item.assigned_label}</td>
        <td>
          <div style={{ width: "300px" }}>
            <ModalLabelCorrection
              buttonLabel="Edit"
              item={item}
              updateState={props.updateState}
              page='columnView' />
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
          <th>Label</th>
          <th>Probability</th>
          <th>Assigned Label</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items}
      </tbody>

    </Table>
  )
}

export default LabelsTable