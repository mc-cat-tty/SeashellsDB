import React from 'react'
import Main from './Main'
import './App.css';
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { AtlassianNavigation, CustomProductHome, PrimaryButton } from '@atlaskit/atlassian-navigation'
import '@atlaskit/css-reset'
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
      <AtlassianNavigation label="navigator" renderProductHome={ NavHome } primaryItems={[
          <PrimaryButton isHighlighted={pathname === "/manage"}> <NavLink exact activeClassName="current" to="/manage"> Manage </NavLink> </PrimaryButton>,
          <PrimaryButton isHighlighted={pathname === "/visualize"}> <NavLink exact activeClassName="current" to="/visualize"> Visualize </NavLink> </PrimaryButton>,
      ]}/>
      <Main />
    </div>
));

export default App;
