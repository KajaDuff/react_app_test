import React from 'react'
import { Container, Button } from 'reactstrap'
import { useHistory } from 'react-router-dom'

import Header from '../_components/header'
import Navbar from '../_components/navbar'




export default function PageInProgress() {
    const history = useHistory();
    return (


        <div>
            <Header />
            <Navbar />
            <Container>
                <div>
                    <p style={{ fontSize: '20px' }}><b>...Page in progress...</b></p>
                    <i style={{ fontSize: '40px' }} class="fas fa-tools"></i>
                </div>
                <br />
                <div>
                    <Button onClick = {()=> history.goBack()}>GO BACK</Button>
                </div>
            </Container>
        </div>

    )
}