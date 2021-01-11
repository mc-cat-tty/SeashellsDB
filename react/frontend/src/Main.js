import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import ViewData from './pages/ViewData'
import ManageData from './pages/ManageData'

const TitledRoute = props => {
    const {title, ...params} = props
    document.title = title;
    return (
        <Route {...params}/>
    )
}

const Main = () => {
    return (
        <Switch>
            <TitledRoute exact path="/" title="Home" component={Home}/>
            <TitledRoute exact path="/view" title="View data" component={ViewData}/>
            <TitledRoute exact path="/manage" title="Manage data" component={ManageData}/>
        </Switch>
    );
}

export default Main;