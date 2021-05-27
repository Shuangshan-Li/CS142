import React from "react";
import {
  Button,
  Card,
  CardMedia,
  CardHeader,
  IconButton,
  Typography,
} from "@material-ui/core";
import {Clear} from "@material-ui/icons";
import Modal from "react-modal";

const axios = require("axios").default;

class FavoriteCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEnabled: false,
    };
  }

  handleDeleteFavorite = (event) => {
    event.preventDefault();
    axios
      .get(`/deleteFavorite/${this.props.photo._id}`)
      .then(() => {
        this.props.refreshCards();
      })
      .catch((err) => {
        console.log(err.response ? err.response : err.request);
      });
  };

  handleClose = () => {
    this.setState({modalEnabled: false});
  };

  handleOpen = () => {
    this.setState({modalEnabled: true});
  };

  render() {
    return (
      <div>
        <Card>
          <CardHeader
            action={
              <IconButton onClick={(event) => this.handleDeleteFavorite(event)}>
                <Clear />
              </IconButton>
            }
          />
          <CardMedia
            component="img"
            image={`/images/${this.props.photo.file_name}`}
            onClick={this.handleOpen}
          />
        </Card>

        <Modal
          isOpen={this.state.modalEnabled}
          onRequestClose={this.handleClose}
          ontentLabel={this.props.photo.date_time}
        >
          <Typography variant="h4" color="primary">
            {this.props.photo.date_time}
          </Typography>
          <Button
            onClick={this.handleClose}
            variant="contained"
            color="primary"
          >
            close
          </Button>
          <CardMedia
            component="img"
            image={`/images/${this.props.photo.file_name}`}
          />
        </Modal>
      </div>
    );
  }
}

export default FavoriteCard;
