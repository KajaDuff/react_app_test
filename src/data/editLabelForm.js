import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { baseURL } from '../_helpers/base_url'


function AddEditLabelForm(props) {

  const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))

  const [form, setValues] = useState({
    id: 0,
    column_id: props.item.column_id,
    column_name: props.item.column_name,
    label: props.item.label,
    probability: props.item.probability,
    assigned_label: props.item.assigned_label,
    user_label: props.item.assigned_label
  })

  console.log('propr', props)
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
    fetch(`${baseURL}/update/label`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${authToken}`
      },
      body: JSON.stringify({
        column_id: form.column_id,
        label: form.label,
        probability: form.probability,
        assigned_label: form.assigned_label,
        user_label: form.user_label,
      })
    }, { signal })
      .then(console.log('authToken', `${authToken}`))
      .then(response => response.json())
      .then(response => { console.log('updateCluster completed', `${baseURL}/update/cluster`) })
      //.then(props.toggle())
      .catch(err => console.log(err))
      .then(controller.abort())
      .then(setTimeout(() => window.location.reload(false), 1000))
  }

  useEffect(() => {
    if (props.item) {
      const { column_id, column_name, label, probability, assigned_label, user_label } = props.item
      setValues({ column_id, column_name, label, probability, assigned_label, user_label })
    }
  }, [props.item])

  return (
    <Form
      onSubmit={submitFormEdit} >
      {props.page === 'tableView' ?
        (
          <Alert color="danger" style={{ fontSize: '14px' }}>
            <p style={{ textAlign: 'center' }}>
              <b >Important information:</b>
            </p>

            <p>alert text</p>
          </Alert>
        ) :
        (<Alert color="danger" style={{ fontSize: '14px' }}>
          <p style={{ textAlign: 'center' }}>
            <b >Important information:</b>
          </p>
          <p>
            Alert text
          </p>
        </Alert>)}

      <FormGroup>
        <Label for="column_id"><b>Column Name:</b> {form.column_name}</Label>
      </FormGroup>
      <FormGroup>
        <Label for="label"><b>Label:</b> {form.label}</Label>
      </FormGroup>
      <FormGroup>
        <Label for="probability"><b>Probability:</b> {(Math.round(form.probability * 100)) + ' %'}</Label>
      </FormGroup>
      <FormGroup>
        <Label for="assigned_label"><b>Assigned label:</b> {form.assigned_label}</Label>
      </FormGroup>
      <FormGroup>
        <Label for="user_label"><b>Correct Label:</b></Label>
        <Input type="select" name="user_label" id="user_label"
          onChange={onChange} value={form.user_label === null ? form.label : form.user_label}>
          <option value="ADDRESS">Address</option>
          <option value="AGE">Age</option>
          <option value="CITY">City</option>
          <option value="COUNTRY">Country</option>
          <option value="DATETIME">Datetime</option>
          <option value="DAY">Day</option>
          <option value="DESCRIPTION">Description</option>
          <option value="EMAIL">Email</option>
          <option value="LANGUAGE">Language</option>
          <option value="LOCATION">Location</option>
          <option value="NAME">Name</option>
          <option value="SEX">Sex</option>
          <option value="STATE">State</option>
          <option value="TELEPHONE">Phone number</option>
          <option value="URL">URL</option>
          <option value="YEAR">Year</option>
          <option value="ZIPCODE">ZIP code</option>
        </Input>
      </FormGroup>
      <Button>Submit</Button>
    </Form>
  )
}

export default AddEditLabelForm