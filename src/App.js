import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,

} from "react-router-dom";

import ScrollToTop from './_components/scrollToTop'

import DatabaseConnectionForm from './other_pages/dataEntryForm'
import Home from './other_pages/homepage'

import Guides from './help/guides'
import About from './help/about'
import Contacts from './help/contacts'
import CatalogClusters from './catalog/CatalogClusters'
import TablesList from './data/tablesList'
import ColumnStats from "./data/columnStats";
import TableStats from './data/tablesStats'
import ModelsOverview from "./data/modelsOverview";
import MssqlConnections from './data/msqlConnections'
import EditAIResults from './data/editAIResults'
import PageInProgress from './other_pages/pageInProgress'
import LoginPage from './other_pages/LoginPage'
import CatalogAll from './catalog/CatalogAll'

import 'bootstrap/dist/css/bootstrap.min.css'
import ClusterData from "./catalog/ClusterData";
import Term from "./catalog/Term";


import { AuthContext } from "./_context/auth";
import PrivateRoute from './_components/privateRoute';


export default function App(props) {

    const [authTokens, setAuthTokens] = useState();
  
    const setTokens = (data) => {
      localStorage.setItem("tokens", JSON.stringify(data));
      sessionStorage.setItem("tokens", JSON.stringify(data));
      setAuthTokens(data);
      console.log(data)
      console.log(localStorage)
    }

    return (
        <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
            <Router>
                <ScrollToTop>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/login" children={<LoginPage />} />
                        <Route exact path="/data_entry" component={DatabaseConnectionForm} />

                        <Route exact path="/catalog/clusters" component={CatalogClusters} />
                        <Route exact path="/catalog/all" component={CatalogAll} />
                        <Route exact path="/catalog/clusters/:cluster_id/:term_id" component={Term} />
                        <Route exact path="/catalog/clusters/:cluster_id" component={ClusterData} />

                        <Route exact path='/data/models' component={ModelsOverview} />
                        <Route exact path="/data/models/MSSQL" component={MssqlConnections} />
                        <Route exact path='/data/models/MSSQL/:conn_id' component={TablesList} />
                        <Route exact path='/data/models/MSSQL/:conn_id/:table_id' component={TableStats} />
                        <Route exact path='/data/models/MSSQL/:conn_id/:table_id/edit' component={EditAIResults} />
                        <Route exact path='/data/models/MSSQL/:conn_id/:table_id/:column_id' component={ColumnStats} />
                        <Route exact path='/data/vehicle' component={PageInProgress} />

                        <Route path="/help/about" component={About} />
                        <Route path="/help/guides" component={Guides} />
                        <Route path="/help/contacts" component={Contacts} />
                    </Switch>
                </ScrollToTop>
            </Router>
        </AuthContext.Provider>
    );
}






