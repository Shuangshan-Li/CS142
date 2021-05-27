import React, {useState, useEffect} from "react";
import {Typography, Grid} from "@material-ui/core";
import axios from "axios";
import FavoriteCard from "./FavoriteCard";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const refresh = () => {
    axios
      .get("/fetchFavorites")
      .then((response) => {
        setFavorites(response.data);
      })
      .catch((err) => console.log(err.response ? err.response : err.request));
  };
  // Stop update on an unmounted component with a local variable
  // https://stackoverflow.com/questions/56442582/react-hooks-cant-perform-a-react-state-update-on-an-unmounted-component
  useEffect(() => {
    let isCancelled = false;
    axios
      .get("/fetchFavorites")
      .then((response) => {
        if (!isCancelled) {
          setFavorites(response.data);
        }
      })
      .catch((err) => console.log(err.response ? err.response : err.request));
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <Grid container justify="space-around" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h4">Favorite Photos</Typography>
        <br />
      </Grid>
      {favorites.map((photo) => (
        <Grid item xs={3} key={photo.file_name}>
          <FavoriteCard refreshCards={refresh} photo={photo} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Favorites;
