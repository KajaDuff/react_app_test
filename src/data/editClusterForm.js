import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { baseURL } from '../_helpers/base_url'

function EditClusterForm(props) {

  const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))

  const [form, setValues] = useState({
    id: 0,
    column_id: props.item.column_id,
    column_name: props.item.column_name,
    category: props.item.category,
    assigned_category: props.item.assigned_category,
    user_category: props.item.assigned_category
  })

  const onChange = e => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submitFormEdit = e => {
    e.preventDefault()
    const controller = new AbortController();
    const { signal } = controller;
    fetch(`${baseURL}/update/cluster`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${authToken}`
      },
      body: JSON.stringify({
        column_id: form.column_id,
        category: form.category,
        assigned_category: form.assigned_category,
        user_category: form.user_category,
      })
    }, { signal })
      .then(console.log('authToken', `${authToken}`))
      .then(response => response.json())
      .then(response => { console.log('updateCluster completed', `${baseURL}/update/cluster`) })
      .catch(err => console.log(err))
      .then(controller.abort())
      //.then(props.toggle())
      .then(setTimeout(() => window.location.reload(false), 1000))
  }

  useEffect(() => {
    if (props.item) {
      const { column_id, column_name, category, assigned_category, user_category } = props.item
      setValues({ column_id, column_name, category, assigned_category, user_category })
    }
  }, [props.item])

  console.log(props)

  return (
    <Form
      onSubmit={submitFormEdit} >
      {props.page === 'tableView' ?
        (
          <Alert color="danger" style={{ fontSize: '14px' }}>
            <p style={{ textAlign: 'center' }}>
              <b >Important information:</b>
            </p>
            <p>
              alert text</p>
          </Alert>
        ) :
        (<Alert color="danger" style={{ fontSize: '14px' }}>
          <p style={{ textAlign: 'center' }}>
            <b >Important information:</b>
          </p>

          <p>alert text</p>
        </Alert>)}
      <FormGroup>
        <Label for="column_id"><b>Column Name:</b> {form.column_name}</Label>
      </FormGroup>
      <FormGroup>
        <Label for="label"><b>Category:</b> {form.category}</Label>
      </FormGroup>
      <FormGroup>
        <Label for="assigned_label"><b>Assigned Category:</b> {form.assigned_category}</Label>
      </FormGroup>
      <FormGroup>
        <Label for="user_category"><b>Correct Label:</b></Label>
        <Input type="select" name="user_category" id="user_category"
          onChange={onChange} value={form.user_category === null ? form.category : form.user_category}>
          <option value="personal_data">Personal Data</option>
          <option value="location_data">Location Data</option>
          <option value="time_data">Time Data</option>
          <option value="other_data">Other Data</option>
        </Input>
      </FormGroup>
      <Button>Submit</Button>
    </Form>
  )
}

export default EditClusterForm