import React, { Component } from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  AppProvider,
  TopBar,
  Frame,
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonPage
} from "@shopify/polaris";

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

// App compnent imports
// import AdminHomepage from "../AdminHomepage";
import Nav from "../Nav";
// import HomePage from "../Homepage";
// import Attendees from "../Attendees";
// import EditLocation from "../EditLocation";
// import WorkdaysTabs from "../WorkdaysTabs";
// import Locations from "../Locations";
// import Users from "../Users";

import Footer from "../Footer";

class App extends Component {
  state = {
    user: {}
  };

  // componentDidMount() {
  //   this.getUser();
  // }

  // getUser = () => {
  //   fetch("/api/current-user")
  //     .then(res => res.json())
  //     .then(user => {
  //       this.setState({ user });
  //     });
  // };

  render() {
    // const { user } = this.state;
    // const name = user.givenName;
    // const avatar = `https://www.gravatar.com/avatar/${user.avatar}`;
    // const isAdmin = user.admin_level;
    const theme = {
      colors: {
        topBar: {
          background: "#230051"
        }
      },
      logo: {
        width: 400,
        topBarSource: "/assets/logo.jpg",
        url: "/",
        accessibilityLabel: "ZRT Dashboard"
      }
    };

    // if (name) {
    //   const userMenuMarkup = (
    //     <TopBar.UserMenu name={user.displayName} avatar={avatar} />
    //   );

    //   return (
    //     <AppProvider theme={theme}>
    //       <Router>
    //         <Frame
    //           topBar={
    //             <TopBar
    //               showNavigationToggle={true}
    //               userMenu={userMenuMarkup}
    //               onNavigationToggle={() => {
    //                 console.log("toggle navigation visibility");
    //               }}
    //             />
    //           }
    //           navigation={<Nav admin={isAdmin} />}
    //         >
    //           {isAdmin ? (
    //             <Switch>
    //               <Route
    //                 path="/"
    //                 exact
    //                 render={props => <HomePage user={user} />}
    //               />
    //               <Route
    //                 path="/event"
    //                 exact
    //                 render={props => <AdminHomepage user={user} />}
    //               />
    //               <Route
    //                 path="/locations"
    //                 exact
    //                 render={props => <Locations />}
    //               />
    //               <Route
    //                 path="/popups"
    //                 exact
    //                 render={props => <WorkdaysTabs />}
    //               />
    //               <Route path="/attendees" render={props => <Attendees />} />
    //               <Route path="/location" render={props => <EditLocation />} />
    //               <Route path="/users" render={props => <Users />} />
    //             </Switch>
    //           ) : (
    //             <Switch>
    //               <Route
    //                 path="/"
    //                 exact
    //                 render={props => <HomePage user={user} />}
    //               />
    //             </Switch>
    //           )}
    //           <FooterHelp>
    //             Have an issue or feature request? <a href="https://github.com/Shopify/attend-ease">Log it here</a>.
    //           </FooterHelp>
    //         </Frame>
    //       </Router>
    //     </AppProvider>
    //   );
    // } else {

    return (
      <AppProvider theme={theme}>
        <Frame
          topBar={<TopBar />}
          navigation={<Nav />}
          showMobileNavigation={false}
        >
          <SkeletonPage>
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <SkeletonBodyText lines={5} />
                </Card>
              </Layout.Section>
              <Layout.Section secondary>
                <Card title="Upcoming Events">
                  <Card.Section>
                    <SkeletonBodyText lines={2} />
                  </Card.Section>
                </Card>
              </Layout.Section>
            </Layout>
          </SkeletonPage>
          <Footer />
        </Frame>
      </AppProvider>
    );
    // }
  }
}

export default App;
