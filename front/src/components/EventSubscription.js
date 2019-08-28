import React from "react";
import { Subscription } from "react-apollo";
import { gql } from "apollo-boost";
import EventTable from "./EventTable";

const editedEvent = gql`
  subscription($eventId: String) {
    editedEvent(eventId: $eventId) {
      id
      level
      message
      data {
        id
        environnement
        service
      }
    }
  }
`;

class SubscriptionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { eventId: "", subscribed: false };
  }

  render() {
    const { eventId, subscribed } = this.state;
    return (
      <div>
        {subscribed ? (
          <Subscription subscription={editedEvent} variables={{ eventId }}>
            {({ data }) => {
              return (
                <h3>
                  {data ? <EventTable events={[data.editedEvent]} /> : null}
                </h3>
              );
            }}
          </Subscription>
        ) : (
          <div style={{ width: "500px", height: "100px" }}>
            <label>
              Event Id:
              <input
                type="text"
                name="eventId"
                value={eventId}
                onChange={input =>
                  this.setState({ eventId: input.target.value })
                }
                placeholder="Event id"
                onClick={() => {
                  navigator.clipboard
                    .readText()
                    .then(value => this.setState({ eventId: value }))
                    .catch(err => {});
                }}
              />
            </label>
            <button onClick={() => this.setState({ subscribed: true })}>
              Subscribe
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default SubscriptionComponent;
