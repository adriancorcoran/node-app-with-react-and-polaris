import React from "react";
import { Navigation } from "@shopify/polaris";
// import { LocationsMinor } from "@shopify/polaris-icons";
const Nav = props => {
  return (
    <Navigation location="https://zrt-dashboard.myshopify.io">
      {
        // props.admin > 0 ? (
        //   <Navigation.Section
        //     title="Attendease"
        //     items={[
        //       {
        //         url: "/",
        //         label: "Preferences",
        //         icon: "profile"
        //       },
        //       {
        //         label: "Add Event",
        //         url: "/event",
        //         icon: "circlePlus"
        //       },
        //       {
        //         label: "Locations",
        //         url: "/locations",
        //         icon: LocationsMinor
        //       },
        //       {
        //         label: "Pop Up Dates",
        //         url: "/popups",
        //         icon: "calendar"
        //       },
        //       {
        //         label: "Users",
        //         url: "/users",
        //         icon: "notes"
        //       }
        //     ]}
        //   />
        // ) : (
        <Navigation.Section
          title="ZRT Dashboard"
          items={[
            {
              url: "/",
              label: "Preferences",
              icon: "profile"
            }
          ]}
        />
        // )
      }
    </Navigation>
  );
};

export default Nav;
