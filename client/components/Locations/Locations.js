import React from "react";
import { Toast, Page, Layout, Card, ResourceList, Avatar, TextStyle, SkeletonPage, SkeletonBodyText} from '@shopify/polaris';
import AddLocation from "./AddLocation";

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

// Import custom CSS
import "./locations.css";

// App component imports
import UpcomingWorkdays from "../UpcomingWorkdays";

class Locations extends React.Component {
  state = {
    selectedLocation: "galway",
    month: 3,
    year: 2019,
    selectedDate: new Date(""),
    showToast: false,
    locations: [],
    result: {}
  };

  componentDidMount() {
    this.getLocations();
  }

  getLocations = () => {
    fetch("/api/locations")
      .then(res => res.json())
      .then(result => {
        this.setState({ result });
        //console.log(result);
        var locationsList = [];
        result.map(location => {
          locationsList.push({
            label: location.name,
            value: location.name,
            key: location.id
          });
        });
        //console.log(locationsList);
        this.setState({
          locations: locationsList
        });
      });
  };

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  handleDateChange = dateValue => {
    this.setState({ selectedDate: dateValue });
  };

  handleLocationChange = locationValue => {
    this.setState({ selectedLocation: locationValue });
  };

  locationRefresh = () => {
    setTimeout(
      function() {
        this.getLocations();
        //console.log(this.state.locations);
        //console.log(this.state.result);
      }.bind(this),
      500
    );
  };

  render() {
    const { showToast, result } = this.state;
    //console.log(result);

    const toastMarkup = showToast ? (
      <Toast content="Date Added!" onDismiss={this.toggleToast} />
    ) : null;

    if (result.length !== undefined) {
      return (
        <Page title={`Locations`}>
          <Layout>
            <Layout.Section>
              <Card title="Add and view locations">
                <Card.Section>
                  <AddLocation updateLocations={this.locationRefresh} />
                </Card.Section>
                <Card.Section>
                  <p>Click on a location to get more information on it.</p>
                  <div className="locations">
                    <Page>
                      <Layout>
                        <Layout.Section>
                          <Card>
                            <ResourceList
                              resourceName={{
                                singular: "workday",
                                plural: "workdays"
                              }}
                              items={result}
                              renderItem={item => {
                                const { id, name } = item;
                                const url = "location?id=" + id;
                                const media = (
                                  <Avatar customer size="small" name={name} />
                                );

                                return (
                                  <ResourceList.Item
                                    className={"item-background"}
                                    style={{ color: "red" }}
                                    id={id}
                                    url={url}
                                    //media={media}
                                    name={name}
                                    accessibilityLabel={`View details for ${name}`}
                                  >
                                    <div className="item-background">
                                      <h1>
                                        <TextStyle variation="strong">
                                          {this.Capitalize(name)}
                                        </TextStyle>
                                      </h1>
                                    </div>
                                  </ResourceList.Item>
                                );
                              }}
                            />
                          </Card>
                        </Layout.Section>
                      </Layout>
                    </Page>
                  </div>
                </Card.Section>
              </Card>
            </Layout.Section>
            <Layout.Section secondary>
              <UpcomingWorkdays />
            </Layout.Section>
          </Layout>
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
              <Card title="Upcoming Events" sectioned />
            </Layout.Section>
          </Layout>
        </SkeletonPage>
      );
    }
  }

  toggleToast = () => {
    this.setState(({ showToast }) => ({ showToast: !showToast }));
  };
}

export default Locations;
