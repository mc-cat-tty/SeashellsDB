import React from 'react';
import { NavLink } from "react-router-dom";
import { AtlassianNavigation, CustomProductHome, PrimaryButton, Profile } from "@atlaskit/atlassian-navigation";
import Avatar from '@atlaskit/avatar'
import logo from "./logo.png";

// const Navigation = () => (
//     <nav>
//       <ul>
//         <li><NavLink exact activeClassName="current" to="/">Home</NavLink></li>
//         <li><NavLink exact activeClassName="current" to="/view/table">View</NavLink></li>
//         <li><NavLink exact activeClassName="current" to="/manage">Manage</NavLink></li>
//       </ul>
//     </nav>
// );

const NavHome = () => (
    <NavLink exact to="/" tabIndex="-1" style={{ outline: 0 }}>
    <CustomProductHome
    logoAlt="Home"
    logoUrl={logo}
    iconAlt="Home"
    iconUrl={logo}
    />
    </NavLink>
);

const NavProfile = () => {
    const onClick = () => {
        console.log("t");  // TODO
    }
    return (
        <Profile
          tooltip="Your profile and settings"
          onClick={onClick}
          icon={
            <Avatar
                appearance="circle"
                src="" // TODO
                size="small"
            />
          }
        />
    );
}

const Navigator = ({pathname}) => (
    <AtlassianNavigation label="navigator" renderProductHome={ NavHome } primaryItems={[
        <NavLink exact activeClassName="current"  tabIndex="-1" style={{ textDecoration: 'none', outline: 0 }} to="/manage"><PrimaryButton isHighlighted={pathname === "/manage"}> Manage </PrimaryButton></NavLink>,
        <NavLink exact activeClassName="current"  tabIndex="-1" style={{ textDecoration: 'none', outline: 0 }} to="/view/table"><PrimaryButton isHighlighted={pathname.startsWith("/view")}> View </PrimaryButton></NavLink>,
    ]} renderProfile={ NavProfile }
    />
);

export default Navigator;