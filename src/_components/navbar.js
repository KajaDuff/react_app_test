import React from "react";
import {
    Link,
} from "react-router-dom";
import { Row } from 'reactstrap'

function Navbar() {
    return (
        <Row>
            <div className="sticky-inner">

                <ul className='navbar-other'>
                    <li>
                        <Link to="">Part A</Link>

                    </li>
                    <li>
                        <Link to="/catalog/clusters">Part B</Link>

                    </li>
                    <li>
                        <Link to="/data/clusters">Part C</Link>

                    </li>
                    <li>
                        <Link to="/help/about">Help</Link>
                    </li>
                </ul>

            </div>
        </Row>
    )
}

export default Navbar