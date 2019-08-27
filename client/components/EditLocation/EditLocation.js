import React from "react";
import { withRouter } from "react-router";
import { Page, Layout, Card, Button, SkeletonPage, SkeletonBodyText, Form, FormLayout, TextField, Toast, Modal, TextContainer } from "@shopify/polaris";

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

// Import custom CSS
import "./editLocation.css";

// App compnent imports
import UpcomingWorkdays from "../UpcomingWorkdays";

class EditLocation extends React.Component {
  state = {
    location: {},
    address1: "",
    address2: "",
    post_code: "",
    region: "",
    country: "",
    location_name: "",
    showToast: false,
    active: false,
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("id");
    //console.log(myParam);
    this.getLocation(myParam)
      .then(res => res)
      .then(location => {
        //console.log(location);
        if (location !== null) {
          const address1 = location.address.split(`\n`);
          //console.log(address1);

          this.setState({ location });
          this.setState({ location_name: location.name });
          this.setState({ address1: address1[0].trim() });
          this.setState({ address2: address1[1].trim() });
          this.setState({ post_code: address1[2].trim() });
          this.setState({ region: address1[3].trim() });
          this.setState({ country: address1[4].trim() });
        }
        this.setState({ location });
      });
  }

  render() {
    const { active, location, showToast } = this.state;
    //console.log(this.state);

    const toastMarkup = showToast ? (
      <Toast content="Changes Saved!" onDismiss={this.toggleToast} />
    ) : null;

    if (location !== null) {
      if (location.id) {
        const name = location.name;

        return (
          <Page 
          breadcrumbs={[{content: 'Back', url: '/locations'}]}
          title={name}
          >
            <Layout>
              <Layout.Section>
                <div className={"EditLocation-card"}>
                  <Card title="Edit or delete location" sectioned>
                    <Form onSubmit={this.handleEditSubmit}>
                      <FormLayout>
                        <TextField
                          label="Location Name"
                          value={this.state.location_name}
                          onChange={this.handleNameChange}
                        />
                        <TextField
                          label="Address 1"
                          value={this.state.address1}
                          onChange={this.handleAddress1change}
                        />
                        <TextField
                          label="Address 2"
                          value={this.state.address2}
                          onChange={this.handleAddress2change}
                        />
                        <TextField
                          label="Postcode / Zip"
                          value={this.state.post_code}
                          onChange={this.handlePost_codeChange}
                        />
                        <TextField
                          label="State/Region/Province"
                          value={this.state.region}
                          onChange={this.handleRegionChange}
                        />
                        <TextField
                          label="Country"
                          value={this.state.country}
                          onChange={this.handleCountryChange}
                        />
                        <Button onClick={this.toggleToast} submit>
                          Update
                        </Button>
                      </FormLayout>
                    </Form>
                    <Form onSubmit={this.handleChange}>
                      <FormLayout>
                        <div className={"EditLocation-delete-button"}>
                          <Button destructive submit>Delete</Button>
                        </div>
                      </FormLayout>
                    </Form>
                    <Modal
                      open={active}
                      onClose={this.handleChange}
                      title="Delete Location"
                      primaryAction={{
                        content: 'Delete',
                        onAction: this.handleDeleteSubmit,
                        destructive: true
                      }}
                      secondaryActions={[
                        {
                          content: 'Cancel',
                          onAction: this.handleChange,
                        },
                      ]}
                    >
                      <Modal.Section>
                        <TextContainer>
                          <p>
                            Are you sure you want to delete?
                          </p>
                        </TextContainer>
                      </Modal.Section>
                    </Modal>
                  </Card>
                </div>
              </Layout.Section>
              <Layout.Section secondary>
                <UpcomingWorkdays />
              </Layout.Section>
            </Layout>
            {toastMarkup}
          </Page>
        );
      } else {
        return (
          <SkeletonPage>
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <SkeletonBodyText lines={5} />
                </Card>
              </Layout.Section>
              <Layout.Section secondary>
                <SkeletonBodyText lines={5} />
              </Layout.Section>
            </Layout>
          </SkeletonPage>
        );
      }
    } else {
      return (
        <Page title="Location Missing">
          <Layout>
            <Layout.Section>
              <Card title="Please try another location" sectioned />
            </Layout.Section>
            <Layout.Section secondary>
              <UpcomingWorkdays />
            </Layout.Section>
          </Layout>
        </Page>
      );
    }
  }

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

  handleChange = () => {
    console.log('clicked');
    this.setState(({active}) => ({active: !active}));
  };

  handleEditSubmit = event => {
    const { location_name, address1, address2, post_code, region, country, active } = this.state;

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("id");
    var data = JSON.stringify({
      id: myParam,
      name: location_name,
      address: `${address1}\n${address2}\n${
        post_code
      }\n${region}\n${country}`
    });

    console.log(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("PUT", "/api/update-location");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  };

  handleDeleteSubmit = event => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("id");
    //console.log(this.state);

    var data = `locations=%5B${myParam}%5D`;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("DELETE", "/api/delete-locations");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
    this.props.history.push("/locations");
  };

  toggleToast = () => {
    this.setState(({ showToast }) => ({ showToast: !showToast }));
  };

  deleteRedirect = () => {
    this.props.history.push("/locations");
  };

  getLocation(id) {
    var data = `location_id=${id}`;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
          console.log(this.responseText);
          resolve(JSON.parse(xhr.responseText));
        }
      });

      xhr.open("GET", `/api/location-info?location_id=${id}`);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    });
  }
}

export default withRouter(EditLocation);
