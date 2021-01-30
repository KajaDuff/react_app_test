import React, { useState } from "react";
import {
    Link,
    useRouteMatch,
    useHistory,
    useParams
} from "react-router-dom";
import {
    Row, Col, Alert, Card,
    CardBody, CardTitle,

} from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';


import { baseURL } from '../_helpers/base_url'
import DataValueModal from "./dataValueModal";
import Header from '../_components/header';
import Navbar from '../_components/navbar'
import Foot from '../_components/footer'


import '../styles/other_pages.css'
import '../styles/data.css'




const columns = [{
    dataField: 'system',
    text: 'System',
    formatter: actionSystem,
    sort: true
}, {
    dataField: 'database',
    text: 'Database',
    sort: true
}, {
    dataField: 'connection_id',
    text: 'Connection ID',
    sort: true
},
{
    dataField: 'connection_date',
    text: 'Connection Date',
    style: {
        minWidth: '250px'
    },
    sort: true
},
{
    dataField: 'schema',
    text: 'Scheme',
    sort: true
}, {
    dataField: 'table_name',
    text: 'Table',
    style: {
        minWidth: '300px'
    },
    formatter: actionTable,
    sort: true
}, {
    dataField: 'column_name',
    text: 'Column',
    style: {
        minWidth: '300px'
    },
    formatter: actionColumn,
    sort: true
}
];

function actionTable(cell, row) {
    return (
        <Link to={`/data/models/${row.system}/${row.connection_id}/${row.table_id}`}
        onClick={() => {sessionStorage.setItem('table_id', row.table_id);
        sessionStorage.setItem('conn_id', row.connection_id);
        }}
            style={{ color: 'black' }}>{cell}</Link>
    )
}

function actionColumn(cell, row) {
    return (
        <Link to={`/data/models/${row.system}/${row.connection_id}/${row.table_id}/${row.column_id}`}
            style={{ color: 'black' }}
            onClick={() => {sessionStorage.setItem('table_id', row.table_id);
            sessionStorage.setItem('conn_id', row.connection_id);
            sessionStorage.setItem('column_id', row.column_id);
            }}
            >{cell}</Link>
    )
}

function actionSystem(cell, row) {
    return (
        <Link to={`/data/models/${row.system}`}
            style={{ color: 'black' }}>{cell}</Link>
    )
}

export default function Term() {



    const { url } = useRouteMatch()

    const history = useHistory()
    const [isLoading, setIsLoading] = useState(true)
    const [busTerm, setBusTerm] = useState([])
    const [termData, setTermData] = useState([])
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))

    let { term_id } = useParams()
    const title = termData.map(item => item.term)

    let { cluster_id } = useParams()


    React.useEffect(() => {
        async function fetchTerm() {
            const response_tab = await fetch(baseURL + `/get/term/${term_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `${authToken}`
                    }
                });
            console.log('authToken', `${authToken}`)
            const json_tab = await response_tab.json();
            console.log(baseURL + `/get/term/${term_id}`)
            console.log(json_tab.sent)
            setBusTerm(json_tab.sent);
            setIsLoading(false)
        }
        fetchTerm()
            .catch((error) => {
                console.log(error, 'catch the hoop')
            });
    }, [term_id]
    )

    React.useEffect(() => {
        async function fetchTermData() {
            const response_tab = await fetch(baseURL + `/get/data_term/${term_id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `${authToken}`
                }
            });
            const json_tab = await response_tab.json();
            console.log(baseURL + `/get/data_term/${term_id}`)
            console.log('authToken', `${authToken}`)
            console.log(json_tab.sent)
            setTermData(json_tab.sent);
            setIsLoading(false)
            window.scrollTo(0, 0);
        }
        fetchTermData()
            .catch((error) => {
                console.log(error, 'catch the hoop')
            });
    }, [term_id]
    )

    const NoDataIndication = () => (
        <div className="no_data"
            style={{ minWidth: '1100px' }}>
            <div className="rect1" >...No Data...</div>
            <div className="rect2" />
            <div className="rect3" />
            <div className="rect4" />
            <div className="rect5" />
        </div>
    );


    return (

        <>
            <header className='sticky-wrapper sticky'>
                <Header />
                <Navbar />
                <Row className="sticky-inner">
                    <div className='secondline'>
                        <i className="fas fa-angle-double-left" onClick={() => history.goBack()}></i>
                        <Link id='home' to="/"><i className="fas fa-home"></i></Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`/catalog/clusters`}>Catalog</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`/catalog/clusters/${cluster_id}`}>{busTerm.map(item => item.cluster)}</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={url} style={{ textTransform: 'capitalize' }}> {title}</Link>

                    </div>
                </Row>
            </header>
            <br />

            <main className="content">
                <Row>
                    <Col sm={{ size: 6 }}>
                        <h1 style={{ textTransform: 'capitalize' }}>{title}</h1>
                        <br />
                        <div>
                            {busTerm.map(item => item.description)}
                        </div>

                    </Col>
                    {busTerm.map(i => (
                        <>
                            {(i.term === 'email') ? (
                                <>
                                    <Col sm={{ size: 3 }} >
                                        <Alert color="primary">
                                            <h4 style={{ textAlign: 'center' }}>Something</h4>
                                            <hr />
                                            <p style={{ textAlign: 'center' }}>
                                                <Link to={`/catalog/clusters/${cluster_id}`}
                                                    style={{ color: 'black' }}
                                                >{busTerm.map(item => item.cluster)}</Link>
                                            </p>
                                        </Alert>
                                    </Col>
                                    <Col sm={{ size: 3 }}>
                                        <Alert >
                                            <h4 style={{ textAlign: 'center' }}>Something</h4>
                                            <hr />
                                            <DataValueModal
                                                title='Data value per one email is'
                                            />
                                        </Alert>
                                    </Col>
                                </>
                            ) : (
                                    <Col sm={{ size: 4, }}>
                                        <Alert color="primary">
                                            <h4 style={{ textAlign: 'center' }}>Cluster</h4>
                                            <hr />
                                            <p style={{ textAlign: 'center' }}>
                                                <Link to={`/catalog/clusters/${cluster_id}`}
                                                    style={{ color: 'black' }}
                                                >{busTerm.map(item => item.cluster)}</Link>
                                            </p>
                                        </Alert>
                                    </Col>
                                )
                            }

                        </>
                    ))}


                </Row>
                <Row>


                </Row>
                <hr />
                <div>Last Modified Date: {busTerm.map(i => (
                    <>{i.term === 'email' ? <>09-09-2020 11:29:26</> : <>*TBD</>}</>
                ))}</div>
                <hr />
                <br />
                <Row>
                    <Col style={{ maxHeight: '250px' }} sm={{ size: 8 }}>
                        <h3 style={{ textDecoration: 'underline' }}>
                            <i className="fas fa-tags"
                                style={{ marginRight: '10px' }}></i>Tags</h3>
                        <br />
                        <ul style={{ maxHeight: '100px', display: 'flex', flexFlow: 'wrap column' }}>
                            {busTerm.map(i => (
                                <>{i.term === 'email' ? (<><li style={{ listStyleType: 'circle' }}>email</li>
                                    <li style={{ listStyleType: 'circle' }}>email address</li>
                                    <li style={{ listStyleType: 'circle' }}>communication</li></>
                                ) : <li style={{ listStyleType: 'circle' }}>*TBD</li>}</>
                            ))}


                        </ul>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <h2>Something</h2>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <Card style={{ height: '200px' }}>
                            <CardBody >
                                <CardTitle><h3 style={{ textAlign: 'center' }}>Something</h3></CardTitle>
                                <ul style={{ listStyleType: 'none', paddingInlineStart: '0px' }}>
                                    <li>{busTerm.map((item) => item.owner)}</li>
                                </ul>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ height: '200px' }}>
                            <CardBody>
                                <CardTitle><h3 style={{ textAlign: 'center' }}>Example</h3></CardTitle>
                                <ul style={{ listStyleType: 'none', paddingInlineStart: '0px' }}>
                                    <li>{busTerm.map(item => item.example)}</li>
                                </ul>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <h3>Something</h3>
                        <br />
                        <ul style={{ listStyleType: 'none', paddingInlineStart: '0px' }}>
                            {busTerm.map(item => item.terms.map((o, index) => (
                                <li key={index}>
                                    <Link to={`/catalog/clusters/${cluster_id}/${o.id}`}
                                        style={{ color: 'black' }}>{o.name}</Link>
                                </li>
                            )))}
                        </ul>
                    </Col>
                    <Col>
                        <h3>Something</h3>
                        <br />
                        <ul style={{
                            listStyleType: 'none',
                            paddingInlineStart: '0px',
                            overflowY: 'scroll',
                            maxHeight: '200px'
                        }}>
                            {busTerm.map(item => item.stories.map((term, index) => (
                                <li key={index}>
                                    <Link to={`/`}
                                        style={{ color: 'black' }}
                                    >{term.name}</Link>
                                </li>

                            )))}
                        </ul>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <h3>Something</h3>
                </Row>
                <Row>
                    {termData.map((item, index) => (
                        <BootstrapTable
                            keyField='id'
                            columns={columns}
                            data={item.data}
                            bordered={false}
                            hover={true}
                            noDataIndication={() => <NoDataIndication />}
                            pagination={paginationFactory()}
                        />

                    ))}
                </Row>
            </main>
            <Foot />
        </>
    )
}


