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
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Stop update on an unmounted component with a local variable
    // https://stackoverflow.com/questions/56442582/react-hooks-cant-perform-a-react-state-update-on-an-unmounted-component
    let isCancelled = false;
    let promise_photos = axios.get(
      `/photosOfUser/${props.match.params.userId}`
    );
    let promise_users = axios.get(`/user/${props.match.params.userId}`);
    promise_photos
      .then((response) => {
        if (!isCancelled) {
          setPhotos(response.data);
        }
      })
      .catch((e) => console.log(e.response ? e.response : e.request));
    promise_users
      .then((response) => {
        if (!isCancelled) {
          setUser(response.data);
          props.changeView(
            "Photos of ",
            `${response.data.first_name} ${response.data.last_name}`
          );
        }
      })
      .catch((e) => console.log(e.response ? e.response : e.request));
    axios
      .get(`/fetchFavorites`)
      .then((response) => {
        if (!isCancelled) {
          let result = response.data.map((photo) => photo._id);
          setFavorites(result);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });

    return () => {
      isCancelled = true;
    };
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
    axios
      .get(`/fetchFavorites`)
      .then((response) => {
        let result = response.data.map((photo) => photo._id);
        setFavorites(result);
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

      {photos ? (
        photos.map(
          (p) =>
            (p.users_permitted.indexOf(props.current_user_id) > -1 ||
              p.visible) && (
              <Grid item xs={6} key={p._id}>
                <PhotoCard
                  creator={user}
                  refreshCards={refresh}
                  photo={p}
                  liked={p.liked_by.indexOf(props.current_user_id) > -1}
                  favorited={favorites.indexOf(p._id) > -1}
                />
              </Grid>
            )
        )
      ) : (
        <div />
      )}
    </Grid>
  );
}

export default UserPhotos;
