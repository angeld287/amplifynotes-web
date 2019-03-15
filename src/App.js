import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Authenticator, SignIn, SignUp } from 'aws-amplify-react';
import queryString from 'query-string'

import {
  MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBFormInline,
  MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem
  } from "mdbreact";

import {
  Link,
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import Notes from './notes';
import IntroductionPage from './components/IntroductionPage/IntroductionPage';
import SubscriptionPage from './components/SubscriptionPage/SubscriptionPage';
import CustomSignIn from './components/AmplifyCognitoCustomUI/SignIn/CustomSignIn';

import Amplify, {API,graphqlOperation,Auth} from 'aws-amplify';
import { withAuthenticator} from 'aws-amplify-react'; 
import aws_exports from './aws-exports'; // specify the location of aws-exports.js file on your project
/* Amplify.configure(aws_exports); */


//about, secret, auth
class HeaderLinks extends Component {
  render() {
    return (
      <MDBNavbar color="indigo" dark expand="md">
            <MDBCollapse id="navbarCollapse3" /* isOpen={this.state.isOpen} */ navbar>
              <MDBNavbarNav left>
                <MDBNavItem active>
                  <MDBNavLink to="/">Home</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink to="/about">About Page</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink to="/secret">Secret Page</MDBNavLink>
                </MDBNavItem>
              </MDBNavbarNav>
              <MDBNavbarNav right>
                <MDBNavItem>
                  <MDBNavLink to="/auth">LogIn</MDBNavLink>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
      </MDBNavbar>
    );
  }
}

const ProtectedRoute = ({ render: C, props: childProps, ...rest }) => (
  <Route
    {...rest}
    render={rProps =>
      childProps.isLoggedIn ? (
        <C {...rProps} {...childProps} />
      ) : (
        <Redirect
          to={`/auth?redirect=${rProps.location.pathname}${
            rProps.location.search
          }`}
        />
      )
    }
  />
);

const ProppedRoute = ({ render: C, props: childProps, ...rest }) => (
  <Route {...rest} render={rProps => <C {...rProps} {...childProps} />} />
);

class AuthComponent extends Component {
  constructor(props){
    super(props);
    this.state={
    };
  }

  handleStateChange = state => {
    const values = queryString.parse(this.props.location.search)
    console.log(state);
    if (state === 'signedIn') {
      this.props.onUserSignIn();
      console.log(values.redirect);
      this.props.history.push(values.redirect);
    }else if (state === 'signIn') {
      this.props.onUserLogOut();
    }
  };

  render() {
    return (
      <div>
        <Authenticator 
          authState="signIn" 
          amplifyConfig={aws_exports}
          hide={ 
              [
                  SignIn,
              ]
          }
          //hideDefault={true}
          onStateChange={this.handleStateChange}
        >
            <CustomSignIn override={SignIn}/>
        </Authenticator>
      </div>
    );
  }
}

const Routes = ({ childProps }) => (
  <Switch>
    <Route exact path="/" render={() => <IntroductionPage/>} />
    <ProppedRoute
      exact
      path="/auth"
      render={AuthComponent}
      props={childProps}
    />
    <ProtectedRoute
      exact
      path="/secret"
      render={() => <Notes/>}
      props={childProps}
    />
    <ProtectedRoute
      exact
      path="/subscribe"
      render={() => <SubscriptionPage/>}
      props={childProps}
    />
    <Route exact path="/about" render={() => <div>About Content</div>} />
  </Switch>
);

class App extends Component {
  state = {
    authState: {
      isLoggedIn: false
    }
  };

  handleUserSignIn = () => {
    this.setState({ authState: { isLoggedIn: true } });
  };

  handleUserLogOut = () => {
    this.setState({ authState: { isLoggedIn: false } });
  };
  
  
  render() {

    const childProps = {
      isLoggedIn: this.state.authState.isLoggedIn,
      onUserSignIn: this.handleUserSignIn,
      onUserLogOut: this.handleUserLogOut
    };


    return (
      <div className="App">
        <HeaderLinks />
        <br />
        <Routes childProps={childProps} />
      </div>
    );
  }
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;