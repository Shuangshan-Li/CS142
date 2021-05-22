import React, {useState} from "react";
import {
  Typography,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import {Link} from "react-router-dom";
import axios from "axios";

function PhotoCard(props) {
  const [comment, setComment] = useState("");
  const handleAddComment = (event, photo_id) => {
    event.preventDefault();
    axios
      .post(`/commentsOfPhoto/${photo_id}`, {comment: comment})
      .then(() => {
        setComment("");
        props.refreshCards();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleChangeInput = (event) => {
    setComment(event.target.value);
  };

  return (
    <Card className="card">
      <CardHeader title={`${props.photo.date_time}`} />
      <CardMedia
        component="img"
        height="300"
        width="300"
        image={`/images/${props.photo.file_name}`}
        title={props.creator.first_name}
      />
      <CardContent>
        <div>
          {props.photo.comments.map((comment) => {
            return (
              <Grid container key={comment._id}>
                <Grid item xs={2}>
                  <Typography>{comment.date_time.toString()}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Link to={`/users/${comment.user._id}`}>
                    {`${comment.user.first_name} ${comment.user.last_name}`}
                  </Link>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{comment.comment}</Typography>
                </Grid>
              </Grid>
            );
          })}

          <form
            className="add-comment"
            onSubmit={(event) => handleAddComment(event, props.photo._id)}
          >
            <label>
              Comment:{" "}
              <input type="text" value={comment} onChange={handleChangeInput} />
            </label>

            <input type="submit" value="Post" />
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

export default PhotoCard;
