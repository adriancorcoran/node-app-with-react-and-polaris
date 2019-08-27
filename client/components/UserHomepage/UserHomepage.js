import React, { Component } from "react";
import { ChoiceList, Card, Layout, Form, FormLayout, Button, SkeletonBodyText, TextField, Toast, TextContainer } from '@shopify/polaris';

// Import custom CSS
import "./userHomepage.css";

class UserHomepage extends Component {
  state = {
    selected: [],
    user: {},
    locationNames: [],
    dietaryRequirements: "",
    showToast: false
  };

  componentDidMount() {
    this.getUser();
    this.getLocations();
  }

  getUser = () => {
    fetch("/api/current-user")
      .then(res => res.json())
      .then(user => {
        let selectedLocations = user.locations;

        if (user.locations != null) {
          // Check to make sure locations are added before changing state
          selectedLocations = selectedLocations.slice(1, -1); // Remove square brackets

          let array = selectedLocations.split(","); // Turn string into array

          let selected = array.map(function(element) {
            return element.slice(1, -1); // Remove additional quotes
          });
          this.setState({ selected });
        }

        let dietaryRequirements = user.dietary_requirements;
        this.setState({ dietaryRequirements });

        this.setState({ user });
      });
  };

  getLocations = () => {
    fetch("/api/locations")
      .then(res => res.json())
      .then(locations => {
        let locationNames = locations.map(({ name }) => name); // Get an array of the location names
        this.setState({ locationNames });
      });
  };

  render() {
    const { selected, locationNames, dietaryRequirements, showToast, user } = this.state;

    const toastMarkup = showToast ? (
      <Toast content="Preferences updated!" onDismiss={this.toggleToast} />
    ) : null;

    if (user.displayName) {
      const choices = [];
      for (let i = 0; i < locationNames.length; i++) {
        choices.push({
          key: i,
          label: locationNames[i],
          value: locationNames[i]
        }); // Arry of objects with the location name and value
      }

      return (
        <Layout.Section>
          <div className="user-homepage">
            <Card title="Preferences">
              <Card.Section>
                <TextContainer>
                  Choose from the options below to subscribe to those locations.
                  You will then receive a Slack ping whenever a Pop Up from one
                  of your subscribed locations is coming up.
                </TextContainer>
              </Card.Section>
              <Card.Section>
                <ChoiceList
                  allowMultiple
                  title={"Select your preferred location(s)"}
                  choices={choices}
                  selected={selected}
                  onChange={this.handleChange}
                />
              </Card.Section>

              <Card.Section>
                <Form onSubmit={this.handleSubmit}>
                  <FormLayout>
                    <TextField
                      value={dietaryRequirements}
                      onChange={this.handleDietChange("dietaryRequirements")}
                      label="Dietary requirements"
                      type="text"
                      value={dietaryRequirements}
                      helpText={
                        <span>
                          We'll use this to make sure there are plenty of tasty
                          treats for everyone!
                        </span>
                      }
                    />
                    <Button onClick={this.toggleToast} submit>
                      Submit
                    </Button>
                  </FormLayout>
                </Form>
              </Card.Section>
            </Card>
            {toastMarkup}
          </div>
        </Layout.Section>
      );
    } else {
      return (
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText lines={5} />
          </Card>
        </Layout.Section>
      );
    }
  }

  handleSubmit = event => {
    const { user, dietaryRequirements } = this.state;
    var encodedArray = encodeURIComponent(JSON.stringify(this.state.selected));
    var data = `googleID=${
      user.googleID
    }%0A&locations=${encodedArray}&dietary_requirements=${dietaryRequirements}`;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", "/api/add-locations");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(data);
  };

  handleChange = value => {
    this.setState({ selected: value });
  };

  handleDietChange = field => {
    return value => this.setState({ [field]: value });
  };

  toggleToast = () => {
    this.setState(({ showToast }) => ({ showToast: !showToast }));
  };
}

export default UserHomepage;
