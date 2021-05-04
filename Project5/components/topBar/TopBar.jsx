import React from "react";
import {AppBar, Grid, Toolbar, Typography} from "@material-ui/core";
import "./TopBar.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: this.props.view,
      version: "",
    };
  }

  componentDidMount() {
    let promise = fetchModel("http://localhost:3000/test/info");
    promise.then((response) => {
      this.setState({version: response.data.__v});
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.view != this.props.view) {
      this.setState({view: this.props.view});
      let promise = fetchModel("http://localhost:3000/test/info");
      promise.then((response) => {
        this.setState({version: response.data.__v});
      });
    }
  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignContent="center"
          >
            <Grid item xs={4}>
              <Typography variant="h5" color="inherit">
                Shuangshan Li
              </Typography>
              <Typography variant="body1">
                version: {this.state.version}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h5" color="inherit">
                {this.state.view}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
