import React from "react";
import {Link} from "react-router-dom";
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  FormLabel,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@material-ui/core";

import "./TopBar.css";
import axios from "axios";
/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: this.props.view,
      version: "",
      uploadDialogOpen: false,
      permissionSpecified: false,
      otherUsers: [],
      usersChecked: {},
      visible: true,
    };
  }

  componentDidMount() {
    let promise = axios.get("/test/info");
    promise
      .then((response) => {
        this.setState({version: response.data.__v});
      })
      .catch((e) => {
        console.log(e.response ? e.response : e.request);
      });
    if (this.props.current_user) {
      axios
        .get("/otherUsers/list")
        .then((response) => {
          this.setState({otherUsers: response.data});
        })
        .catch((err) => console.log(err.response));
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.view != this.props.view) {
      this.setState({view: this.props.view});
      let promise = axios.get("http://localhost:3000/test/info");
      promise
        .then((response) => {
          this.setState({version: response.data.__v});
        })
        .catch((e) => {
          console.log(e.response ? e.response : e.request);
        });
    }
    if (
      prevProps.current_user !== this.props.current_user &&
      this.props.current_user
    ) {
      axios
        .get("/otherUsers/list")
        .then((response) => {
          this.setState({
            otherUsers: response.data,
            permissionSpecified: false,
            usersChecked: {},
          });
        })
        .catch((err) => console.log(err.response ? err.response : err.request));
    }
  }

  handleLogOut = () => {
    let promise = axios.post("/admin/logout");
    promise
      .then(() => {
        this.props.changeLoggedIn(undefined);
      })
      .catch((e) => {
        console.log(e.response ? e.response : e.request);
      });
  };

  handleCloseDialog = () => {
    this.setState({uploadDialogOpen: false});
  };

  uploadButton = () => {
    this.setState({uploadDialogOpen: true});
  };

  changePermissionSpecified = () => {
    this.setState({
      permissionSpecified: !this.state.permissionSpecified,
      visible: this.state.permissionSpecified,
    });
  };

  changeFriendPermit = (id) => () => {
    let {usersChecked} = this.state;
    usersChecked[id] = !usersChecked[id];
    this.setState({usersChecked});
  };

  handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (!this.state.permissionSpecified) {
      this.setState({
        usersChecked: this.state.otherUsers.map(({_id}) => {
          return {[_id]: true};
        }),
      });
    }
    if (this.uploadInput.files.length > 0) {
      const domForm = new FormData();
      domForm.append("uploadedphoto", this.uploadInput.files[0]);
      domForm.append("usersPermissed", JSON.stringify(this.state.usersChecked));
      domForm.append("visible", JSON.stringify(this.state.visible));

      axios
        .post("/photos/new", domForm)
        .then(() => {
          this.setState({
            uploadDialogOpen: false,
            permissionSpecified: false,
            usersChecked: {},
            visible: true,
          });

          window.location.href = `#/photos/${this.props.current_user._id}`;
        })
        .catch((err) => console.log(`POST ERR: ${err}`));
    }
  };

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          {this.props.current_user ? (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignContent="center"
            >
              <Grid item>
                <Typography variant="h5" color="inherit">
                  Hi {this.props.current_user.first_name}
                </Typography>
                <Typography variant="body1">
                  version: {this.state.version}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="inherit">
                  {this.state.view}
                </Typography>
              </Grid>
              <Grid item>
                <Link to="/favorites">
                  <Button
                    onClick={() => this.props.changeView("Favorites", "")}
                    variant="contained"
                    color="primary"
                  >
                    Favorites
                  </Button>
                </Link>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.uploadButton}
                >
                  Upload New Photo
                </Button>
                <Dialog
                  open={this.state.uploadDialogOpen}
                  onClose={this.handleCloseDialog}
                >
                  <form onSubmit={this.handleUploadButtonClicked}>
                    <FormLabel>
                      <input
                        type="file"
                        accept="image/*"
                        ref={(domFileRef) => {
                          this.uploadInput = domFileRef;
                        }}
                      />
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={this.state.permissionSpecified}
                            onChange={this.changePermissionSpecified}
                          />
                        }
                        label="Do you want to specify permission?"
                      />
                    </FormGroup>

                    {this.state.permissionSpecified && (
                      <div>
                        <FormLabel>
                          Choose the friends who get viewing permissions:
                        </FormLabel>
                        <FormGroup>
                          {this.state.otherUsers &&
                            this.state.otherUsers.map((userObj) => {
                              return (
                                <FormControlLabel
                                  key={userObj._id}
                                  control={
                                    // stop Checkbox from becoming uncontroll because of checked===undefined
                                    // https://stackoverflow.com/questions/47012169/a-component-is-changing-an-uncontrolled-input-of-type-text-to-be-controlled-erro
                                    <Checkbox
                                      checked={
                                        this.state.usersChecked[userObj._id] ||
                                        false
                                      }
                                      onChange={this.changeFriendPermit(
                                        userObj._id
                                      )}
                                      value={userObj._id}
                                    />
                                  }
                                  label={`${userObj.first_name} ${userObj.last_name}`}
                                />
                              );
                            })}
                        </FormGroup>
                      </div>
                    )}
                    <Button variant="contained" color="primary" type="submit">
                      Upload
                    </Button>
                  </form>
                </Dialog>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={this.handleLogOut}>
                  Logout
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="h5">Please login</Typography>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
