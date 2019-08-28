import React from "react";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";

const sendEvent = gql`
  mutation($level: String, $message: String) {
    sendEvent(level: $level, message: $message) {
      message
      level
    }
  }
`;

class SendEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: "",
      message: ""
    };
  }

  render() {
    const { level, message } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        <h3>Send Event</h3>
        <label>
          Message:
          <input
            type="text"
            name="message"
            value={message}
            onChange={input => this.setState({ message: input.target.value })}
            placeholder="SMS sent successfuly"
          />
        </label>
        <label>
          Level:
          <input
            type="text"
            name="level"
            value={level}
            onChange={input => this.setState({ level: input.target.value })}
            placeholder="Error"
          />
        </label>
        <div>
          <Mutation mutation={sendEvent} variables={{ message, level }}>
            {mutate => (
              <div>
                <button onClick={mutate}>Send Event</button>
              </div>
            )}
          </Mutation>
        </div>
      </div>
    );
  }
}

export default SendEvent;
