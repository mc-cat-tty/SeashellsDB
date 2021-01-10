import React from 'react'
import Main from './Main'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { AtlassianNavigation, CustomProductHome, PrimaryButton } from '@atlaskit/atlassian-navigation'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';

import '@atlaskit/css-reset'
import './App.css';

import logo from './logo.png'

// const Navigation = () => (
//     <nav>
//       <ul>
//         <li><NavLink exact activeClassName="current" to="/">Home</NavLink></li>
//         <li><NavLink exact activeClassName="current" to="/visualize">Visualize</NavLink></li>
//         <li><NavLink exact activeClassName="current" to="/manage">Manage</NavLink></li>
//       </ul>
//     </nav>
// );

const NavHome = () => (
    <NavLink exact to="/">
    <CustomProductHome
    href="#"
    logoAlt="Home"
    logoUrl={logo}
    />
    </NavLink>
)

const App = withRouter(({ location: { pathname } }) => (
    <div className="app">
        <Container>
            <Card style={{padding:"2px"}} className="shadow">
                <AtlassianNavigation label="navigator" renderProductHome={ NavHome } primaryItems={[
                    <PrimaryButton isHighlighted={pathname === "/manage"}> <NavLink exact activeClassName="current" to="/manage"> Manage </NavLink> </PrimaryButton>,
                    <PrimaryButton isHighlighted={pathname === "/visualize"}> <NavLink exact activeClassName="current" to="/visualize"> Visualize </NavLink> </PrimaryButton>,
                ]}/>
                <Main />
                <Card.Footer className="text-muted text-center" style={{marginTop:"20px", marginBottom: "-2px", marginRight: "-2px", marginLeft: "-2px", backgroundColor: "#DEEBFF"}}>
                    <strong>SeashellsDB</strong> by Francesco Mecatti
                    <br />
                    Progetto sistemi 2021
                </Card.Footer>
            </Card>
        </Container>
    </div>
));

export default App;
