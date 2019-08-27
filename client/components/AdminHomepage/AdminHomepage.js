import React from "react";
import { Page, Layout, Card, ResourceList, Icon, TextStyle } from "@shopify/polaris";

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

// App component imports
import AddEvent from "../AddEvent";

class AdminHomepage extends React.Component {
  state = {
    name: this.props.user.givenName,
    workdays: {}
  };

  componentDidMount() {
    this.getWorkdays();
  }

  getWorkdays = () => {
    fetch("/api/upcoming-workdays")
      .then(res => res.json())
      .then(workdays => {
        this.setState({ workdays });
      });
  };

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatDate(string) {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  }

  updateWorkdays = () => {
    setTimeout(
      function() {
        this.getWorkdays();
      }.bind(this),
      500
    );
  };

  render() {
    const { workdays } = this.state;
    return (
      <Page title={`Add Event`}>
        <Layout>
          <Layout.Section>
            <Card title="Select a location, start time, end time and date" sectioned>
              <AddEvent eventAdded={this.updateWorkdays} />
            </Card>
          </Layout.Section>
          <Layout.Section secondary>
            {workdays.length !== undefined ? (
              <Card title="Upcoming Events" sectioned>
                <ResourceList
                  resourceName={{ singular: "pop up", plural: "pop ups" }}
                  items={workdays}
                  renderItem={item => {
                    const { id, start, location_name } = item;
                    const media = <Icon source="calendar" />;

                    return (
                      <ResourceList.Item
                        id={id}
                        date={start}
                        media={media}
                        location_name={location_name}
                        accessibilityLabel={`View details for ${this.Capitalize(
                          location_name
                        )}`}
                      >
                        <h3>
                          <TextStyle variation="strong">
                            {this.Capitalize(location_name)}
                          </TextStyle>
                        </h3>
                        <div>{this.formatDate(start)}</div>
                      </ResourceList.Item>
                    );
                  }}
                />
              </Card>
            ) : (
              <Card title="Upcoming Events" sectioned />
            )}
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default AdminHomepage;
