import express from "express";
import { createServer } from "http";
import { PubSub } from "apollo-server";
import { ApolloServer, gql } from "apollo-server-express";
import { withFilter } from "graphql-subscriptions";
import cors from "cors";

var mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://root:root@denzelmovies-696nb.mongodb.net/test?retryWrites=true",
  { useNewUrlParser: true }
);

let Event;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  var schema = new mongoose.Schema({
    message: "string",
    level: "string",
    _id: "string",
    data: [{ id: "string", environnement: "string", service: "string" }]
  });
  Event = mongoose.model("Event", schema);
  setupServer();
});

const setupServer = () => {
  Event.watch().on("change", async change => {
    if (change.updateDescription && change.updateDescription.updatedFields) {
      var regex = RegExp("data.[0-9]+.service");
      for (const key of Object.keys(change.updateDescription.updatedFields)) {
        if (/data.[0-9]+.service/g.test(key)) {
          console.log("match");
          pubsub.publish(NEW_EVENT, {
            editedEvent: await Event.findOne({ _id: change.documentKey._id })
          });
        }
      }
    }
  });

  const pubsub = new PubSub();

  const NEW_EVENT = "NEW_EVENT";

  const typeDefs = gql`
    type Event {
      level: String
      message: String
      id: String
      data: [Data]
    }
    type Data {
      id: String
      environnement: String
      service: String
    }
    type Query {
      getEvents: [Event]
    }
    type Mutation {
      sendEvent(level: String, message: String): Event
      editEvent(
        id: String
        message: String
        level: String
        dataId: String
        environnement: String
        service: String
      ): Event
    }
    type Subscription {
      editedEvent(eventId: String): Event
    }
  `;

  const resolvers = {
    Query: {
      getEvents: async () => {
        const events = await Event.find();
        return events.map(evt => ({
          message: evt.message,
          level: evt.level,
          id: evt._id,
          data: evt.data
        }));
      }
    },
    Mutation: {
      sendEvent: async (_, { level, message }) => {
        const event = await Event.create({
          level,
          message,
          _id: randomToken(),
          data: [
            { id: randomToken(), environnement: "production", service: "back" }
          ]
        });
        return event;
      },
      editEvent: async (
        _,
        { id, level, message, dataId, environnement, service }
      ) => {
        const event = await Event.findOne({ _id: id });
        if (event) {
          if (level) {
            event.level = level;
          }
          if (message) {
            event.message = message;
          }
          if (dataId) {
            const data = event.data.find(data => data.id == dataId);
            if (service) {
              data.service = service;
            }
            if (environnement) {
              data.environnement = environnement;
            }
          } else {
            event.data.push({ id: randomToken(), environnement, service });
          }
          await event.save();

          return event;
        } else {
          console.log("event not found");
        }
      }
    },
    Subscription: {
      editedEvent: {
        subscribe: withFilter(
          () => pubsub.asyncIterator(NEW_EVENT),
          async (payload, variables) => {
            return payload.editedEvent._id == variables.eventId;
          }
        )
      }
    }
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
  });

  const app = express();
  app.use(cors());
  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  apolloServer.applyMiddleware({ app, path: "/graphql" });
  httpServer.listen({ port: 4000 }, () => {
    console.log("Apollo Server on http://localhost:4000/graphql");
  });
};

//Planning.js
// export const PlanningSubscription = gql`
// subscription getQueriesUpdate($start: DateTime!, $end: DateTime!){
// 	queryUpdated()
// }
// `

//Calendar.js
// <GraphQL
// variables={this.variables}
// noPoll={true}
// query={GetBusinessStatus}
// >
// {({ currentUser }) => (
//   <GraphQL
//     variables={this.variables}
//     noPoll={true}
//     query={GetBusinessStatus}
//   >
//     {({ currentUser }) => (
//       <Subscription
//         subscription={editedEvent}
//         variables={this.variables}
//       >
//         {({ queries }) => {
//           const calendarProps = {
//             business: currentUser.business,
//             renderShift: renderQueryShift,
//             queries: (queries || []).map(makeQuery),
//             week,
//             setWeek: week => this.setState({ week }),
//             openQuery: redirect => this.setState({ redirect }),
//           }
//           return isMobile() ? (
//             <MobileCalendar {...calendarProps} />
//           ) : <DesktopCalendar {...calendarProps} /> ? (
//             <div />
//           ) : (
//             <GraphQL variables={this.variables} query={Planning}>
//               {({ queries }) => {
//                 const calendarProps = {
//                   business: currentUser.business,
//                   renderShift: renderQueryShift,
//                   queries: (queries || []).map(makeQuery),
//                   week,
//                   setWeek: week => this.setState({ week }),
//                   openQuery: redirect => this.setState({ redirect }),
//                 }

//                 return isMobile() ? (
//                   <MobileCalendar {...calendarProps} />
//                 ) : (
//                   <DesktopCalendar {...calendarProps} />
//                 )
//               }}
//             </GraphQL>
//           )
//         }}
//       </Subscription>
//     )}
//   </GraphQL>
// )}
// </GraphQL>
