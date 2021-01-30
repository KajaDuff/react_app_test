import React, { useState } from "react";
import {
    Link,
    useRouteMatch,
    useHistory
} from "react-router-dom";
import {
    Card, Button,
    CardTitle,
    CardBody, Row, Col,
    ButtonGroup
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import Select from 'react-select'


import Header from '../_components/header';
import Navbar from '../_components/navbar';
import Foot from '../_components/footer'
import ErrorBoundary from "../_components/ErrorBoundary";
import CatModals from './CatModal'
import { options_cluster } from '../_helpers/constants'
import { baseURL } from '../_helpers/base_url'

import '../styles/other_pages.css'
import '../styles/data.css'





const columns = [{
    dataField: 'cluster',
    text: 'Cluster',
    sort: true,
    formatter: categoryFormatter,
    style: (cell) => {
        return {
            textTransform: 'capitalize',
            minWidth: '250px'
        }
    }
}, {
    dataField: 'description',
    text: 'Description',
    sort: true,
    style: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        minWidth: '900px'
    }

},
{
    dataField: 'actions',
    text: 'Actions',
    formatter: actions
}];



function actions(cell, row) {

    return (
        <Button color='secondary' >
            <Link to={`/catalog/clusters/${row.id}`} style={{ color: 'white' }}>Visit Page</Link>
        </Button>
    )

}


function categoryFormatter(cell, row) {
    console.log('cell:', cell.toString())
    const new_cell = cell.toString().split("_").join(" ")
    return (<Link to={`/catalog/clusters/${row.id}`}
        style={{ color: 'black' }}>{new_cell}</Link>)
}



export default function CatalogClusters() {

    const [categoryView, setCategoryView] = useState(true)

    const [searchTerm, setSearchTerm] = React.useState("");
    const [selected, setSelected] = React.useState([]);
    const [searchResults, setSearchResults] = React.useState([]);

    const { SearchBar } = Search;
    const { url } = useRouteMatch();
    const history = useHistory()

    const handleChangeSelect = (selected) => {
        selected ? setSelected(selected) :
            setSelected([])
        console.log(`Option selected:`, selected);
    };

    const handleChangeSearch = event => {
        setSearchTerm(event.target.value);
    };

    const [clusters, setClusters] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [resultLength, setResultLength] = useState()

    let data = [...clusters]



    React.useEffect(() => {
        async function fetchClusters() {
            const response_tab = await fetch(baseURL + `/get/cluster`);
            const json_tab = await response_tab.json();
            console.log(json_tab)
            console.log(json_tab.sent)
            setClusters(json_tab.sent);
            setIsLoading(false)
            setResultLength(json_tab.sent.length)
            window.scrollTo(0, 0);
        }
        fetchClusters()
            .catch((error) => {
                console.log(error, 'catch the hoop')
            });
    }, []
    )
    React.useEffect(() => {
        const s = Object.values(selected).map((item) => item.value)
        const default_results = data
        const results = []
        s.forEach(function (value, key) {
            const v = value
            console.log('value:', v)
            const filter_result = data.filter(o => o.cluster.includes(v.toString()))

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
        
    }, [selected, clusters]);
    React.useEffect(() => {
        //const l = data.map(item => item.example.filter(object => object.toLowerCase().includes(searchTerm)));

        const results = data.filter(o => o.description.toString().includes(searchTerm)
            || o.cluster.toLowerCase().includes(searchTerm))
            ;
        setSearchResults(results)
        console.log('search count', results.length, results)
        setResultLength(results.length)
    }, [searchTerm, clusters]);

    const handleDataChange = (dataSize) => {
        let result = Object.values(dataSize)
        setResultLength(result);
    }
    function Icons(props) {
        const category = props.cluster;
        if (category === 'Personal data') {
            return <i className="fas fa-users"></i>;
        }
        else if (category === 'Time data') {
            return <i className="far fa-calendar-alt"></i>
        }
        else if (category === 'Location data') {
            return <i className="fas fa-map-marked-alt"></i>
        }
        else if (category === 'Other data') {
            return <i className="fas fa-ellipsis-h"></i>
        }
        return <p>No icon</p>;
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
                        <Link to={`${url}`}>Catalog<i className="fas fa-chevron-right"></i>Clusters</Link>
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
                                        <Button>
                                            <Link to='/catalog/clusters'
                                                style={{ color: 'white' }} >Clusters</Link>
                                        </Button>
                                        <Button outline color="secondary">
                                            <Link to='/catalog/all'
                                                style={{ color: 'gray' }} >All Terms</Link>
                                        </Button>
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
                            <Row xs="1" sm="2" md="2" lg="4" >
                                {searchResults.map((item, index) => (
                                    <Col key={index} sm={{ size: 4 }}>
                                        <Card className='domain_cards' style={{ height: '250px' }}>
                                            <CardBody>
                                                <CardTitle className='domain_cards'
                                                    style={{
                                                        textTransform: 'capitalize',
                                                        fontSize: '1.5rem'
                                                    }}>
                                                    {item.cluster.split("_").join(" ")}</CardTitle>
                                            </CardBody>
                                            <Icons cluster={item.cluster} />
                                            <CardBody>
                                                <ButtonGroup>
                                                    <CatModals
                                                        title={item.cluster}
                                                        description={item.description}
                                                        id={item.id}
                                                    />
                                                    <Button>
                                                        <Link to={`${url}/${item.id}`} style={{ color: 'white' }}>Visit Page</Link>
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

                    (<div>
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
                                                        <ButtonGroup>
                                                            <Button>
                                                                <Link to='/catalog/clusters'
                                                                    style={{ color: 'white' }} >Clusters</Link>
                                                            </Button>
                                                            <Button outline color="secondary">
                                                                <Link to='/catalog/all'
                                                                    style={{ color: 'gray' }} >All Terms</Link>
                                                            </Button>
                                                        </ButtonGroup>
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
                            </Row>
                        </ErrorBoundary>
                    </div>

                    )}
            </main>
            <Foot/>
        </>
    )
}
