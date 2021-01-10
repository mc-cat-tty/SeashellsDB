import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './pages/Home'
import VisualizeData from './pages/VisualizeData'
import ManageData from './pages/ManageData'

const Main = () => (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/visualize" component={VisualizeData}/>
            <Route exact path="/manage" component={ManageData}/>
        </Switch>
);

export default Main;