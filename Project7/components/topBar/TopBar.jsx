import React from "react";
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  Input,
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
    };
  }

  componentDidMount() {
    let promise = axios.get("http://localhost:3000/test/info");
    promise
      .then((response) => {
        this.setState({version: response.data.__v});
      })
      .catch((e) => {
        console.log(e.response ? e.response : e.request);
      });
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
  }

  handleLogOut = () => {
    let promise = axios.post("/admin/logout");
    promise
      .then((res) => {
        this.props.changeLoggedIn(undefined);
        console.log("logged out!", res);
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

  handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {
      const domForm = new FormData();
      domForm.append("uploadedphoto", this.uploadInput.files[0]);

      axios
        .post("/photos/new", domForm)
        .then(() => {
          this.setState({uploadDialogOpen: false});
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
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={(domFileRef) => {
                          this.uploadInput = domFileRef;
                        }}
                      />
                    </label>
                    <Input color="primary" type="submit" value="Upload" />
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
