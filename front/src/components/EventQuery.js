import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import EventTable from "./EventTable";

const getEvents = gql`
  query {
    getEvents {
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

export default props => {
  return (
    <Query query={getEvents}>
      {({ loading, data }) => {
        if (loading || !data) {
          return null;
        }

        return (
          <div>
            <EventTable events={data.getEvents} />
          </div>
        );
      }}
    </Query>
  );
};
