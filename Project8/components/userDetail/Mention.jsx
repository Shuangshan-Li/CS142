import React from "react";
import {Card, CardMedia, CardContent} from "@material-ui/core";
import {Link} from "react-router-dom";
import "./Mention.css";
const axios = require("axios").default;

/**
 * Mention
 * props: photoId
 */
class Mention extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: undefined,
    };
    axios
      .get(`/photo/${this.props.photo_id}`)
      .then((response) => {
        this.setState({photo: response.data});
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  render() {
    return this.state.photo ? (
      <Card id="card">
        <CardContent>
          <Link to={`/users/${this.state.photo.photo_owner_id}`}>
            {`${this.state.photo.photo_owner_first_name} ${this.state.photo.photo_owner_last_name}`}
          </Link>
          &apos;s photo
        </CardContent>
        <Link to={`/photos/${this.state.photo.photo_owner_id}`}>
          <CardMedia
            id="photo"
            component="img"
            width="18"
            image={`/images/${this.state.photo.file_name}`}
          />
        </Link>
      </Card>
    ) : (
      <div />
    );
  }
}
export default Mention;
