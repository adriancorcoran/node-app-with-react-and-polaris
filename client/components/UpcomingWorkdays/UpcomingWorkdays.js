import React, { Component } from "react";
import { Card, ResourceList, TextStyle, Icon} from '@shopify/polaris';

// Import custom CSS
import "./upcomingWorkdays.css";

class UpcomingWorkdays extends Component {
  state = {
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

  render() {
    const { workdays } = this.state;

    if (workdays.length !== undefined) {
      return (
        <Card title="Upcoming Events" sectioned>
          <ResourceList
            resourceName={{ singular: "workday", plural: "workdays" }}
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
      );
    } else {
      return <Card title="Upcoming Events" sectioned />;
    }
  }
}

export default UpcomingWorkdays;
