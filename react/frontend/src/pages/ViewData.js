import React from 'react';
import {NavLink, Route, Switch} from 'react-router-dom';
import Table from './ViewDataStructures/Table';
import TableTree from './ViewDataStructures/TableTree';
import Tree from './ViewDataStructures/Tree';
import Nav from 'react-bootstrap/Nav'

import './ViewData.css'

const SwitchView = () => (  // TODO: Current selected doesn't update, router and not href
    <Nav variant="pills" className="justify-content-center" defaultActiveKey="/view/table" style={{padding: "20px"}}>
        <Nav.Item>
            <Nav.Link className="navlink" href="/view/table">Table</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link className="navlink" href="/view/tabletree" eventKey="link-1">Table Tree</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link className="navlink" href="/view/tree" eventKey="link-2">Tree</Nav.Link>
        </Nav.Item>
    </Nav>
)

const View = () => (
    <Switch>
        <Route exact path="/view/table" component={Table}/>
        <Route exact path="/view/tabletree" component={TableTree}/>
        <Route exact path="/view/tree" component={Tree}/>
    </Switch>
)

const ViewData = () => (
    <div className="visualizedata">
        <SwitchView />
        <View />
    </div>
);

export default ViewData;