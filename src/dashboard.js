import React, { Component } from "react";
import client from "./feathers";
import { Button, TextField } from "@material-ui/core";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    document.title = "AngelThump - Dashboard";
    this.fetchApi();
    this.intervalID = setInterval(this.fetchApi, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  fetchApi = () => {
    fetch(`https://api.angelthump.com/v2/streams/${this.props.user.username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error || data.code > 400 || data.status > 400) {
          return console.error(data.errorMsg);
        }
        this.setState({ live: data.type === "live", stream: data });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  handleTitleInput = (evt) => {
    this.setState({ title: evt.target.value, savedTitle: false });
  };

  saveTitle = async (evt) => {
    if (evt) {
      evt.preventDefault();
    }

    const { accessToken } = await client.get("authentication");

    await fetch("https://api.angelthump.com/v2/user/title", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: this.state.title,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error || data.code > 400) {
          return console.error(data);
        }
        this.setState({ savedTitle: true });
        setTimeout(() => {
          this.setState({ savedTitle: false });
        }, 1000);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  render() {
    if (!this.props.user === undefined) return null;
    if (!this.props.user) return null;

    return (
      <div style={{ maxWidth: "30rem", padding: "3rem" }}>
        <TextField
          onChange={this.handleTitleInput}
          inputProps={{
            style: {
              backgroundColor: "hsla(0,0%,100%,.15)",
              color: "#efeff1",
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
            },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
          variant="outlined"
          margin="none"
          fullWidth
          maxLength="140"
          label="Change your Title"
          rows="3"
          defaultValue={this.props.user.title}
        ></TextField>
        <Button
          onClick={this.saveTitle}
          variant="contained"
          color="primary"
          disabled={this.state.savedTitle}
          style={{
            marginTop: "1rem",
            textTransform: "none",
            backgroundColor: this.state.savedTitle ? "green" : "#3f51b5",
            color: "#fff",
          }}
        >
          {this.state.savedTitle ? "Updated" : "Update"}
        </Button>
      </div>
    );
  }
}

export default Dashboard;
