import React, { Component } from "react";
import { Tabs, Card, Page, Layout, ResourceList, TextStyle, Icon } from "@shopify/polaris";

// App compnent imports
import UpcomingWorkdays from "../UpcomingWorkdays";

//import 2 tabs
import UsersAdmins from "../UsersAdmins";
import UsersGeneral from "../UsersGeneral";

class Users extends React.Component {
  state = {
    selectedTab: 0
  };

  handleTabChange = selectedTabIndex => {
    this.setState({ selectedTab: selectedTabIndex });
    //console.log(this.state.selectedTab);
  };

  tabs = [
    {
      id: 0,
      content: "Admins",
      accessibilityLabel: "Admins",
      panelID: "admins-content"
    },
    {
      id: 1,
      content: "General Users",
      accessibilityLabel: "General Users",
      panelID: "general-users-content"
    }
  ];

  renderCardContents = tabId => {
    //console.log(tabId.id);
    //console.log(tabId.id == 0);
    //console.log(tabId.id == 1);
    if (tabId.id == 0) {
      return <UsersAdmins />;
    } else if (tabId.id == 1) {
      return <UsersGeneral />;
    }
  };

  render() {
    //Every time the state changes, the render method will run again and display the correct state in the browser
    const { selectedTab } = this.state;

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
            <UpcomingWorkdays />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Users;
