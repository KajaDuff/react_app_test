import React, { useEffect, useState } from "react";
import {
    Link,
    useRouteMatch,
    useHistory,
    useParams
} from "react-router-dom";
import {
    Card, Button,
    CardTitle,
    CardBody,
    Row, Col,
    ButtonGroup,
} from 'reactstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import Select from 'react-select'

import Header from '../_components/header';
import Navbar from '../_components/navbar'
import Foot from '../_components/footer'

import TermModals from './TermModal'


import '../styles/other_pages.css'
import '../styles/data.css'
import ErrorBoundary from "../_components/ErrorBoundary";
import {
    options_personal_terms, options_location_terms,
    options_other_terms, options_time_terms
} from '../_helpers/constants'
import { baseURL } from '../_helpers/base_url'





export default function ClusterData() {


    const { url } = useRouteMatch();
    const history = useHistory()
    const [selected, setSelected] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [categoryView, setCategoryView] = useState(true)
    const [searchTerm, setSearchTerm] = useState("");
    const [clusterData, setClusterData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [options, setOption] = useState([])

    const [resultLength, setResultLength] = useState()

    let { cluster_id } = useParams()

    const { SearchBar } = Search;

    let categories = clusterData.map((i) => i.terms)
    let data = categories.flat()
    console.log('categories', data)



    const columns = [
        {
            dataField: 'name',
            text: 'Term',
            sort: true,


        },
        {
            dataField: 'description',
            text: 'Description',
            sort: true,
            style: {
                maxWidth: '800px',
                textAlign: 'justify',
            },
            formatter: descriptionFormatter,
            searchable: false
        },

        {
            dataField: 'actions',
            formatter: actionButton,
            searchable: false
        }]

    const handleChangeSelect = (selected) => {
        selected ? setSelected(selected) :
            setSelected([])
        console.log(`Option selected:`, selected);
    };

    const handleChangeSearch = event => {
        setSearchTerm(event.target.value);
    };

    const handleDataChange = (dataSize) => {
        let result = Object.values(dataSize)
        setResultLength(result);
    }

    const expandRow = {
        renderer: row => (
            <div>
                <h5>{row.name}</h5>
                <p>{row.description}</p>
            </div>
        )
    };


    React.useEffect(() => {
        async function fetchClusterData() {
            const response_tab = await fetch(baseURL + `/get/cluster/${cluster_id}`);
            const json_tab = await response_tab.json();
            console.log(json_tab)
            console.log(json_tab.sent)
            setClusterData(json_tab.sent);
            setIsLoading(false)
            setResultLength(json_tab.sent.categories.length)
            window.scrollTo(0, 0);
        }
        fetchClusterData()
            .catch((error) => {
                console.log(error, 'catch the hoop')
            });
    }, [cluster_id]
    )



    React.useEffect(() => {
        const s = Object.values(selected).map((item) => item.value)
        const default_results = data
        const results = []
        s.forEach(function (value, key) {
            const v = value
            console.log('value:', v)
            const filter_result = data.filter(o => o.name.toLowerCase().includes(v.toString()))

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
        console.log('search count', results.length, results)


    }, [selected, clusterData]);

    React.useEffect(() => {
        //const l = data.map(item => item.example.filter(object => object.toLowerCase().includes(searchTerm)));

        const results = data.filter(o => o.name.toLowerCase().includes(searchTerm));
        setSearchResults(results)
        console.log('search count', results.length, results)
        setResultLength(results.length)
    }, [searchTerm, clusterData]);

    useEffect(() => {
        function chooseOptions() {
            //let { cluster_id } = useParams()
            if (cluster_id === '18') {
                setOption(options_personal_terms)
            }
            else if (cluster_id === '19') {
                setOption(options_location_terms)
            }
            else if (cluster_id === '20') {
                setOption(options_time_terms)
            }
            else {
                setOption(options_other_terms)
            }
        }
        chooseOptions()
    }, [cluster_id]
    )



    function actionButton(cell, row) {
        return (
            <Button color='secondary' >
                <Link to={`/catalog/clusters/${cluster_id}/${row.id}`}
                    style={{ color: 'white' }}>Visit Page
                         </Link>
            </Button>
        )
    }

    function descriptionFormatter(cell, row) {
        const str = cell.toString() //if cell text is long it will render only first 200 characters
        if (str.length > 100) {
            return (
                <span>
                    <p>{str.slice(0, 200)}...</p>
                </span>
            );
        }
    }

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

    const title = clusterData.map(item => item.cluster)
    return (

        <>
            <ErrorBoundary>
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
                            <Link to={`${url}`}>{title}</Link>

                        </div>
                    </Row>
                </header>
            </ErrorBoundary>

            <main className="content">
                <ErrorBoundary>
                    <Row>
                        <Col sm={{ size: 4, offset: 4 }} >
                            {clusterData.map(item => (<h1 style={{ textAlign: 'center' }}>{item.cluster}</h1>))}

                        </Col>
                    </Row>
                    <br />
                    <Row>
                        {clusterData.map(item => (<p>{item.description}</p>))}
                    </Row>
                </ErrorBoundary>
                <br />
                <hr />
                {categoryView ?
                    <ErrorBoundary>
                        <Row>
                            <Col sm={{ size: 3, offset: 0 }}>

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
                                    options={options}
                                    isMulti
                                    name="colors"
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder='Select Term...'
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
                        <br />
                        <Row>
                            {searchResults.map(term => (
                                <>

                                    <Col sm={{ size: 4 }}>
                                        <Card className='domain_cards'>
                                            <CardBody>
                                                <CardTitle className='domain_cards'
                                                    style={{ textTransform: 'capitalize' }}>
                                                    {term.name}</CardTitle>
                                            </CardBody>
                                            <CardBody>
                                                <ButtonGroup>
                                                    <TermModals
                                                        title={term.name}
                                                        description={term.description}
                                                        id={term.id}
                                                        cluster_id={cluster_id}
                                                    />
                                                    <Button>
                                                        <Link to={`/catalog/clusters/${cluster_id}/${term.id}`}
                                                            style={{ color: 'white' }} >Visit Page
                                                            </Link>
                                                    </Button>
                                                </ButtonGroup>
                                            </CardBody>
                                        </Card>
                                    </Col>


                                </>

                            ))}
                        </Row>
                    </ErrorBoundary>
                    :
                    <ErrorBoundary>
                        <Row>

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
                                                <Col sm={{ size: 3, offset: 0 }}>

                                                </Col>
                                                <Col sm={{ size: 1, offset: 2 }}>
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
                                                        options={options}
                                                        isMulti
                                                        name="colors"
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        placeholder='Select Term...'
                                                    />
                                                </Col>
                                                <Col sm={{ size: 3 }}>
                                                    <SearchBar {...props.searchProps} style={{ width: '350px' }} />
                                                    <p style={{ color: 'gray', marginLeft: '25%', marginTop: '1%' }}
                                                    >Showing {resultLength} results.</p>
                                                </Col>
                                            </Row>
                                            <br />
                                            <BootstrapTable
                                                {...props.baseProps}
                                                bordered={false}
                                                hover={true}
                                                noDataIndication={() => <NoDataIndication />}
                                                expandRow={expandRow}
                                                onDataSizeChange={handleDataChange}
                                            />
                                        </div>
                                    )
                                }
                            </ToolkitProvider>

                        </Row>
                    </ErrorBoundary>
                }
            </main>
            <Foot/>
        </>
    )
}
