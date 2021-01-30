import React, { useState, useRef, useEffect } from "react";
import {
    Link,
    useHistory,
    useRouteMatch
} from "react-router-dom";
import {
    Button,
    Row, Col,

} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

import Header from '../_components/header';
import Navbar from '../_components/navbar'

import LoadingIndicator from '../_components/loadingIndicator'
import ErrorBoundary from '../_components/ErrorBoundary';
import ModalLabelCorrection from './modalLabelCorrection'
import ModalClusterCorrection from './modalClusterCorrection'
import { baseURL } from '../_helpers/base_url'

import '../styles/other_pages.css'
import '../styles/data.css'


export default function EditAIResults(props) {
    const history = useHistory()

    let { url } = useRouteMatch();
    const [AI_stats, setAI_stats] = React.useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [resultLength, setResultLength] = useState()
    const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))
    const { SearchBar } = Search;
    const conn_id = sessionStorage.getItem('conn_id')
    const table_id = sessionStorage.getItem('table_id')



    const [isSticky, setSticky] = useState(false);
    const ref = useRef(null);
    const handleScroll = () => {
        if (ref.current) {
            setSticky(ref.current.getBoundingClientRect().top <= 0);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
    }, []);

    const columns = [
        {
            text: 'Column',
            dataField: 'column_name',
            sort: true,
            formatter: actionColumn,
            style: {
                verticalAlign: 'middle',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',

            },
            headerClasses: 'sticky-header'
        },
        {
            text: 'Data Type',
            dataField: 'data_type',
            sort: true,
            style: {
                maxWidth: '140px',
                overflow: 'hidden',
                borderRight: 'solid',
                borderWidth: '1px',
                borderColor: '#dee2e6',
                verticalAlign: 'middle',
            },
            headerClasses: 'sticky-header'
        },
        {
            text: 'Label',
            dataField: 'label',
            sort: true,
            style: {
                verticalAlign: 'middle',
                maxWidth: '10px',


            },
            headerClasses: 'sticky-header'

        },
        {
            text: 'Probability',
            dataField: 'probability',
            sort: true,
            style: {
                verticalAlign: 'middle',
                textAlign: 'center',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
            },
            formatter: numberFormatter,
            headerClasses: 'sticky-header'
        },
        {
            text: 'Assigned Label',
            dataField: 'assigned_label',
            sort: true,
            style: {
                verticalAlign: 'middle'
            },
            headerClasses: 'sticky-header'
        },
        {
            text: 'USER Label',
            dataField: 'user_label',
            hidden: 'true',
            sort: true,
            style: {
                verticalAlign: 'middle'
            },
            headerClasses: 'sticky-header'
        },
        {
            text: 'Edit Label',
            dataField: 'actions1',
            formatter: actionButtonLabel,
            style: {
                borderRight: 'solid',
                borderWidth: '1px',
                borderColor: '#dee2e6'
            },
            headerClasses: 'sticky-header'
        },
        {
            text: 'Cluster',
            dataField: 'category',
            sort: true,
            style: {
                verticalAlign: 'middle'
            },
            headerClasses: 'sticky-header'
        },
        {
            text: 'Assigned Cluster',
            dataField: 'assigned_category',
            sort: true,
            style: {
                verticalAlign: 'middle'
            },
            headerClasses: 'sticky-header'
        },
        {
            text: 'Edit Cluster',
            dataField: 'actions2',
            formatter: actionButtonCluster,
            style: {
                verticalAlign: 'middle'
            },
            headerClasses: 'sticky-header'
        },
        {
            dataField: 'actions3',
            formatter: actionButton,
            headerClasses: 'sticky-header'
        }
    ]

    function actionButton(cell, row) {

        return (
            <Button color='secondary' >
                <Link to={`/data/models/MSSQL/${conn_id}/${row.table_id}/${row.column_id}`}
                    style={{ color: 'white' }}
                    onClick={() => sessionStorage.setItem('column_id', row.column_id)}>Visit Page
                         </Link>
            </Button>
        )

    }

    React.useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        async function fetchAIstats() {
            const response_tab = await fetch(baseURL + `/get_table_edit/${table_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `${authToken}`
                    }
                },
                { signal });
            const json_tab = await response_tab.json();
            console.log('authToken', `${authToken}`)
            console.log(json_tab.sent)
            setAI_stats(json_tab.sent);
            setIsLoading(false)
            setResultLength(json_tab.sent.length)
            window.scrollTo(0, 0);
        }
        fetchAIstats()
            .then(response => {
                console.log(`fetchAIstats is complete!`);
            })
            .catch((error) => {
                console.log(error, '--->fetchAIstats')
            })
            .then(setTimeout(() => controller.abort(), 2000));
    }, [table_id]);

    const data = [...AI_stats]

    function numberFormatter(cell) {
        if (cell === 'NA' |
            cell === undefined) {
            return cell
        }
        return Math.round((cell) * 100) + ' %'

    }


    function actionColumn(cell, row) {
        return (<Link to={`/data/models/MSSQL/${conn_id}/${row.table_id}/${row.column_id}`}
            style={{ color: 'black' }}
            onClick={() => sessionStorage.setItem('column_id', row.column_id)}
        >{cell}</Link>)
    }



    function actionButtonLabel(cell, row) {

        return (
            <>
                <ModalLabelCorrection
                    buttonLabel="Edit"
                    item={row}
                    updateState={props.updateState}
                    page='tableView' />
                {' '}
                {row.user_label ? (
                    <Button
                        color="success"
                        disabled={true}
                        style={{ float: "left", width: "95px" }}>Approved
                    </Button>
                ) :
                    (<Button
                        color="warning"
                        onClick={() => confirmLabel(row)}
                        style={{
                            float: "left", width: "95px", opacity: '.65',
                            color: 'white'
                        }}>Confirm
                    </Button>)
                }
            </>
        )

    }

    const confirmLabel = (item) => {
        //event.preventDefault()
        let confirm = window.confirm('Do you want to confirm assigned label?')
        const controller = new AbortController();
        const { signal } = controller;
        if (confirm) {
            setIsLoading(true)
            fetch(`${baseURL}/update/label`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${authToken}`
                },
                body: JSON.stringify({
                    column_id: item.column_id,
                    label: item.label,
                    probability: item.probability,
                    assigned_label: item.label,
                    user_label: item.label,
                },
                )
            }, { signal })
                .then(console.log('authToken', `${authToken}`))
                .then(response => { console.log('confirmLabel completed', `${baseURL}/update/label`) })
                .catch(err => console.log(err))
                //.then(setTimeout(() => controller.abort(), 2000))
                .then(controller.abort())
                .then(setTimeout(() => window.location.reload(false), 1000))
            //.then(window.location.reload(false)) //skus prerobit cez setState
        }
    }

    const confirmCluster = (item) => {
        //event.preventDefault()
        let confirm = window.confirm('Do you want to confirm assigned cluster?')
        const controller = new AbortController();
        const { signal } = controller;
        if (confirm) {
            setIsLoading(true)
            fetch(`${baseURL}/update/cluster`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${authToken}`
                },
                body: JSON.stringify({
                    column_id: item.column_id,
                    category: item.category,
                    assigned_category: item.category,
                    user_category: item.category,
                })
            }, { signal })
                .then(console.log('authToken', `${authToken}`))
                .then(response => { console.log('confirmCluster completed', `${baseURL}/update/cluster`) })
                .catch(err => console.log(err))
                //.then(setTimeout(() => controller.abort(), 2000))
                .then(controller.abort())
                .then(setTimeout(() => window.location.reload(false), 1000))
            //.then(window.location.reload(false)) //skus prerobit cez setState
        }
    }

    const handleDataChange = (dataSize) => {
        let result = Object.values(dataSize)
        setResultLength(result);
    }

    function actionButtonCluster(cell, row) {

        return (
            <>
                <ModalClusterCorrection
                    buttonLabel="Edit"
                    item={row}
                    updateState={props.updateState}
                    page='tableView' />
                {' '}

                {row.user_category ? (
                    <Button
                        color="success" 
                        disabled={true}
                        style={{ float: "left", marginRight: "10px", width: '95px' }}>Approved
                    </Button>
                ) :
                    (<Button
                        color="warning"
                        onClick={() => confirmCluster(row)}
                        style={{
                            float: "left", width: "95px", opacity: '.65',
                            color: 'white'
                        }}>Confirm
                    </Button>)
                }
            </>
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



    const table_name = data.map(i => i.table_name)[0]

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

    const defaultSorted = [{
        dataField: 'column_name',
        order: 'asc'
    }];

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
                        <Link to='/data/models/MSSQL'> MSSQL</Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`/data/models/MSSQL/${conn_id}`}> MSSQL Tables (connection: {conn_id}) </Link>
                        <i className="fas fa-chevron-right"></i>
                        <Link to={`${url}`}> Table {table_name} </Link>
                    </div>
                </Row>
            </header>
            <br />
            <main className="content">
                <Row>
                    <Col sm={{ size: 4, offset: 4 }}>
                        <h1 style={{ textAlign: 'center' }}>{table_name}</h1>
                        <h5 style={{ textAlign: 'center' }}>Edit Labels & Clusters</h5>
                    </Col>
                </Row>
                <br />
                <ErrorBoundary>
                    {isLoading ? <LoadingIndicator /> : (
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
                                            <div className='sticky-wrapper'>
                                                <hr />
                                                <Col>
                                                    <SearchBar {...props.searchProps} style={{ width: '350px' }} />
                                                    <p style={{ color: 'gray', marginTop: '1%' }}
                                                    >Showing {resultLength} results.</p>
                                                </ Col>
                                                <BootstrapTable
                                                    {...props.baseProps}
                                                    bordered={false}
                                                    hover={true}
                                                    pagination={paginationFactory(options)}
                                                    noDataIndication={() => <NoDataIndication />}
                                                    onDataSizeChange={handleDataChange}
                                                    defaultSorted={defaultSorted}
                                                />
                                            </div>
                                        )
                                    }
                                </ToolkitProvider>
                            </Col>
                        </Row>
                    )}
                </ErrorBoundary>
            </main>

        </>
    )
}