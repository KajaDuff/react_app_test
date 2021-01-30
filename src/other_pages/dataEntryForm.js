import React, { useEffect, useState } from 'react'
import {
    Link, useHistory,
} from "react-router-dom";
import axios from 'axios';
import { Row, Button, Form, FormGroup, Label, Input, Col, Alert } from 'reactstrap'


import '../styles/form.css';
import ErrorBoundary from '../_components/ErrorBoundary';
import Header from '../_components/header';
import Navbar from '../_components/navbar'
import { baseURL } from '../_helpers/base_url'
import Foot from '../_components/footer'


function ConnectionStatus(props) {
    if (props.status === 'PENDING') {
        return (<Alert color='primary' style={{ textAlign: 'center' }}>Last connection status:{' '}{props.status}...</Alert>)
    }
    else if (props.status === 'SUCCESS') {
        return (
            <div>
                <Row>
                    <Col sm={{ size: 12 }}>
                        <Alert color='success' style={{ textAlign: 'center' }}>Last connection status:{' '}{props.status}</Alert>
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ size: 4, offset: 4 }}>
                        <Link to='/data/models/MSSQL'><Button outline color='secondary' size="lg">Show Results</Button></Link>
                    </Col>
                </Row>
            </div>
        )
    }
    return (<Alert color='danger' style={{ textAlign: 'center' }}>Last connection status:{' '}{props.status}</Alert>)
}


function BackButton({ children }) {
    let history = useHistory()
    return (
        <i className="fas fa-angle-double-left" onClick={() => history.goBack()}></i>
    )
}
export default function DatabaseConnectionForm() {

    const [db_host, setDb_host] = useState("") 
    const [db_name, setDb_name] = useState("") 
    const [db_user, setDb_user] = useState("") 
    const [db_pwd, setDb_pwd] = useState("") 
    const [db_source, setDb_source] = useState('MSSQL')
    const [p1, setP1] = useState({})
    const [p2, setP2] = useState({})
    const [TaskURL, setTaskURL] = useState(localStorage.getItem('TaskURL'))
    const [TaskState, setTaskState] = useState(localStorage.getItem('TaskState'))
    const [TaskID, setTaskID] = useState(localStorage.getItem('TaskID'))


    const handleSubmit = event => {
        event.preventDefault();
        const authToken = sessionStorage.getItem('AuthToken')
        console.log('authToken', `${authToken}`)
        async function APIs() {
            // Make first request
            const [firstResponse] = await Promise.all([
                axios({
                    method: 'post',
                    url: baseURL + `/start`,
                    headers: { 'Authorization': `${authToken}` },
                    data: {
                        db_host: db_host,
                        db_name: db_name,
                        db_user: db_user,
                        db_pwd: db_pwd,
                        db_source: db_source
                    }
                })
            ]);
            
            localStorage.setItem('TaskID', firstResponse.data.sent)

            // Make second request using response from the first one
            const secondResponse = await axios.get(baseURL + `/status/` + firstResponse.data.sent);

            localStorage.setItem('TaskState', secondResponse.data.state)
            localStorage.setItem('TaskURL', baseURL + `/status/` + firstResponse.data.sent)
            // Update state at once with both responses
            setP1(firstResponse.data)
            setP2(secondResponse.data)
            setTaskID(firstResponse.data.sent)
            setTaskState(secondResponse.data.state)
            setTaskURL(baseURL + `/status/` + firstResponse.data.sent) // call the function on Form submit
        }
        APIs()
    }

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('This will run every second!');
            console.log(TaskState)
            console.log(TaskID)
            if (TaskState === 'PENDING') {
                console.log('accesed url', TaskURL)
                fetch(TaskURL, {
                    method: "GET",
                    dataType: "JSON",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    }
                })
                    .then((resp) => {
                        return resp.json()
                    })
                    .then((data) => {
                        setTaskState(data.state)
                        localStorage.setItem('TaskState', data.state)
                    })
                    .then(console.log('taske2', TaskState))
                    .catch((error) => {
                        console.log(error, "catch the hoop")
                    })
            }
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (

        <>
            <header className='sticky-wrapper sticky'>
                <Header />
                <Navbar />
                <Row className="sticky-inner">
                    <div className='secondline'>
                        <BackButton />
                        <Link id='home' to="/"><i className="fas fa-home"></i></Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`/data_entry`}>Data Entry</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`/data_entry/microsoft`}>MSSQL</Link>
                    </div>
                </Row>
            </header>
            <main className='content'>
                <ErrorBoundary>
                    <Row>
                        <Col sm={{ size: 4, offset: 1 }}>
                            <i className="fas fa-database" style={{ fontSize: '10rem', margin: '5%' }}></i>
                            <h1 style={{ marginLeft: '9%' }}>Database</h1>
                        </Col>
                        <Col sm={{ size: 4 }}>
                            <Form>
                                <FormGroup>
                                    <Label for='host'>Host</Label>
                                    <Input
                                        type='text'
                                        name='db_host'
                                        id='host'
                                        //value={db_host}
                                        onChange={e => {
                                            setDb_host(e.target.value);
                                        }}
                                    ></Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for='name'>Database Name</Label>
                                    <Input
                                        type='text'
                                        name='db_name'
                                        id='name'
                                        //value={db_name}
                                        onChange={e => {
                                            setDb_name(e.target.value);
                                        }}
                                    ></Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for='user'>User Name</Label>
                                    <Input
                                        type='text'
                                        name='db_user'
                                        id='user'
                                        //value={db_user}
                                        onChange={e => {
                                            setDb_user(e.target.value);
                                        }}
                                    ></Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for='pwd'>Password</Label>
                                    <Input
                                        type='password'
                                        name='db_pwd'
                                        id='pwd'
                                        //value={db_pwd}
                                        onChange={e => {
                                            setDb_pwd(e.target.value);
                                        }}
                                    ></Input>
                                </FormGroup>
                                <Button onClick={handleSubmit}>Submit</Button>
                            </Form>
                        </Col>
                    </Row>
                    <br />

                </ErrorBoundary>
                <div >
                    <br />
                    {TaskID ? <div className='status'> <ConnectionStatus status={TaskState} /></div> : null}
                </div>
            </main>
            <Foot />
        </>

    );
}



