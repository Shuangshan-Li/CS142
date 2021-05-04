import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {Typography, Grid, Button} from "@material-ui/core";
import "./userDetail.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
function UserDetail(props) {
  const [user, setUser] = useState({
    _id: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });

  useEffect(() => {
    let promise = fetchModel(
      `http://localhost:3000/user/${props.match.params.userId}`
    );
    promise.then((response) => {
      setUser(response.data);
      props.changeView(
        "Info about ",
        `${response.data.first_name} ${response.data.last_name}`
      );
    });
  }, [props.match.params.userId]);

  return (
    <Grid container justify="space-evenly" alignItems="center">
      <Grid xs={8} item>
        <Typography variant="h3">
          {`${user.first_name} ${user.last_name}`}
        </Typography>
        <Typography variant="h5">
          {user.occupation} <br />
          Based in {user.location}
        </Typography>
        <Typography variant="body1">{user.description}</Typography>
      </Grid>
      <Grid xs={4} item>
        <Button variant="contained" size="large">
          <Link to={`/photos/${user._id}`}>See photos</Link>
        </Button>
      </Grid>
    </Grid>
  );
}

export default UserDetail;
