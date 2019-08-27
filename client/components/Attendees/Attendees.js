import React from "react";
import {Page, Layout, Card, DataTable, SkeletonBodyText} from '@shopify/polaris';

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

// Import custom CSS
import "./attendees.css";

// App compnent imports
import UpcomingWorkdays from "../UpcomingWorkdays";

class Attendees extends React.Component {
  state = {
    attendees: {}
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("id");
    //console.log(myParam);
    this.getAttendees(myParam)
      .then(res => res)
      .then(attendees => {
        this.setState({ attendees });
      });
  }

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  render() {
    const { attendees } = this.state;

    if (attendees.length !== undefined) {
      var output = attendees.map(function(obj) {
        return Object.keys(obj)
          .sort()
          .map(function(key) {
            return obj[key];
          });
      });

      const rows = [];
      for (let i = 0; i < attendees.length; i++) {
        let checkedIn = output[i][0].toString();
        let checkedInCaps = this.Capitalize(checkedIn);
        let dietCaps = this.Capitalize(output[i][1]);
        rows.push([output[i][2], checkedInCaps, dietCaps]);
      }

      console.log(this.state.attendees);
      console.log(rows);

      const totalAttendees = `Total attendees for this event: ${attendees.length}`;

      return (
        <Page title={`Attendees`}>
          <Layout>
            <Layout.Section>
              <Card title={totalAttendees}>
                {attendees.length ? (
                  <DataTable
                    columnContentTypes={["text", "text", "text"]}
                    headings={[
                      "Name",
                      "Checked In",
                      "Dietary requirements"
                    ]}
                    rows={rows}
                  />
                ) : null}
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
        <Page title={`Attendees`}>
          <Layout>
            <Layout.Section>
              <Card sectioned>
                <SkeletonBodyText lines={5} />
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

  getAttendees(id) {
    var data = `workday_id=${id}`;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    return new Promise((resolve, reject) => {
      xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
          console.log(this.responseText);
          resolve(JSON.parse(xhr.responseText));
        }
      });

      xhr.open("POST", "/api/workday-attendees");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");

      xhr.send(data);
    });
  }
}

export default Attendees;
