import React from "react";
import { FooterHelp, TextStyle, Link } from "@shopify/polaris";
// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

const Footer = () => {
  let rightNow = new Date();
  // get current hour
  let currHour = rightNow.getHours();
  // get current minute
  let currMinute = rightNow.getMinutes();

  return (
    <FooterHelp>
      test For more information contact{" "}
      <TextStyle variation="strong">@adrian</TextStyle> on Slack. Feel free to{" "}
      <Link url="https://github.com/Shopify/ProjectZRT/issues/new">
        log any issues
      </Link>{" "}
      here.{" "}
      <TextStyle variation="subdued">
        The server time is{" "}
        {`${currHour}:${currMinute < 10 ? "0" : ""}${currMinute}`}
      </TextStyle>
    </FooterHelp>
  );
};

export default Footer;
