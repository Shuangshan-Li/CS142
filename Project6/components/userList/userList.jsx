import React from "react";
import {Link} from "react-router-dom";
import {Divider, List, ListItem, ListItemText} from "@material-ui/core";
import "./userList.css";
import axios from "axios";
/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
    let promise = axios.get(`http://localhost:3000/user/list`);
    promise
      .then((response) => {
        this.setState({users: response.data});
      })
      .catch((e) => console.log(e.response ? e.response : e.request));
  }

  render() {
    let displayList = this.state.users.map((u) => {
      return (
        <Link to={`/users/${u._id}`} key={u._id}>
          <ListItem>
            <ListItemText primary={`${u.first_name} ${u.last_name}`} />
          </ListItem>
          <Divider />
        </Link>
      );
    });
    return (
      <div>
        <List component="nav">{displayList}</List>
      </div>
    );
  }
}

export default UserList;
