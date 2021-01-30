import React, { useState } from 'react'
import { Button, Col, Row } from 'reactstrap';
import {
    Link,
    useHistory
} from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

import Header from '../_components/header'
import Navbar from '../_components/navbar'
import Foot from '../_components/footer'
import ErrorBoundary from '../_components/ErrorBoundary'
import { baseURL } from '../_helpers/base_url'


export default function MssqlConnections() {
    const [tables_stats, setTables_stats] = React.useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [resultLength, setResultLength] = useState()
    const history = useHistory()
    const { SearchBar } = Search;
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))



    React.useEffect(() => {

        async function fetchTables() {
            const response_tab = await fetch(baseURL + '/get_connection_statistic',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `${authToken}`
                    }
                }
            );
            console.log('authToken', `${authToken}`)
            const json_tab = await response_tab.json();
            console.log(json_tab.sent)
            setTables_stats(json_tab.sent);
            setIsLoading(false)
            setResultLength(json_tab.sent.length)
            window.scrollTo(0, 0);
        }
        fetchTables()
            .catch((error) => {
                console.log(error, 'fetchTables ERROR')
            });
    }, []);


    const data = [...tables_stats]

    const columns = [
        {
            dataField: 'system',
            text: 'System',
            sort: true

        },
        {
            dataField: 'connection_id',
            text: 'Connection ID',
            sort: true,
            formatter: actionConn

        },
        {
            dataField: 'database',
            text: 'Database',
            sort: true

        },
        {
            dataField: 'user',
            text: 'User',
            sort: true

        },
        {
            dataField: 'date_of_connection',
            text: 'Date Of Connection',
            sort: true

        },
        {
            dataField: 'actions',
            formatter: actionButton
        }
    ]

    const handleDataChange = (dataSize) => {
        let result = Object.values(dataSize)
        setResultLength(result);
    }
    function actionConn(cell, row) {
      
        return (
            <Link to={`/data/models/MSSQL/${row.connection_id}`}
                style={{ color: 'black' }}
                onClick={() => sessionStorage.setItem('conn_id', row.connection_id)}
            >{cell}</Link>
        )
    }
    function actionButton(cell, row) {
        return (

            <Button color='secondary' >
                <Link to={`/data/models/MSSQL/${row.connection_id}`}
                    style={{ color: 'white' }}
                    onClick={() => sessionStorage.setItem('conn_id', row.connection_id)}
                >Visit Page</Link></Button>


        )
    }
    const defaultSorted = [{
        dataField: 'connection_id',
        order: 'desc'
    }];

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
                        <i class="fas fa-angle-double-left" onClick={() => history.goBack()}></i>
                        <Link id='home' to="/"><i className="fas fa-home"></i></Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to='/data/clusters'>Catalog</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to='/data/models'>Models</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to='/data/models/MSSQL'> MSSQL</Link>
                    </div>
                </Row>
            </header>
            <hr />
            <main className="content">
                <Row >
                    <Col sm={{ size: 5, offset: 5 }}><h1>MSSQL</h1></Col>
                </Row>
                <br />
                <ErrorBoundary>
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
                                            <hr />
                                            <Col>
                                                <SearchBar {...props.searchProps} style={{ width: '350px' }} />
                                                <p style={{ color: 'gray', marginTop: '1%' }}
                                                >Showing {resultLength} results.</p>
                                            </Col>
                                            <BootstrapTable
                                                {...props.baseProps}
                                                bordered={false}
                                                hover={true}
                                                pagination={paginationFactory(options)}
                                                noDataIndication={() => <NoDataIndication />}
                                                defaultSorted={defaultSorted}
                                                onDataSizeChange={handleDataChange}
                                            />
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                        </Col>
                    </Row>
                </ErrorBoundary>
            </main>
            <Foot />
        </>
    )

}