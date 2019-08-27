import React from "react";
import {Page, Card, Layout, SkeletonBodyText, ResourceList, FilterType, TextStyle} from '@shopify/polaris';

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

class PreviousWorkdays extends React.Component {
  state = {
    sortedRows: null,
    workdays: {},
    // Filter box
    /* searchValue: "",
    appliedFilters: [
      {
        key: "locationFilter",
        value: []
      }
    ] */
  };

  // Filter box
  /* handleSearchChange = searchValue => {
    this.setState({ searchValue });
  };
  handleFiltersChange = appliedFilters => {
    this.setState({ appliedFilters });
  }; */

  componentDidMount() {
    this.getWorkdays();
  }

  getWorkdays = () => {
    fetch("/api/past-workdays")
      .then(res => res.json())
      .then(workdays => {
        console.log(workdays);
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

  handleSort = rows => (index, direction) => {
    this.setState({ sortedRows: this.sortCurrency(rows, index, direction) });
  };

  render() {
    const { workdays } = this.state;

    if (workdays.length !== undefined) {
      // Filter box
      /* const filters = [
        {
          key: "dateFilter",
          label: "Date",
          operatorText: "is greater than",
          type: FilterType.TextField
        },
        {
          key: "locationFilter",
          label: "Location",
          operatorText: "is",
          type: FilterType.Select,
          options: ["Galway", "Sligo"]
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
              <Card>
                <ResourceList
                  // Filter Box
                  //filterControl={filterControl}
                  resourceName={{ singular: "workday", plural: "workdays" }}
                  items={workdays}
                  renderItem={item => {
                    const { id, start, location_name } = item;
                    const url = "attendees?id=" + id;

                    return (
                      <ResourceList.Item
                        className={"item-background"}
                        style={{ color: "red" }}
                        id={id}
                        date={start}
                        url={url}
                        location_name={location_name}
                        accessibilityLabel={`View details for ${location_name}`}
                      >
                        <div className="item-background">
                          <h1>
                            <TextStyle variation="strong">
                              {this.Capitalize(location_name)}
                            </TextStyle>
                          </h1>
                          <div>{this.formatDate(start)}</div>
                        </div>
                      </ResourceList.Item>
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
              <Card sectioned>
                <SkeletonBodyText lines={5} />
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      );
    }
  }
}

export default PreviousWorkdays;
