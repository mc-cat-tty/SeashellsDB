import React from 'react';
import Main from './Main';
import { withRouter } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Navigator from './Navigator';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@atlaskit/css-reset';
import './App.css';

const AppContainer = ({children}) => (
    <Container>
        <Card style={{padding:"2px"}} className="shadow">
            {children}
        </Card>
    </Container>
);

const App = withRouter(({ location: { pathname } }) => (
    <div className="app">
        <AppContainer>
            <Navigator pathname={pathname}/>
            <Main />
            <Card.Footer className="text-muted text-center" style={{marginTop:"20px", marginBottom: "-2px", marginRight: "-2px", marginLeft: "-2px", backgroundColor: "#DEEBFF"}}>
                <strong>SeashellsDB</strong> by Francesco Mecatti
                <br />
                Progetto sistemi 2021
            </Card.Footer>
        </AppContainer>
    </div>
));

export default App;
