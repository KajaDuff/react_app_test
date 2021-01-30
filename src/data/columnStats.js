import React, { useState } from "react";
import {
    Link,
    useRouteMatch,
    useHistory,
    useParams
} from "react-router-dom";
import { Row, Col, Card, CardBody, CardText, CardTitle } from 'reactstrap'

import Header from '../_components/header';
import Navbar from '../_components/navbar';
import Foot from '../_components/footer'
import LoadingIndicator from '../_components/loadingIndicator'
import ErrorBoundary from "../_components/ErrorBoundary";
import LabelsTable from './labelsTable'
import ClusterTable from './clusterTable'
import { baseURL } from '../_helpers/base_url'




export default function ColumnStats() {

    const [column_stats, setColumn_stats] = React.useState([])
    const [labels, setLabels] = React.useState([])
    const [clusters, setClusters] = React.useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))
    //let {column_id} = useParams()
    const conn_id = sessionStorage.getItem('conn_id')
    const table_id = sessionStorage.getItem('table_id')
    const column_id = sessionStorage.getItem('column_id')
    



    React.useEffect(() => {
        async function fetchColumns() {
            const response_col = await fetch(baseURL + `/get_column_statistic/${column_id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `${authToken}`
                }
            });
            console.log( 'authToken', `${authToken}`)
            const json_col = await response_col.json();
            console.log(json_col.sent)
            setColumn_stats(json_col.sent);
            setIsLoading(false)

        }
        async function fetchLabels() {
            const response_labl = await fetch(baseURL + `/get_semantic_analysis/${column_id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `${authToken}`
                }
            });
            console.log( 'authToken', `${authToken}`)
            const json_labl = await response_labl.json();
            console.log(json_labl.sent)
            setLabels(json_labl.sent)
            setIsLoading(false)
        }
        fetchColumns()
            .catch((error) => {
                console.log(error, "catch the hoop")
            });
        fetchLabels()
            .catch((error) => {
                console.log(error, "catch the hoop")
            })
    }, [column_id]);

    //const data = [...column_stats,...l2]
    //const data = column_stats.concat(l2, 'column_name')
    let items = column_stats.map((item, i) => Object.assign({}, item, labels[i]));

    //const data = [...column_stats]

    React.useEffect(() => {
        async function fetchClusters() {
            const response_cls = await fetch(baseURL + `/get_cluster_category/${column_id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `${authToken}`
                }
            });
            const json_cls = await response_cls.json();
            console.log( 'authToken', `${authToken}`)
            console.log(json_cls.sent)
            setClusters(json_cls.sent);
            setIsLoading(false)
            window.scrollTo(0, 0);

        }
        fetchClusters()
            .catch((error) => {
                console.log(error)
            })
    }, [column_id]);

    const updateState = (label) => {
        const itemIndex = labels.findIndex(data => data.id === label.id)
        const newArray = [...labels.slice(0, itemIndex), label, ...labels.slice(itemIndex + 1)]
        setLabels(newArray)
    }


    function renderColumnData() {

        return column_stats.map((item, index) => {
            const {
                // column_id,
                //column_name,
                table_name,
                column_pk,
                column_fk,
                schema,
                system,
                data_type,
                is_nullable,
                is_autoincrement,
                default_value,
                description,
                // null_stat,
                table_created_on,
                data_owner,
                data_steward,
                number_profiling_rows,
                perc_empty_rows,
                perc_invalid_rows,
                MAX_value,
                MIN_value } = item //destructuring

            return (
                <div key={index} id='general_info_table'>
                    <Row>
                        <Col>
                            Description: {description}
                        </Col>
                    </Row>
                    <hr style={{ borderWidth: '3px' }} />
                    <Row>
                        <h3>General Information</h3>
                    </Row>
                    <hr style={{ borderWidth: '3px' }} />
                    <Row>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Table Name</h5></CardTitle>
                                <CardText>
                                    <Link to={`/data/models/MSSQL/${conn_id}/${table_id}`}
                                        style={{ color: 'black' }}
                                    >{table_name}</Link></CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Scheme</h5></CardTitle>
                                <CardText>{schema}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Source System</h5></CardTitle>
                                <CardText>{system}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Table Created On</h5></CardTitle>
                                <CardText>{table_created_on}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Data Owner</h5></CardTitle>
                                <CardText>{data_owner}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Data Steward</h5></CardTitle>
                                <CardText>{data_steward}</CardText>
                            </CardBody>
                        </Card>
                    </Row>
                    <hr style={{ borderWidth: '3px' }} />
                    <Row>
                        <h3>Technical Information</h3>
                    </Row>
                    <hr style={{ borderWidth: '3px' }} />
                    <Row>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Data Type</h5></CardTitle>
                                <CardText>{data_type}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Primary Key</h5></CardTitle>
                                <CardText>{column_pk}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Foreign Key</h5></CardTitle>
                                <CardText>{column_fk}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Is Nullable</h5></CardTitle>
                                <CardText>{is_nullable}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Autoincrement</h5></CardTitle>
                                <CardText>{is_autoincrement}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Default Value</h5></CardTitle>
                                <CardText>{default_value}</CardText>
                            </CardBody>
                        </Card>
                    </Row>
                    <hr style={{ borderWidth: '3px' }} />
                    <Row>
                        <h3>Basic Statistics</h3>
                    </Row>
                    <hr style={{ borderWidth: '3px' }} />
                    <Row>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>Number of Profiling Rows</h5></CardTitle>
                                <CardText>{number_profiling_rows}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>% of Empty Rows</h5></CardTitle>
                                <CardText>
                                    {(perc_empty_rows === 'NA - in development' |
                                        perc_empty_rows === 'Empty column') ?
                                        (perc_empty_rows) : (Math.round(perc_empty_rows * 100)) + ' %'}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>MAX Value</h5></CardTitle>
                                <CardText>{MAX_value}</CardText>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle><h5>MIN Value</h5></CardTitle>
                                <CardText>{MIN_value}</CardText>
                            </CardBody>
                        </Card>
                    </Row>
                    <hr style={{ borderWidth: '3px' }} />
                    <Row>
                        <h3>Related Information</h3>
                    </Row>
                    <hr style={{ borderWidth: '3px' }} />
                    <Row>
                        <Col>
                            <h5>Clusters</h5>
                            <ul>
                                {item.related_cluster.map((o) =>
                                    <li >
                                        <Link to={`/catalog/clusters/${o.id}`}
                                            style={{ color: 'black' }}
                                            onClick={() => sessionStorage.setItem('cluster_id', o.id)}>
                                            {o.name}</Link></li>)}
                            </ul>
                        </Col>
                        <Col>
                            <h5>Terms</h5>
                            <ul>
                                {item.related_terms.map((o) =>
                                    <li > <Link to={`/catalog/clusters/${o.cluster_id}/${o.id}`}
                                        style={{ color: 'black' }}
                                        onClick={() => sessionStorage.setItem('buss_term_id', o.id)}>
                                        {o.name}</Link></li>)}
                            </ul>
                        </Col>
                    </Row>
                    <hr style={{ borderWidth: '3px' }} />
                    <Row>
                        <h3>Assigned Values</h3>
                    </Row>
                    <hr style={{ borderWidth: '3px' }} />
                </div>
            )
        })
    }

    const column_data = renderColumnData(column_id)

    let { url } = useRouteMatch()
    const column_name = column_stats.map(x => x.column_name)
    const history = useHistory()


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
                        <Link to='/data/clusters'>Catalog</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to='/data/models'>Models</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to='/data/models/MSSQL'> MSSQL connections </Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`/data/models/MSSQL/${conn_id}`}> MSSQL Tables (connection: {conn_id}) </Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`/data/models/MSSQL/${conn_id}/${table_id}`}>Table ID: {table_id}</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`${url}`}>Column: {column_name}</Link>
                    </div>
                </Row>
            </header>

            <main className="content">
                <ErrorBoundary>
                    <Row>
                        <Col>
                            <h1 style={{ textAlign: 'center' }}>Column : {column_name}</h1>
                        </Col>
                    </Row>
                    <br />
                    {isLoading ? <LoadingIndicator /> :
                        <div>{column_data}</div>
                    }

                </ErrorBoundary>
                <br />
                <div style={{ color: 'black' }}>
                    <ErrorBoundary>
                        {isLoading ? <LoadingIndicator /> :
                            <LabelsTable items={items} updateState={updateState} />
                        }
                    </ErrorBoundary>

                </div>
                <div style={{ color: 'black' }}>
                    <ErrorBoundary>
                        {isLoading ? <LoadingIndicator /> :
                            <ClusterTable items={clusters} updateState={updateState} />
                        }
                    </ErrorBoundary>

                </div>
            </main>
            <Foot />
        </>
    )

}