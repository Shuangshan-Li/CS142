import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import fetchModel from "../../lib/fetchModelData";
import "./userPhotos.css";

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
    let promise_photos = fetchModel(
      `http://localhost:3000/photosOfUser/${props.match.params.userId}`
    );
    let promise_users = fetchModel(
      `http://localhost:3000/user/${props.match.params.userId}`
    );
    promise_photos.then((response) => {
      setPhotos(response.data);
    });
    promise_users.then((response) => {
      setUser(response.data);
      props.changeView(
        "Photos of ",
        `${response.data.first_name} ${response.data.last_name}`
      );
    });
  }, [props.match.params.userId]);

  return (
    <Grid container justify="space-evenly" alignItems="flex-start">
      <Grid item xs={12}>
        <Typography variant="h3">
          {user.first_name} {user.last_name}&apos;s Photos
        </Typography>
      </Grid>
      <div className="cs142-photo-buffer" />
      {photos.map((p) => (
        <Grid item xs={4} key={p._id}>
          <Card className="card">
            <CardHeader title={`${p.date_time}`} />
            <CardMedia
              component="img"
              height="300"
              width="300"
              image={`/images/${p.file_name}`}
              title={user.first_name}
            />
            <CardContent>
              {p.comments
                ? p.comments.map((c) => {
                    return (
                      <Grid container key={c._id}>
                        <Grid item xs={2}>
                          {c.date_time}
                        </Grid>
                        <Grid item xs={2}>
                          <Link to={`/users/${c.user._id}`}>
                            {`${c.user.first_name} ${c.user.last_name}`}
                          </Link>
                        </Grid>
                        <Grid item xs={8}>
                          {c.comment}
                        </Grid>
                      </Grid>
                    );
                  })
                : null}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default UserPhotos;
