import React, { useState } from "react";
import {
    Link,
    useHistory
} from "react-router-dom";
import {
    Card, Button,
    CardText, CardTitle,
    CardBody, Row, Col,
    ButtonGroup
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import Select from 'react-select'

import Header from '../_components/header';
import Navbar from '../_components/navbar'
import Foot from '../_components/footer'
import ErrorBoundary from '../_components/ErrorBoundary'
import { options_cluster } from '../_helpers/constants'
import { baseURL } from '../_helpers/base_url'
import TermModal from './TermModal'
import '../styles/other_pages.css'
import '../styles/data.css'





export default function CatalogAll() {

    const [categoryView, setCategoryView] = useState(true)

    const [searchTerm, setSearchTerm] = React.useState("");
    const [selected, setSelected] = React.useState([]);
    const [searchResults, setSearchResults] = React.useState([]);
    const [terms, setTerms] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [resultLength, setResultLength] = useState()

    const { SearchBar } = Search;
    const history = useHistory()

    const handleChangeSelect = (selected) => {
        selected ? setSelected(selected) :
            setSelected([])
        console.log(`Option selected:`, selected);
    };

    const handleChangeSearch = event => {
        setSearchTerm(event.target.value);
    };



    const columns = [
        {
            text: 'Term',
            dataField: 'term',
            formatter: actionTerm,
            sort: true
        },
        {
            text: 'Cluster',
            dataField: 'cluster',
            formatter: actionCluster,
            sort: true
        },
        {
            text: 'Description',
            dataField: 'description',
            searchable: false,
            sort: true
        },
        {
            dataField: 'actions',
            formatter: actionButton,
            searchable: false
        }
    ]

    function actionTerm(cell, row) {
        return (
            <Link to={`/catalog/clusters/${row.cluster_id}/${row.id}`}
                style={{ color: 'black' }}>{cell}
            </Link>
        )
    }

    function actionCluster(cell, row) {
        return (
            <Link to={`/catalog/clusters/${row.cluster_id}`}
                style={{ color: 'black' }}>{cell}
            </Link>
        )
    }

    function actionButton(cell, row) {

        return (
            <Button color='secondary' >
                <Link to={`/catalog/clusters/${row.cluster_id}/${row.id}`}
                    style={{ color: 'white' }}>Visit Page
                         </Link>
            </Button>
        )
    }

    const handleDataChange = ( dataSize ) => {
        let result = Object.values(dataSize)
        setResultLength( result );
      }
    React.useEffect(() => {
        async function fetchTerms() {
            const response_tab = await fetch(baseURL + `/get/all`);
            const json_tab = await response_tab.json();
            console.log(json_tab)
            console.log(json_tab.sent)
            setTerms(json_tab.sent);
            setIsLoading(false)
            setResultLength(json_tab.sent.length)
            window.scrollTo(0, 0);
        }
        fetchTerms()
            .catch((error) => {
                console.log(error, 'catch the hoop')
            });
    }, []
    )

    let data = [...terms]

    React.useEffect(() => {
        const s = Object.values(selected).map((item) => item.value)
        const default_results = data
        const results = []
        s.forEach(function (value, key) {
            const v = value
            console.log('value:', v)
            const filter_result = data.filter(o => o.cluster.includes(v.toString()) ||
                o.term.toString().includes(v.toString()))

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

        console.log('selected:', selected)
        console.log('search results:', results)
        console.log('selected item:', s)
        console.log('data:', data)
    }, [selected, terms]);
    React.useEffect(() => {
        //const l = data.map(item => item.example.filter(object => object.toLowerCase().includes(searchTerm)));

        const results = data.filter(o => o.cluster.toLowerCase().includes(searchTerm)
            || o.term.toLowerCase().includes(searchTerm))
            ;
        setSearchResults(results)
        console.log('search count', results.length, results)
        setResultLength(results.length)
    }, [searchTerm, terms]);

    const NoDataIndication = () => (
        <div className="no_data"
        style={{minWidth: '1100px'}}>
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
                        <Link to='/catalog/all'>Catalog<i className="fas fa-chevron-right"></i>All</Link>
                    </div>
                </Row>
            </header>
            <br />

            <main className="content">
                <Row>
                    <Col sm={{ size: 4, offset: 4 }}>
                        <h1 style={{ textAlign: 'center' }}>Catalog</h1>
                    </Col>
                </Row>
                <br />
                {categoryView ? (
                    <div>
                        <ErrorBoundary>
                            <Row>
                                <Col sm={{ size: 3, offset: 0 }}>
                                    <ButtonGroup>
                                        <Button outline color='secondary'>
                                            <Link to='/catalog/clusters'
                                                style={{ color: 'gray' }}
                                            >Clusters</Link></Button>
                                        <Button color="secondary">
                                            <Link to='/catalog/all'
                                                style={{ color: 'white' }}
                                            >All Terms</Link></Button>
                                    </ButtonGroup>
                                </Col>
                                <Col sm={{ size: 1, offset: 2 }}>
                                    <ButtonGroup>
                                        <Button color="secondary" onClick={() => setCategoryView(true)}>
                                            <i className="fas fa-th"></i>
                                        </Button>
                                        <Button outline color="secondary" onClick={() => setCategoryView(false)}>

                                            <i className="fas fa-list"></i>
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                                <Col sm={{ size: 3, offset: 0 }}>
                                    <Select
                                        value={selected}
                                        onChange={handleChangeSelect}
                                        options={options_cluster}
                                        isMulti
                                        name="colors"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder='Select Cluster...'
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
                        </ErrorBoundary>
                        <br />
                        <ErrorBoundary>
                            <Row xs="1" sm="2" md="2" lg="4">
                                {searchResults.map(item => (
                                    <Col sm={{ size: 4 }}>
                                        <Card className='domain_cards' >
                                            <CardBody>
                                                <CardTitle className='domain_cards'
                                                    style={{ textTransform: 'capitalize' }}>
                                                    {item.term.split("_").join(" ")}</CardTitle>
                                            </CardBody>
                                            <CardText>
                                                <Link to={`/catalog/clusters/${item.cluster_id}`}
                                                    style={{ color: 'black' }}>
                                                    {item.cluster}</Link></CardText>
                                            <CardBody>
                                                <ButtonGroup>
                                                    <TermModal
                                                        title={item.term}
                                                        cluster_id={item.cluster_id}
                                                        description={item.description}
                                                        id={item.id}
                                                    />
                                                    <Button>
                                                        <Link
                                                            to={`/catalog/clusters/${item.cluster_id}/${item.id}`}
                                                            style={{ color: 'white' }}>Visit Page</Link>
                                                    </Button>
                                                </ButtonGroup>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </ErrorBoundary>
                    </div>
                )
                    :

                    (
                        <div><ErrorBoundary>
                            <ToolkitProvider
                                keyField='id'
                                data={searchResults}
                                columns={columns}
                                search
                            >
                                {
                                    props => (
                                        <div>
                                            <Row>
                                                <Col sm={{ size: 4, offset: 0 }}>
                                                    <ButtonGroup>
                                                        <Button outline color='secondary'>
                                                            <Link to='/catalog/clusters' style={{ color: 'gray' }} >Clusters</Link></Button>
                                                        <Button color="secondary"><Link to='/catalog/all' style={{ color: 'white' }} >All Terms</Link></Button>
                                                    </ButtonGroup>
                                                </Col>
                                                <Col sm={{ size: 1, offset: 1 }}>
                                                    <ButtonGroup>
                                                        <Button outline color="secondary" onClick={() => setCategoryView(true)}>
                                                            <i className="fas fa-th"></i>
                                                        </Button>
                                                        <Button color="secondary" onClick={() => setCategoryView(false)}>

                                                            <i className="fas fa-list"></i>
                                                        </Button>
                                                    </ButtonGroup>
                                                </Col>
                                                <Col sm={{ size: 3, offset: 0 }}>
                                                    <Select
                                                        value={selected}
                                                        onChange={handleChangeSelect}
                                                        options={options_cluster}
                                                        isMulti
                                                        name="colors"
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        placeholder='Select Cluster...'
                                                    />
                                                </Col>
                                                <Col sm={{ size: 3 }}>
                                                    <SearchBar {...props.searchProps} style={{ width: '350px' }} />
                                                    <p style={{ color: 'gray', marginLeft: '25%', marginTop: '1%' }}
                                                    >Showing {resultLength} results.</p>
                                                </Col>
                                            </Row>
                                            <br />
                                            <Row>
                                                <Col sm={{ size: 12 }}>
                                                    <BootstrapTable
                                                        {...props.baseProps}
                                                        bordered={false}
                                                        hover={true}
                                                        noDataIndication={ () => <NoDataIndication /> }
                                                        filter={filterFactory()}
                                                        onDataSizeChange={handleDataChange}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                        </ErrorBoundary>
                        </div>)}
            </main>
            <Foot/>
        </>
    )
}
