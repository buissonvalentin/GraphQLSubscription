import React from "react";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";

const editEvent = gql`
  mutation(
    $id: String
    $level: String
    $message: String
    $dataId: String
    $environnement: String
    $service: String
  ) {
    editEvent(
      id: $id
      level: $level
      message: $message
      dataId: $dataId
      environnement: $environnement
      service: $service
    ) {
      id
      message
      level
      data {
        id
        environnement
        service
      }
    }
  }
`;

class EditEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      level: "",
      message: "",
      dataId: "",
      environnement: "",
      service: ""
    };
  }

  render() {
    const { id, level, message, dataId, environnement, service } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        <h3>Edit Event</h3>
        <h4>Event</h4>
        <label>
          id:
          <input
            type="text"
            name="id"
            value={id}
            onChange={input => this.setState({ id: input.target.value })}
            placeholder="id"
            onClick={() => {
              navigator.clipboard
                .readText()
                .then(value => this.setState({ id: value }))
                .catch(err => {});
            }}
          />
        </label>
        <label>
          Message:
          <input
            type="text"
            name="message"
            value={message}
            onChange={input => this.setState({ message: input.target.value })}
            placeholder="Message"
          />
        </label>
        <label>
          Level:
          <input
            type="text"
            name="level"
            value={level}
            onChange={input => this.setState({ level: input.target.value })}
            placeholder="Level"
          />
        </label>
        <h4>Data</h4>
        <label>
          dataId:
          <input
            type="text"
            name="dataId"
            value={dataId}
            onChange={input => this.setState({ dataId: input.target.value })}
            placeholder="Id"
            onClick={() => {
              navigator.clipboard
                .readText()
                .then(value => this.setState({ dataId: value }))
                .catch(err => {});
            }}
          />
        </label>
        <label>
          Environnement:
          <input
            type="text"
            name="environnement"
            value={environnement}
            onChange={input =>
              this.setState({ environnement: input.target.value })
            }
            placeholder="Environnement"
          />
        </label>
        <label>
          Service:
          <input
            type="text"
            name="service"
            value={service}
            onChange={input => this.setState({ service: input.target.value })}
            placeholder="Service"
          />
        </label>

        <div>
          <Mutation
            mutation={editEvent}
            variables={{ id, message, level, dataId, environnement, service }}
          >
            {mutate => (
              <div>
                <button onClick={mutate}>Edit Event</button>
              </div>
            )}
          </Mutation>
        </div>
      </div>
    );
  }
}

export default EditEvent;
