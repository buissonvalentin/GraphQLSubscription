import React from "react";
import EventQuery from "./EventQuery";
import EventSubscription from "./EventSubscription";

class SubscriptionComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3>Query</h3>
        <EventQuery />
        <h3>Subscription</h3>
        <EventSubscription />
      </div>
    );
  }
}

export default SubscriptionComponent;
