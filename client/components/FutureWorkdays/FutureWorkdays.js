import React from "react";
import { Page, Card, Layout, SkeletonBodyText, ResourceList, TextStyle, Modal, Toast, TextContainer } from '@shopify/polaris';

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

class FutureWorkdays extends React.Component {
  state = {
    sortedRows: null,
    workdays: {},
    selectedItems: [],
    active: false,
    showToast: false,
  };

  componentDidMount() {
    this.getWorkdays();
  }

  getWorkdays = () => {
    fetch("/api/future-workdays")
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

  handleSort = rows => (index, direction) => {
    this.setState({ sortedRows: this.sortCurrency(rows, index, direction) });
  };

  // For the bulk actions
  handleSelectionChange = selectedItems => {
    this.setState({ selectedItems });
  };

  locationRefresh = () => {
    setTimeout(
      function() {
        this.getWorkdays();
        //console.log(this.state.locations);
        //console.log(this.state.result);
      }.bind(this),
      500
    );
  };

  render() {
    const { active, sortedRows, workdays, selectedItems, showToast } = this.state;

    const toastMarkup = showToast ? (
      <Toast content="Pop Ups deleted!" onDismiss={this.toggleToast} />
    ) : null;

    //console.log(workdays);

    if (workdays.length !== undefined) {
      // For the bulk actions
      const bulkActions = [
        {
          content: "Delete dates",
          onAction: this.handleChange
        }
      ];

      return (
        <Page>
          <Layout>
            <Layout.Section>
              <Card>
                <ResourceList
                  resourceName={{ singular: "workday", plural: "workdays" }}
                  items={workdays}
                  // For the bulk actions
                  selectedItems={this.state.selectedItems}
                  onSelectionChange={this.handleSelectionChange}
                  bulkActions={bulkActions}
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
                <Modal
                  open={active}
                  onClose={this.handleChange}
                  title="Delete Pop Ups"
                  primaryAction={{
                    content: 'Delete',
                    onAction: this.handleBulkDelete,
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
            </Layout.Section>
          </Layout>
          {toastMarkup}
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

  handleChange = () => {
    this.setState(({active}) => ({active: !active}));
  };

  toggleToast = () => {
    this.setState(({ showToast }) => ({ showToast: !showToast }));
  };

  // Delete Pop Ups
  handleBulkDelete = () => {
    const { selectedItems } = this.state;
    //console.log(selectedItems);

    var encodedArray = encodeURIComponent(JSON.stringify(selectedItems));
    //console.log(encodedArray);

    var data = `workdays=${encodedArray}`;
    //console.log(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("DELETE", "/api/delete-workdays");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);

    this.setState(({active}) => ({active: !active}));
    this.setState(({ showToast }) => ({ showToast: !showToast }));
    this.locationRefresh();
    this.props.locationRefresh();
  };
}

export default FutureWorkdays;
