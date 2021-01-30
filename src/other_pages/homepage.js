import React from "react";
import { Link, useHistory } from "react-router-dom";
import { CardBody, Row, Col, Card, CardText, CardTitle, ButtonGroup, Button } from 'reactstrap'



import '../styles/homepage.css';
import Home_logo from '../styles/home.png'
import { useAuth } from "../_context/auth";



//<i className="fa fa-search"></i>


function Home() {

    let history = useHistory()
    const { setAuthTokens } = useAuth();

    function logOut() {
        setAuthTokens();
        sessionStorage.removeItem('loggedIN')
        history.push('/login')
    }


    return (
        <>
            <div className='homepage'>
                <Row style={{ marginRight: '0' }} className='top_row'>
                    <Col xs={{ size: 1 }}>
                        <img src={Home_logo}
                            alt='home_logo'
                            className='home_logo'
                            style={{ margin: '7%', height: '6%', marginLeft: '18px' }}
                        />
                    </Col>
                    <Col xs={{ size: 2, offset: 9 }} className='home_icons'>
                        <ButtonGroup>
                            <Button style={{ backgroundColor: "#0D47A1", padding: '0', borderColor: "#0D47A1" }}>
                                <Link to="/data_entry">
                                    <i className="fas fa-plus" id='login'
                                        style={{ margin: '0', padding: '10px' }}></i></Link></Button>
                            <Button style={{ backgroundColor: "#0D47A1", padding: '0' , borderColor: "#0D47A1"}}>
                                <i className="fas fa-cog"
                                    style={{ margin: '0', padding: '10px' }}></i></Button>
                            <Button id='logout' onClick={logOut}
                                style={{ backgroundColor: "#0D47A1", padding: '0', paddingRight: '10px', borderColor: "#0D47A1" }}>
                                <i className="fas fa-user"
                                    style={{ margin: '0', padding: '10px' }}></i>Logout</Button>
                        </ButtonGroup>

                    </Col>

                </Row>
                <Row style={{ marginRight: '0' }} className='homepage_main'>
                    <Col xs={{ size: 3, offset: 2 }} style={{ textAlign: 'right' }}>
                    </Col>
                    <Col xs={{ size: 4 }} style={{ marginTop: '2%', textAlign: 'left' }}>
                        <span className='homepage_title'>
                            <h1>Training App</h1>
                        </span>
                    </Col>
                </Row>

                    <Row xs="1" sm="2" md="2" lg="4" className='homepage_cards' >
                        <Col className='navbar-home' >
                            <Link to="">
                                <Card>
                                    <CardBody className='navbar-home'>
                                        <CardTitle>Part A</CardTitle>
                                        <CardText><i className="fas fa-book-open"></i></CardText>
                                    </CardBody>
                                </Card>
                            </Link>
                        </Col>
                        <Col className='navbar-home'>
                            <Link to="/catalog/clusters">
                                <Card>
                                    <CardBody className='navbar-home'>
                                        <CardTitle>Part B</CardTitle>
                                        <CardText><i className="fas fa-book"></i></CardText>
                                    </CardBody>
                                </Card>
                            </Link>

                        </Col  >
                        <Col className='navbar-home'><Link to="/data/clusters">
                            <Card>
                                <CardBody className='navbar-home'>
                                    <CardTitle>Part C</CardTitle>
                                    <CardText><i className="fas fa-database"></i></CardText>
                                </CardBody>
                            </Card>
                        </Link>
                        </Col>
                        <Col className='navbar-home'>
                            <Link to="/help/about">
                                <Card>
                                    <CardBody className='navbar-home'>
                                        <CardTitle>Help</CardTitle>
                                        <CardText><i className="far fa-compass"></i></CardText>
                                    </CardBody>
                                </Card>
                            </Link>
                        </Col>
                    </Row>
                




            </div>
            <footer className='footer_homepage'>
                <p>
                    © 2020 All rights reserved.
                </p>
            </footer>
        </>

    );
}



export default Home