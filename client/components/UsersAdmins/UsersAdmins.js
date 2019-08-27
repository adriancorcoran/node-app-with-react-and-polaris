import React, { Component } from "react";
import { Card, Page, Layout, ResourceList, TextStyle, Icon, FilterType} from "@shopify/polaris";

// App compnent imports

class UsersAdmins extends Component {
  state = {
    users: {},
    // bulk actions
    workdays: {},
    selectedItems: [],
    // Filter search Box
    //searchValue: "",
  };

  componentDidMount() {
    this.getUsers();
  } 

  getUsers = () => {
    fetch("/api/users")
      .then(res => res.json())
      .then(users => {
        this.setState({ users });
      });
  };

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatDate(string) {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  }

  // Bulk actions 
  handleSelectionChange = selectedItems => {
    this.setState({ selectedItems });
  };

  // Filter search Box
  /* handleSearchChange = searchValue => {
    this.setState({ searchValue });
  };
  handleFiltersChange = appliedFilters => {
    this.setState({ appliedFilters });
  }; */

  removeAdmin = () => {
    const { selectedItems } = this.state;
    var data = JSON.stringify({
      "id": selectedItems,
      "admin_level": 0
    });
    
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    
    xhr.open("PUT", "/api/update-user");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
    
    setTimeout(
      function() {
        this.getUsers();
      }.bind(this),
      500
    );
  }

  render() {
    const { users } = this.state;
    console.log(users);

    if (typeof users !== "undefined") {
      // For the bulk actions
      const bulkActions = [
        {
          content: "Remove Admin Status",
          onAction: this.removeAdmin
        }
      ];
      // Filter search Box
      /* const filters = [
        {
          key: "nameFilter",
          label: "Name",
          operatorText: "contains: ",
          type: FilterType.TextField
        }
      ];

      const filterControl = (
        <ResourceList.FilterControl
          filters={filters}
          appliedFilters={this.state.appliedFilters}
          onFiltersChange={this.handleFiltersChange}
          searchValue={this.state.searchValue}
          onSearchChange={this.handleSearchChange}
          additionalAction={{
            content: "Save",
            onAction: () => console.log("New filter saved")
          }}
        />
      ); */

      return (
        <Page>
          <Layout>
            <Layout.Section>
              <Card title="Modify Admins">
                <ResourceList
                  resourceName={{ singular: "user", plural: "users" }}
                  items={users}
                  // For the bulk actions
                  selectedItems={this.state.selectedItems}
                  onSelectionChange={this.handleSelectionChange}
                  bulkActions={bulkActions}
                  // Filter Box
                  //filterControl={filterControl}

                  renderItem={user => {
                    const { id, displayName, admin_level } = user;
                    const media = <Icon source="profile" />;

                    return (
                      (admin_level  > 0 ) ? 
                        <ResourceList.Item
                          id={id}
                          displayName={displayName}
                          admin_level={admin_level}
                          media={media}
                          accessibilityLabel={`View details for ${this.Capitalize(
                            displayName
                          )}`}
                        >
                          <h3>
                            <TextStyle variation="strong">
                              {this.Capitalize(displayName)}
                            </TextStyle>
                          </h3>
                          <div>Admin: {(admin_level  > 0 ) ? "Yes" : "No"}</div>
                        </ResourceList.Item>
                      : null
                    );
                  }}
                />
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      );
    } else {
      return (
        <Page>
          <Layout>
            <Layout.Section>
              <Card title="Modify Admins" />
            </Layout.Section>
          </Layout>
        </Page>
      );
    }
  }
}

export default UsersAdmins;
