import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {Typography, Grid, Button, Divider} from "@material-ui/core";
import Mention from "./Mention";
import "./userDetail.css";
import axios from "axios";
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
    mentioned: [],
  });

  useEffect(() => {
    let promise = axios.get(`/user/${props.match.params.userId}`);
    promise
      .then((response) => {
        setUser(response.data);
        props.changeView(
          "Info about ",
          `${response.data.first_name} ${response.data.last_name}`
        );
      })
      .catch((e) => {
        console.log(e.response ? e.response : e.request);
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
        <br />
        <Divider />
        <br />
        <Typography variant="body1">Mentioned in:</Typography>
        <br />
        {user.mentioned.length > 0 ? (
          user.mentioned.map((photo_id, i) => {
            return <Mention key={photo_id + i} photo_id={photo_id} />;
          })
        ) : (
          <Typography variant="h4">Not Mentioned Anywhere</Typography>
        )}
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
