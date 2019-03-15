import React, { Component } from "react";
import { Auth } from "aws-amplify";


import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from 'mdbreact';

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class CustomSignIn extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.gotoSignUp = this.gotoSignUp.bind(this);
  }

  gotoSignUp() {
    // to switch the authState to 'signIn'
    this.props.onStateChange('signUp',{});
  }

  componentWillMount() {
  }

  onSubmit = event => {
    const { email, password } = this.state;

    Auth.signIn(email, password)
      .then(user => {
        this.setState(() => ({ ...INITIAL_STATE }));
        if (
          user.challengeName === "SMS_MFA" ||
          user.challengeName === "SOFTWARE_TOKEN_MFA"
        ) {
          this.changeState("confirmSignIn", user);
          //console.log("test")
        } else if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          this.changeState("requireNewPassword", user);
        } else if (user.challengeName === "MFA_SETUP") {
          this.changeState("TOTPSetup", user);
        } else {
          this.props.onStateChange('signedIn',{});
        }
      })
      .catch(err => {
        const { authError } = this.props;
        if (err.code === "UserNotConfirmedException") {
          this.changeState("confirmSignUp");
        } else if (err.code === "PasswordResetRequiredException") {
          this.changeState("requireNewPassword");
        } else {
          //authError(err);
          console.log(err);
        }
        this.setState(updateByPropertyName("error", err));
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div>
        { this.props.authState === 'signIn' && 
          <MDBContainer>
            <MDBRow>
              <MDBCol md="6">
                <form onSubmit={this.onSubmit}>
                  <p className="h4 text-center py-4">Subscribe</p>
                  <label
                    htmlFor="defaultFormCardNameEx"
                    className="grey-text font-weight-light"
                  >
                    Your email
                  </label>
                  <input
                    value={email}
                    onChange={event =>
                      this.setState(updateByPropertyName("email", event.target.value))
                    }
                    type="text"
                    id="defaultFormCardNameEx"
                    className="form-control"
                  />
                  <br />
                  <label
                    htmlFor="defaultFormCardEmailEx"
                    className="grey-text font-weight-light"
                  >
                    Your password
                  </label>
                  <input
                    value={password}
                    onChange={event =>
                      this.setState(
                        updateByPropertyName("password", event.target.value)
                      )
                    }
                    type="password"
                    id="defaultFormCardEmailEx"
                    className="form-control"
                  />
                  <div className="text-center py-4 mt-3">
                    <MDBBtn className="btn btn-outline-purple" disabled={isInvalid} type="submit">
                      Send
                      <MDBIcon far icon="paper-plane" className="ml-2" />
                    </MDBBtn>
                    {error && <p>{error.message}</p>}
                  </div>
                </form>
                <div>
                  <p> No account? </p>
                  <button
                    onClick={() => this.gotoSignUp()}
                  >
                    Create account
                  </button>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          }
      </div>
    );
  }
}

export default CustomSignIn;
