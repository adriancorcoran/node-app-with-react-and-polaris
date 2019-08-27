import React from "react";
import { Card, Tabs, Layout, Page, ResourceList, Icon, TextStyle } from "@shopify/polaris";

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

// App compnent imports
import PreviousWorkdays from "../PreviousWorkdays";
import FutureWorkdays from "../FutureWorkdays";
import UpcomingWorkdays from "../UpcomingWorkdays";

class WorkdaysTabs extends React.Component {
  state = {
    selectedTab: 0,
    workdays: {},
  };

  handleTabChange = selectedTabIndex => {
    this.setState({ selectedTab: selectedTabIndex });
    //console.log(this.state.selectedTab);
  };

  componentDidMount() {
    this.getWorkdays();
  }

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatDate(string) {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  }

  getWorkdays = () => {
    fetch("/api/upcoming-workdays")
      .then(res => res.json())
      .then(workdays => {
        this.setState({ workdays });
      });
  };

  locationRefresh = () => {
    setTimeout(
      function() {
        this.getWorkdays();
      }.bind(this),
      500
    );
  };

  tabs = [
    {
      id: 0,
      content: "Future Dates",
      accessibilityLabel: "Uncoming Workdays",
      panelID: "upcoming-workdays-content"
    },
    {
      id: 1,
      content: "Past Dates",
      accessibilityLabel: "Previous Workdays",
      panelID: "previous-workdays-content"
    }
  ];

  renderCardContents = tabId => {
    //console.log(tabId.id);
    //console.log(tabId.id == 0);
    //console.log(tabId.id == 1);
    if (tabId.id == 0) {
      return <FutureWorkdays locationRefresh={this.locationRefresh} />;
    } else if (tabId.id == 1) {
      return <PreviousWorkdays />;
    }
  };

  render() {
    //Every time the state changes, the render method will run again and display the correct state in the browser
    const { selectedTab, workdays } = this.state;
    //console.log(workdays);
    return (
      <Page title={`Pop Ups`}>
        <Layout>
          <Layout.Section>
            <Card>
              <Tabs
                tabs={this.tabs}
                selected={selectedTab}
                onSelect={this.handleTabChange}
                fitted
              />
              {this.renderCardContents(this.tabs[selectedTab])}
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

export default WorkdaysTabs;
