import React from "react";
import { Page, Layout } from "@shopify/polaris";

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

// App compnent imports
import UserHomepage from "../UserHomepage";
import UpcomingWorkdays from "../UpcomingWorkdays";

class Homepage extends React.Component {
  state = {
    name: this.props.user.givenName
  };

  render() {
    const { name } = this.state;
    //console.log(this.props.user);
    return (
      <Page title={`Hello, ${name}!`}>
        <Layout>
          <UserHomepage user={this.props.user} />
          <Layout.Section secondary>
            <UpcomingWorkdays />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Homepage;
