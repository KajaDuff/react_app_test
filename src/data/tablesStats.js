import React, { useState } from "react";
import {
    Link,
    useRouteMatch,
    useHistory
} from "react-router-dom";
import { Row, Col, Button, Card, CardBody, CardText, CardTitle } from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

import Header from '../_components/header';
import Navbar from '../_components/navbar';
import Foot from '../_components/footer'
import LoadingIndicator from '../_components/loadingIndicator'

import ErrorBoundary from "../_components/ErrorBoundary";
import { baseURL } from '../_helpers/base_url'
import '../styles/table_stats.css'




export default function TableStats() {
    
    let { url } = useRouteMatch()
    const history = useHistory()
    const { SearchBar } = Search;
    const [tables_stats, setTables_stats] = React.useState([])
    const [column_stats, setColumn_stats] = React.useState([])
    const [resultLength, setResultLength] = useState()

    const [isLoading, setIsLoading] = useState(true)
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))
    const conn_id = sessionStorage.getItem('conn_id')
    const table_id = sessionStorage.getItem('table_id')

    const columns = [
        {
            text: 'Column ID',
            dataField: 'column_id',
            sort: true
        },
        {
            text: 'Column Name',
            dataField: 'column_name',
            sort: true,
            formatter: actionColumn
        },
        {
            text: 'Data Type',
            dataField: 'data_type',
            sort: true

        },
        {
            text: 'Description',
            dataField: 'description',
            sort:true
        },
        {
            text: 'Primary Key',
            dataField: 'column_primary',
            sort:true
        },
        {
            text: 'Foreign Key',
            dataField: 'column_foreign',
            sort:true
        },
        {
            dataField: 'actions',
            formatter: actionButton
        }
    ]

    function actionButton(cell, row) {

        return (
            <Button color='secondary' >
                <Link to={`/data/models/MSSQL/${conn_id}/${table_id}/${row.column_id}`}
                    style={{ color: 'white' }}
                    onClick={() => sessionStorage.setItem('column_id', row.column_id)}
                >Visit Page</Link></Button>
        )

    }

    function actionColumn(cell, row) {
        return (
            <Link to={`/data/models/MSSQL/${conn_id}/${table_id}/${row.column_id}`}
                style={{ color: 'black' }}
                onClick={() => sessionStorage.setItem('column_id', row.column_id)}
            >{cell}</Link>
        )
    }

    const sizePerPageRenderer = ({
        options,
        currSizePerPage,
        onSizePerPageChange,

    }) => (
            <div className="btn-group" role="group">
                {
                    options.map((option) => {
                        const isSelect = currSizePerPage === `${option.page}`;
                        return (
                            <button
                                key={option.text}
                                type="button"
                                onClick={() => onSizePerPageChange(option.page)}
                                className={`btn ${isSelect ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            >
                                {option.text}
                            </button>
                        );
                    })
                }
            </div>
        );

    const options = {
        sizePerPageRenderer
    };


    React.useEffect(() => {
        async function fetchTables() {
            const response_tab = await fetch(baseURL + `/get_table_statistic/${table_id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `${authToken}`
                }
            });
            const json_tab = await response_tab.json();
            console.log(json_tab.sent)
            setTables_stats(json_tab.sent);
            setIsLoading(false)
        }
        async function fetchColumns() {
            const response_col = await fetch(baseURL + `/get_column_list/${table_id}`,
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
            setResultLength(json_col.sent.length)

        }
        window.scrollTo(0, 0);
        fetchTables()
            .catch((error) => {
                console.log(error, 'catch the hoop')
            });
        fetchColumns()
            .catch((error) => {
                console.log(error, "catch the hoop")
            });

    }, [table_id]);


    let data = [...column_stats];

    const table_name = tables_stats.map(x => x.table_name);

    const handleDataChange = ( dataSize ) => {
        let result = Object.values(dataSize)
        setResultLength( result );
      }

      const NoDataIndication = () => (
        <div className="no_data"
        style={{minWidth: '1100px'}}>
          <div className="rect1" >...No Data...</div>
          <div className="rect2" />
          <div className="rect3" />
          <div className="rect4" />
          <div className="rect5" />
        </div>
      )

      
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
                        <Link to='/data/clusters'> Data Catalog</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to='/data/models'>Models</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to='/data/models/MSSQL'> MSSQL</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`/data/models/MSSQL/${conn_id}`}> MSSQL Tables (connection: {conn_id}) </Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`${url}`}>Table: {table_name}</Link>
                    </div>
                </Row>
            </header>
            <main className="content">
                <Row>
                    <Col sm={{ size: 8, offset: 2 }}>
                        <h1 style={{ textAlign: 'center' }}>Table : {table_name}</h1>
                    </Col>
                </Row>
                <br />

                {tables_stats.map((item) => {
                    return (
                        <div>
                            <Row>
                                <Col>
                                    <p>Created: {item.table_created_on}</p>
                                </Col>
                                <Col>
                                    <p>Last Modified: {item.table_modified_on}</p>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col>
                                    <p>Description:  {item.table_description}</p>
                                </Col>
                            </Row>
                            <hr style={{ borderWidth: '3px' }} />
                            <Row>
                                <h3>General Information</h3>
                            </Row>
                            <hr style={{ borderWidth: '3px' }} />
                            <Row>
                                <Col sm='3'>
                                    <Card>
                                        <CardBody>
                                            <CardTitle><h5>Source System</h5></CardTitle>
                                            <CardText>
                                                <Link to={`/data/models/MSSQL`}
                                                    style={{ color: 'black' }}
                                                >{item.system}</Link></CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col sm='3'>
                                    <Card>
                                        <CardBody>
                                            <CardTitle><h5>Scheme</h5></CardTitle>
                                            <CardText>{item.schema}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col sm='3'>
                                    <Card>
                                        <CardBody>
                                            <CardTitle><h5>Data Owner</h5></CardTitle>
                                            <CardText>{item.data_owner}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col sm='3'>
                                    <Card>
                                        <CardBody>
                                            <CardTitle><h5>Data Steward</h5></CardTitle>
                                            <CardText>{item.data_steward}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <hr style={{ borderWidth: '3px' }} />
                            <Row>
                                <h3>Basic Statistics</h3>
                            </Row>
                            <hr style={{ borderWidth: '3px' }} />
                            <Row>
                                <Col sm='3'>
                                    <Card>
                                        <CardBody>
                                            <CardTitle><h5>Column Count</h5></CardTitle>
                                            <CardText>{item.col_count}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col sm='3'>
                                    <Card>
                                        <CardBody>
                                            <CardTitle><h5>Rows Count</h5></CardTitle>
                                            <CardText>{item.row_count}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col sm='3'>
                                    <Card>
                                        <CardBody>
                                            <CardTitle><h5>Table Size</h5></CardTitle>
                                            <CardText>{item.table_size > 1024 ?
                                                ((Math.round((item.table_size / 1024) * 100) / 100 + ' MB')
                                                ) : (
                                                    item.table_size + ' KB'
                                                )}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col sm='3'>
                                    <Card>
                                        <CardBody>
                                            <CardTitle><h5>Used Space</h5></CardTitle>
                                            <CardText>{item.used_space > 1024 ?
                                                ((Math.round((item.used_space / 1024) * 100) / 100 + ' MB')
                                                ) : (
                                                    item.used_space + ' KB'
                                                )}</CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <hr style={{ borderWidth: '3px' }} />
                            <Row>
                                <h3>Related Information</h3>
                            </Row>
                            <hr style={{ borderWidth: '3px' }} />
                            <Row>
                                <Col>
                                    <h5>Clusters</h5>
                                    <ul style={{
                                        listStyleType: 'none',
                                        paddingInlineStart: '0px',
                                        overflowY: 'scroll',
                                        maxHeight: '200px'
                                    }}>
                                        {item.related_cluster.map((i, index) => (
                                            <li key={index}><Link
                                                to={`/catalog/clusters/${i.id}`}
                                                style={{ color: 'black' }}
                                            >{i.name}</Link></li>
                                        ))}
                                    </ul>
                                </Col>
                                <Col>
                                    <h5>Terms</h5>
                                    <ul style={{
                                        listStyleType: 'none',
                                        paddingInlineStart: '0px',
                                        overflowY: 'scroll',
                                        maxHeight: '200px'
                                    }}>
                                        {item.related_terms.map((i, index) => (
                                            <li key={index}>
                                                <Link
                                                    to={`/catalog/clusters/${i.cluster_id}/${i.id}`}
                                                    style={{ color: 'black' }}
                                                >
                                                    {i.name}
                                                </Link></li>
                                        ))}
                                    </ul>
                                </Col>
                                <Col>
                                    <h5>Stories</h5>
                                    <ul style={{
                                        listStyleType: 'none',
                                        paddingInlineStart: '0px',
                                        overflowY: 'scroll',
                                        maxHeight: '200px'
                                    }}>
                                        {item.related_stories.map((i, index) => (
                                            <li key={index}>
                                                <Link
                                                    to={``}
                                                    style={{ color: 'black' }}
                                                >
                                                    {i.name}</Link></li>
                                        ))}
                                    </ul>
                                </Col>
                            </Row>
                        </div>
                    )
                })}


                <hr style={{ borderWidth: '3px' }} />
                <Row>
                    <h3>Table Columns</h3>
                </Row>
                <hr style={{ borderWidth: '3px' }} />

                <ErrorBoundary>
                    {isLoading ? <LoadingIndicator /> :
                        <Row>
                            <Col sm={{ size: 12 }}>
                                <ToolkitProvider
                                    keyField='id'
                                    data={data}
                                    columns={columns}
                                    search
                                >
                                    {
                                        props => (
                                            <div>
                                                <br />
                                                <Col >
                                                    <SearchBar {...props.searchProps} style={{ width: '350px' }} />
                                                    <p style={{ color: 'gray', marginTop: '1%' }}
                                                    >Showing {resultLength} results.</p>
                                                </ Col>
                                                <br />
                                                <BootstrapTable
                                                    {...props.baseProps}
                                                    bordered={false}
                                                    hover={true}
                                                    pagination={paginationFactory(options)}
                                                    noDataIndication={ () => <NoDataIndication /> }
                                                    onDataSizeChange={handleDataChange}
                                                />
                                            </div>
                                        )
                                    }
                                </ToolkitProvider>
                            </Col>
                        </Row>}
                </ErrorBoundary>
            </main>
            <Foot/>
        </>

    )

}