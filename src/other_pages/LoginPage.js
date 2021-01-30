import React, { useEffect, useState } from 'react'
import { Card, CardBody, Row, Alert, Button, Form, FormGroup, Input, Label } from 'reactstrap'
import { Link, Redirect, useHistory } from 'react-router-dom'
import axios from 'axios';

import sha512 from 'crypto-js/sha512';

import { useAuth } from "../_context/auth";
import { baseURL } from '../_helpers/base_url'

import '../styles/homepage.css';



export default function LoginPage() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [username, setUserName] = useState("Tester");
    const [password, setPassword] = useState("test");
    const { setAuthTokens } = useAuth();
    let history = useHistory();

    function postLogin() {
        //console.log(password)
        axios.post(baseURL + "/login", {
            username,
            password
        }).then(result => {
            if (result.status === 202) {
                setAuthTokens(result.data);
                setLoggedIn(true);
                sessionStorage.setItem('loggedIN', true)
                sessionStorage.setItem('AuthToken', result.data.sent)
                console.log('result data', result.data.sent)
                history.push("/")
            } else {
                setIsError(true);
            }
        }).catch(e => {
            setIsError(true);
        });
    }

    return (
        <>
            <div className='loginpage'>
                <Row style={{ marginRight: '0' }} className='top_row'>
                    <Link to='/'>
                    </Link>
                </Row>
                <Row style={{ marginRight: '0' }} className='login_main'>
                    <Card id='login_card'>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <Label for='username'>User Name</Label>
                                    <Input type="username"
                                        //value={username}
                                        onChange={e => {
                                            setUserName(e.target.value);
                                        }}
                                        //placeholder={username} 
                                        />
                                </FormGroup>
                                <FormGroup>
                                    <Label for='password'>Password</Label>
                                    <Input type="password"
                                        //value={password}
                                        onChange={e => {
                                            setPassword(sha512(e.target.value).toString());
                                        }}
                                    />
                                </FormGroup>
                                <Button outline color='secondary'
                                    onClick={postLogin}>Sign In</Button>
                            </Form>
                            <br />
                            {isError && <Alert color="danger"> The username or password provided were incorrect!</Alert>}
                        </CardBody>
                    </Card>


                </Row>
            </div>
            <footer className='footer_homepage'>
                <p>
                    © 2020 All rights reserved.
                </p>
            </footer>
        </>
    )
}