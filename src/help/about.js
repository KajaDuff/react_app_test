import React from "react";

import { Link, useHistory } from "react-router-dom";
import {
    Row, Col, Button, ButtonGroup
} from 'reactstrap'
import Header from '../_components/header';
import Navbar from '../_components/navbar'
import Foot from '../_components/footer'



function BackButton({ children }) {
    let history = useHistory()
    return (
        <i className="fas fa-angle-double-left" onClick={() => history.goBack()}></i>
    )
}
function About() {

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
                        <Link>Help</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link>About</Link>
                    </div>
                </Row>
            </header>

            <main className='content'>
                <Row>
                    <Col sm={{ size: 8, offset: 2 }}>
                        <h1 style={{ textAlign: 'center' }}>About</h1>
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ size: 3, offset: 0 }}>
                        <ButtonGroup>
                            <Button outline color="secondary">
                                <Link to='/help/about'
                                    style={{ color: 'gray' }} >About
                                </Link>
                            </Button>
                            <Button outline color="secondary">
                                <Link to='/help/guides'
                                    style={{ color: 'gray' }}
                                >Guides</Link></Button>
                            <Button outline color="secondary">
                                <Link to='/help/contacts'
                                    style={{ color: 'gray' }}>
                                    Contacts
                                </Link ></Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </main>
            <Foot />
        </>
    )
}


export default About