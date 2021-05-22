import React, {useState, useEffect} from "react";
import {Typography, Grid} from "@material-ui/core";
import PhotoCard from "./PhotoCard";
import "./userPhotos.css";
import axios from "axios";

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
function UserPhotos(props) {
  const [user, setUser] = useState({
    _id: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    let promise_photos = axios.get(
      `http://localhost:3000/photosOfUser/${props.match.params.userId}`
    );
    let promise_users = axios.get(
      `http://localhost:3000/user/${props.match.params.userId}`
    );
    promise_photos
      .then((response) => {
        setPhotos(response.data);
      })
      .catch((e) => console.log(e.response ? e.response : e.request));
    promise_users
      .then((response) => {
        setUser(response.data);
        props.changeView(
          "Photos of ",
          `${response.data.first_name} ${response.data.last_name}`
        );
      })
      .catch((e) => console.log(e.response ? e.response : e.request));
  }, [props.match.params.userId]);

  const refresh = () => {
    axios
      .get(`/photosOfUser/${props.match.params.userId}`)
      .then((response) => {
        setPhotos(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <Grid container justify="space-evenly" alignItems="flex-start">
      <Grid item xs={12}>
        <Typography variant="h3">
          {user.first_name} {user.last_name}&apos;s Photos
        </Typography>
      </Grid>
      <div className="cs142-photo-buffer" />
      {photos.map((p) => (
        <Grid item xs={6} key={p._id}>
          <PhotoCard creator={user} refreshCards={refresh} photo={p} />
        </Grid>
      ))}
    </Grid>
  );
}

export default UserPhotos;
