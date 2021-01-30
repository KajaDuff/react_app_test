import {
  Link,
  useRouteMatch,
  useHistory
} from "react-router-dom";
import { Button, Row, Col } from 'reactstrap'
import React, { useState } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

import Header from '../_components/header';
import Navbar from '../_components/navbar';
import Foot from '../_components/footer'
import LoadingIndicator from '../_components/loadingIndicator'
import ErrorBoundary from '../_components/ErrorBoundary';
import { baseURL } from '../_helpers/base_url'


export default function TablesList() {

  const [tables_stats, setTables_stats] = React.useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [resultLength, setResultLength] = useState()
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('AuthToken'))
  const { SearchBar } = Search;
 
  let { url } = useRouteMatch();
  const history = useHistory()
  const conn_id = sessionStorage.getItem('conn_id')



  const columns2 = [
    {
      text: 'Table ID',
      dataField: 'table_id',
      sort: true
    },
    {
      text: 'Table Name',
      dataField: 'table_name',
      sort: true,
      formatter: actionTable
    },
    {
      text: 'Description',
      dataField: 'table_description',
      sort: true

    },
    {
      text: 'Created On',
      dataField: 'table_created_on',
      sort: true
    },
    {
      dataField: 'actions'
    },
    {
      dataField: 'actions',
      formatter: actionButton
    }
  ]

  function actionButton(cell, row) {
    return (
      <>

        <Button outline color='secondary' >
          <Link to={`/data/models/MSSQL/${conn_id}/${row.table_id}/edit`}
            style={{ color: 'gray' }}
            onClick={() => sessionStorage.setItem('table_id', row.table_id)}
          >Edit</Link></Button>
        <span> </span>
        <Button color='secondary' >
          <Link to={`/data/models/MSSQL/${conn_id}/${row.table_id}`}
            style={{ color: 'white' }}
            onClick={() => sessionStorage.setItem('table_id', row.table_id)}
          >Visit Page</Link></Button>
      </>

    )
  }

  const handleDataChange = (dataSize) => {
    let result = Object.values(dataSize)
    setResultLength(result);
  }

  React.useEffect(() => {
    async function fetchTables() {
      const response_tab = await fetch(baseURL + `/get_table_list/${conn_id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `${authToken}`
          }
        });
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
        console.log(error, 'catch the hoop')
      });
  }, [conn_id]);

  const data = [...tables_stats]

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

  function actionTable(cell, row) {
    return (<Link to={`/data/models/MSSQL/${conn_id}/${row.table_id}`}
      style={{ color: 'black' }}
      onClick={() => sessionStorage.setItem('table_id', row.table_id)}>{cell}</Link>)
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
            <i className="fas fa-chevron-right"></i>
            <Link to={`${url}`}> MSSQL Tables (connection: {conn_id}) </Link>
          </div>
        </Row>
      </header>
      <main className="content">
        <Row>
          <Col sm={{ size: 5, offset: 5 }}>
            <h1>MSSQL Tables</h1>
            <h3>(connection: {conn_id}) </h3>
          </Col>
        </Row>
        <br />
        <ErrorBoundary>
          {isLoading ? <LoadingIndicator /> :
            <Row>
              <Col sm={{ size: 12 }}>
                <ToolkitProvider
                  keyField='id'
                  data={data}
                  columns={columns2}
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
                        </ Col>
                        <BootstrapTable
                          {...props.baseProps}
                          bordered={false}
                          hover={true}
                          pagination={paginationFactory(options)}
                          noDataIndication={() => <NoDataIndication />}
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
      <Foot />
    </>

  )

}

