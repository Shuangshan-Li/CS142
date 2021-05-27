import React, {useState} from "react";
import {Grid, Typography, Input, TextField} from "@material-ui/core";
import axios from "axios";

function LoginRegister(props) {
  const [failedLogin, setFailedLogin] = useState("");
  const [loginAttemp, setLoginAttemp] = useState("");
  const [passwordAttemp, setPasswordAttemp] = useState("");
  const [registerNameAttemp, setRegisterNameAttemp] = useState("");
  const [registerPasswordAttemp, setRegisterPasswordAttemp] = useState("");
  const [occupation, setOccupation] = useState("");
  const [passwordVerifyAttemp, setPasswordVerifyAttemp] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [failedRegister, setFailedRegister] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("admin/login", {
        login_name: loginAttemp,
        password: passwordAttemp,
      })
      .then((response) => {
        setFailedLogin("");
        let user = response.data;
        props.changeLoggedIn(user);
        window.location.href = `#/users/${user._id}`;
      })
      .catch((err) => {
        setFailedLogin(err.response.data);
      });
  };

  const handleRegister = (e) => {
    if (registerPasswordAttemp !== passwordVerifyAttemp) {
      setFailedRegister("password does not match!");
      return;
    }
    e.preventDefault();
    axios
      .post("/user", {
        login_name: registerNameAttemp,
        password: registerPasswordAttemp,
        occupation: occupation,
        location: location,
        description: description,
        first_name: firstName,
        last_name: lastName,
      })
      .then((response) => {
        setFailedRegister("");
        let user = response.data;
        props.changeLoggedIn(user);
        window.location.href = `#/users/${user._id}`;
      })
      .catch((err) => {
        setFailedRegister(err.response.data);
      });
  };

  return (
    <Grid container justify="space-around">
      <Grid item>
        <Typography variant="h4" color="inherit">
          Login
        </Typography>

        <Typography variant="body1" color="error">
          {failedLogin}
        </Typography>
        <form onSubmit={handleLogin}>
          <label>
            <TextField
              required
              label="Username"
              type="text"
              value={loginAttemp}
              onChange={(e) => setLoginAttemp(e.target.value)}
            />
          </label>
          <br />
          <label>
            <TextField
              required
              label="Password"
              type="password"
              value={passwordAttemp}
              onChange={(e) => setPasswordAttemp(e.target.value)}
            />
          </label>
          <br />
          <Input type="submit" value="Login" />
        </form>
      </Grid>

      <Grid item>
        <Typography variant="h4" color="inherit">
          Register
        </Typography>
        <Typography variant="body1" color="error">
          {failedRegister}
        </Typography>
        <form onSubmit={handleRegister}>
          <label>
            <TextField
              required
              label="First name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />{" "}
          </label>
          <br />
          <label>
            <TextField
              required
              label="Last name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />{" "}
          </label>
          <br />
          <label>
            <TextField
              required
              label="Username"
              type="text"
              value={registerNameAttemp}
              onChange={(e) => setRegisterNameAttemp(e.target.value)}
            />
          </label>
          <br />
          <label>
            <TextField
              required
              label="Password"
              type="password"
              value={registerPasswordAttemp}
              onChange={(e) => setRegisterPasswordAttemp(e.target.value)}
            />
          </label>
          <br />
          <label>
            <TextField
              required
              error={registerPasswordAttemp !== passwordVerifyAttemp}
              label="Verify Password"
              type="password"
              value={passwordVerifyAttemp}
              onChange={(e) => setPasswordVerifyAttemp(e.target.value)}
            />
          </label>
          <br />
          <label>
            <TextField
              label="Where are you from?"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
          <br />
          <label>
            <TextField
              label="Describe yourself"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <br />
          <label>
            <TextField
              label="Occupation"
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </label>
          <br />
          <Input type="submit" value="Register Me" />
        </form>
      </Grid>
    </Grid>
  );
}

export default LoginRegister;
