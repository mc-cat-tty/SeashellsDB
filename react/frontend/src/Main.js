import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import VisualizeData from './pages/VisualizeData'
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
            <TitledRoute exact path="/visualize" title="Visualize data" component={VisualizeData}/>
            <TitledRoute exact path="/manage" title="Manage data" component={ManageData}/>
        </Switch>
    );
}

export default Main;