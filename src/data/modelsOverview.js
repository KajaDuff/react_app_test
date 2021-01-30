import React, { useState } from 'react'
import {
    Link,
    useHistory
} from "react-router-dom";
import {
    Row, Col, Card, CardTitle, CardBody,
    ButtonGroup, Button
} from 'reactstrap';

import Select from 'react-select'


import Header from '../_components/header'
import Navbar from '../_components/navbar'
import Foot from '../_components/footer'


import ErrorBoundary from '../_components/ErrorBoundary';




const options = [
    { value: 'MSSQL', label: 'MSSQL' },
    { value: 'Oracle', label: 'Oracle' },
    { value: 'CSV', label: 'CSV' },
    { value: 'NoSQL', label: 'NoSQL' },
    { value: 'SAP', label: 'SAP' },
    { value: 'Enterprise Architect', label: 'Enterprise Architect' },
    { value: 'Power Design', label: 'Power Design' },
];

const data = [
    { system: 'MSSQL' },
    { system: 'Oracle' },
    { system: 'CSV' },
    { system: 'SAP' },
    { system: 'NoSQL' },
    { system: 'Enterprise Architect' },
    { system: 'Power Design' }
]

export default function ModelsOverview() {


    const history = useHistory()
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selected, setSelected] = React.useState([]);
    const [searchResults, setSearchResults] = React.useState([]);
    const [resultLength, setResultLength] = useState(data.length)

    const handleChangeSelect = (selected) => {
        selected ? setSelected(selected) :
            setSelected([]);
    };

    const handleChangeSearch = event => {
        setSearchTerm(event.target.value);
    };

    React.useEffect(() => {
        const s = Object.values(selected).map((item) => item.value)
        const default_results = data
        const results = []
        s.forEach(function (value, key) {
            const v = value
            const filter_result = data.filter(o => o.system.toLowerCase().includes(v.toString()) ||
                o.system.toString().includes(v.toString()))

            filter_result.forEach(loop)
            function loop(val, i) {
                if (!results.includes(val)) {
                    results.push(val)
                }
            }
        })

        if (selected.length > 0) {
            setSearchResults(results)
            setResultLength(results.length)
        } else {
            setSearchResults(default_results)
            setResultLength(default_results.length)
        }
    }, [selected]);
    React.useEffect(() => {
        const results = data.filter(o => o.system.toString().includes(searchTerm)
            || o.system.toLowerCase().includes(searchTerm))
            ;
        setSearchResults(results)
        setResultLength(results.length)
    }, [searchTerm]);



    return (

        <>
            <header className='sticky-wrapper sticky'>
                <Header />
                <Navbar />
                <Row className="sticky-inner">
                    <div className='secondline'>
                        <i class="fas fa-angle-double-left" onClick={() => history.goBack()}></i>
                        <Link id='home' to="/"><i className="fas fa-home"></i></Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to='/data/clusters'>Catalog</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to='/data/models'>Models</Link>
                    </div>
                </Row>
            </header>


            <main className="content">
                <Row >
                    <Col sm={{ size: 5, offset: 5 }}><h1>Models</h1></Col>
                </Row>
                <br />
                <Row>
                    <Col sm={{ size: 3, offset: 0 }}>
                        <ButtonGroup>
                            <Button outline color="secondary">
                                <Link to='/data/clusters'
                                    style={{ color: 'gray' }} >Clusters</Link></Button>
                            <Button><Link to='/data/models'
                                style={{ color: 'white' }} >Browse Systems</Link></Button>
                        </ButtonGroup>
                    </Col>
                    <Col sm={{ size: 3, offset: 0 }}>
                        <Select
                            value={selected}
                            onChange={handleChangeSelect}
                            options={options}
                            isMulti
                            name="colors"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder='Select System...'
                        />
                    </Col>
                    <Col sm={{ size: 3 }}>
                        <Row>
                            <input
                                type="text"
                                placeholder='Search'
                                className='form-control'
                                value={searchTerm}

                                onChange={handleChangeSearch}
                                style={{ height: '38px', width: '350px' }}
                            />
                            <p style={{ color: 'gray', marginLeft: '25%', marginTop: '1%' }}
                            >Showing {resultLength} results.</p>
                        </Row>
                    </Col>
                </Row>
                <br />
                <ErrorBoundary>
                    <Row xs='2' sm='3' md='5' lg='6'>
                        {searchResults.map(i => (

                            <Card>
                                {i.system === 'MSSQL' ? (
                                    <CardBody>
                                        <CardTitle>
                                            <Link
                                                to={`/data/models/MSSQL`}
                                                style={{ color: 'black' }}>{i.system}</Link>
                                        </CardTitle>
                                    </CardBody>

                                ) :
                                    (
                                        <CardBody>
                                            <CardTitle>
                                                <p
                                                    style={{ color: 'gray' }}>{i.system}</p>
                                            </CardTitle>
                                        </CardBody>
                                    )}
                            </Card>



                        ))}
                    </Row>
                </ErrorBoundary>

            </main>
            <Foot/>
        </>


    )
}



