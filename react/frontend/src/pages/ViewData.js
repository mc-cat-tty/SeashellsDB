import React from 'react';
import {useHistory, Route, Switch} from 'react-router-dom';
import Table from './ViewDataStructures/Table';
import ViewTableTree from './ViewDataStructures/TableTree';
import Tree from './ViewDataStructures/Tree';
import Nav from 'react-bootstrap/Nav';

import './ViewData.css';

const SwitchView = () => {
    const [ActiveView, setActiveView] = React.useState('/view/table');
        const history = useHistory();
    const handleSelect = selected => {
        history.push(selected);
        setActiveView(selected);
    }

    const SwitchNavLink = ({children, link}) => (
            <Nav.Link className="navlink" eventKey={link}>{children}</Nav.Link>
    );

    return (
    <Nav variant="pills" className="justify-content-center" defaultActiveKey={ActiveView} style={{padding: "20px"}} onSelect={handleSelect}>
        <Nav.Item>
            <SwitchNavLink link="/view/table">Table</SwitchNavLink>
        </Nav.Item>
        <Nav.Item>
            <SwitchNavLink link="/view/tabletree">Table Tree</SwitchNavLink>
        </Nav.Item>
        <Nav.Item>
            <SwitchNavLink link="/view/tree">Tree</SwitchNavLink>
        </Nav.Item>
    </Nav>
)};

const View = () => (
    <Switch>
        <Route exact path="/view/table" component={Table}/>
        <Route exact path="/view/tabletree" component={ViewTableTree}/>
        <Route exact path="/view/tree" component={Tree}/>
    </Switch>
);

const ViewData = () => (
    <div className="visualizedata">
        <SwitchView />
        <View />
    </div>
);

export default ViewData;