import React, {useState, useEffect} from "react";
import {
  Typography,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  IconButton,
  CardActions,
} from "@material-ui/core";
import {Link} from "react-router-dom";
import {MentionsInput, Mention} from "react-mentions";
import axios from "axios";
import {
  Send,
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbUpOutlined,
} from "@material-ui/icons";

function PhotoCard(props) {
  const [comment, setComment] = useState("");
  const [users, setUsers] = useState(undefined);
  const [mentionsToAdd, setMentionsToAdd] = useState([]);
  const [liked, setLiked] = useState(props.liked);

  useEffect(() => {
    // use a local variable to track whether the component is mounted or not.
    // change the value of local variable in the clean-up function of useEffect
    let isCancelled = false;
    axios
      .get("/user/mentionOptions")
      .then((response) => {
        if (!isCancelled) {
          setUsers(response.data);
        }
      })
      .catch((e) => {
        console.log(e.response ? e.response : e.request);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleAddComment = (event, photo_id) => {
    event.preventDefault();
    axios
      .post(`/commentsOfPhoto/${photo_id}`, {
        comment: comment,
        mentionsToAdd: mentionsToAdd,
      })
      .then(() => {
        setComment("");
        setMentionsToAdd([]);
        props.refreshCards();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleChangeInput = (event) => {
    setComment(event.target.value);
  };

  const handleLikedToggle = () => {
    axios
      .post(`/photoLikedToggle/${props.photo._id}`, {liked: !liked})
      .then(() => {
        setLiked(!liked);
        props.refreshCards();
      })
      .catch((err) => {
        console.log(err.response ? err.response : err.request);
      });
  };

  const handleFavorited = () => {
    axios
      .post("/addToFavorites", {photo_id: props.photo._id})
      .then(() => {
        props.refreshCards();
      })
      .catch((err) => {
        console.log(err.response);
      });
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
      <CardActions>
        <IconButton disabled={props.favorited} onClick={handleFavorited}>
          {props.favorited ? (
            <Favorite color="secondary" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
        <IconButton onClick={handleLikedToggle}>
          {liked ? <ThumbUp color="secondary" /> : <ThumbUpOutlined />}
        </IconButton>
        <Typography variant="h4" color="secondary">
          {props.photo.liked_by.length}
        </Typography>
      </CardActions>
      <CardContent>
        <div>
          {props.photo.comments.map((comment) => {
            return (
              <Grid container key={comment._id}>
                <Grid item xs={3}>
                  <Link to={`/users/${comment.user._id}`}>
                    {`${comment.user.first_name} ${comment.user.last_name}`}
                  </Link>
                </Grid>
                <Grid item xs={9}>
                  <Typography>
                    {comment.comment.replace(
                      /@\[(\S+ \S+)( )*\]\(\S+\)/g,
                      (match, p1) => {
                        return `@${p1}`;
                      }
                    )}
                  </Typography>
                  <Typography color="primary">
                    {comment.date_time.toString()}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}

          <form onSubmit={(event) => handleAddComment(event, props.photo._id)}>
            <label>
              <MentionsInput
                value={comment}
                onChange={handleChangeInput}
                allowSuggestionsAboveCursor
                singleLine
              >
                <Mention
                  trigger="@"
                  data={users}
                  displayTransform={(id, display) => `@${display}`}
                  onAdd={(id) => {
                    let mentions = mentionsToAdd;
                    mentions.push(id);
                    setMentionsToAdd(mentions);
                  }}
                />
              </MentionsInput>
            </label>

            <IconButton color="primary" type="submit">
              <Send />
            </IconButton>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

export default PhotoCard;
