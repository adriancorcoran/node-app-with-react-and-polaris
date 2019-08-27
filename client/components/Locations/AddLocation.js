import React, { Fragment } from "react";
import { Button, Form, FormLayout, Toast, Collapsible, TextField } from "@shopify/polaris";

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

// Import custom CSS
import "./locations.css";

class AddLocation extends React.Component {
  state = {
    location_name: "",
    open: false,
    height: "40px",
    address1: "",
    address2: "",
    post_code: "",
    region: "",
    country: "",
    location_name: "",
    showToast: false
  };

  render() {
    const { open, showToast, location_name, address1, address2, post_code, region, country } = this.state;

    const toastMarkup = showToast ? (
      <Toast content="Location added!" onDismiss={this.toggleToast} />
    ) : null;
    return (
      <div className={"rup"}>
        <Button onClick={this.handleToggleClick} ariaExpanded={open}>
          Add A Location
        </Button>
        <Collapsible open={open} id="basic-collapsible">
          <Form onSubmit={this.handleSubmit}>
            <FormLayout>
              <TextField
                label="Location Name"
                value={location_name}
                onChange={this.handleNameChange}
              />
              <TextField
                label="Address 1"
                value={address1}
                onChange={this.handleAddress1change}
              />
              <TextField
                label="Address 2"
                value={address2}
                onChange={this.handleAddress2change}
              />
              <TextField
                label="Postcode / Zip"
                value={post_code}
                onChange={this.handlePost_codeChange}
              />
              <TextField
                label="State/Region/Province"
                value={region}
                onChange={this.handleRegionChange}
              />
              <TextField
                label="Country"
                value={country}
                onChange={this.handleCountryChange}
              />
              <Button onClick={this.handleButtonClick} submit>
                Submit
              </Button>
            </FormLayout>
          </Form>
        </Collapsible>
        {toastMarkup}
      </div>
    );
  }
  handleToggleClick = () => {
    this.setState(state => {
      const open = !state.open;
      var height = "";
      if (!state.open == false) {
        height = "40px";
      } else {
        height = "540px";
      }
      return {
        open,
        height
      };
    });
  };
  handleNameChange = evt => {
    this.setState({ location_name: evt });
  };
  handleAddress1change = evt => {
    this.setState({ address1: evt });
  };
  handleAddress2change = evt => {
    this.setState({ address2: evt });
  };
  handlePost_codeChange = evt => {
    this.setState({ post_code: evt });
  };
  handleRegionChange = evt => {
    this.setState({ region: evt });
  };
  handleCountryChange = evt => {
    this.setState({ country: evt });
  };

  handleButtonClick = () => {
    this.setState(({ showToast }) => ({ showToast: !showToast }));
    this.props.updateLocations();
  };

  toggleToast = () => {
    this.setState(({ showToast }) => ({ showToast: !showToast }));
  };

  handleSubmit = event => {
    const { location_name, address1, address2, post_code, region, country } = this.state;
    var data = JSON.stringify({
      name: location_name,
      address: ` ${address1}
                    ${address2}
                    ${post_code}
                    ${region}
                    ${country}
      `
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", "/api/add-location");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(data);
  };
}

export default AddLocation;
