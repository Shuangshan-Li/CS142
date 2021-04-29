import React from 'react';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    console.log('window.cs142models.statesModel()', window.cs142models.statesModel());
    this.state = {
      states: window.cs142models.statesModel(),
      substr: '',
      searchEntry: '',
    };
  }

  handleChange = (e) => {
    this.setState({ substr: e.target.value });
  }

  handleSubmit = (e) => {
    this.setState({ searchEntry: this.state.substr });
    e.preventDefault();
  }

  render() {
    let displayList = this.state.states.filter((d) => d.toLowerCase().includes(this.state.searchEntry.toLowerCase())).map((d) => <li key={d}>{d}</li>);



    return (
      <div className="states-container">
        <h1>Search all state names containing {`"${this.state.searchEntry}"`}</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.substr} onChange={this.handleChange} />
          <input type="submit" value="Submit" />
        </form>
        <p>Your search entry is: {`${this.state.searchEntry}`}</p>
        {(this.state.searchEntry && !displayList.length) ? <p id="not-found-warning">No Entry Found!</p> : <ul id="display-list">{displayList}</ul>}
      </div>
    );
  }
}

export default States;
