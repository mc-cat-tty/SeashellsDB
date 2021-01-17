import React from 'react';
import {useHistory, useLocation, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';
import ViewData from './pages/ViewData';
import ManageData from './pages/ManageData';

const TitledRoute = props => {
    const {title, ...params} = props;
    document.title = title;
    return (
        <Route {...params}/>
    );
}


const Main = () => {
    const history = useHistory();
    React.useEffect(() => {
        history.push(localStorage.getItem('route') || '/');
    }, []);

    const location = useLocation();
    React.useEffect(() => {
        localStorage.setItem('route', location.pathname);
    }, [location])

    return (
        <Switch>
            <TitledRoute exact path="/" title="Home" component={Home}/>
            <TitledRoute exact path="/view/:viewtype" title="View data" component={ViewData}/>
            <TitledRoute exact path="/manage" title="Manage data" component={ManageData}/>
        </Switch>
    );
}

export default Main;