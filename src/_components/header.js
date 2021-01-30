import React from 'react'
import {
    Link, useHistory
} from "react-router-dom";
import { Row, Button, ButtonGroup } from 'reactstrap'
import { useAuth } from "../_context/auth";




function Header(props) {

    const { setAuthTokens } = useAuth();
    let history = useHistory()

    function logOut() {
        setAuthTokens();
        sessionStorage.removeItem('loggedIN')
        history.push('/login')
    }

    return (
        <div className="sticky-inner">
            <Row>
                <div className='firstline'>
                    <Link to='/'>
                        <div className='title_header'>
                            <h3>App</h3>
                        </div>
                    </Link>
                    <div className='icons'>
                        <ButtonGroup style={{marginRight: '20px'}}>
                            <Button style={{ backgroundColor: "#0D47A1", padding: '0', borderColor: "#0D47A1" }}>
                                <Link id='home' to="/">
                                    <i className="fas fa-home"
                                        style={{ margin: '0', padding: '10px' }}></i></Link></Button>
                            <Button style={{ backgroundColor: "#0D47A1", padding: '0', borderColor: "#0D47A1" }}>
                                <i className="fas fa-cog"
                                    style={{ margin: '0', padding: '10px' }}></i></Button>
                            <Button id='logout' onClick={logOut} 
                            style={{ backgroundColor: "#0D47A1", padding: '0', paddingRight: '10px' , borderColor: "#0D47A1"}}>
                                <i className="fas fa-user"
                                    style={{ margin: '0', padding: '10px' }}></i>Logout</Button>
                        </ButtonGroup>
                    </div>

                </div>
            </Row>
        </div >
    )
}


export default Header
