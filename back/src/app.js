const { GraphQLServer } = require("graphql-yoga");
const { PubSub, withFilter } = require("graphql-subscriptions");
const { randomToken } = require("./utils");

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

  const typeDefs = `
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
    editEvent(id: String, message:String, level:String, dataId: String, environnement: String, service: String): Event
  }
  type Subscription {
    editedEvent(eventId: String): Event
  }
`;

  const pubsub = new PubSub();

  const NEW_EVENT = "NEW_EVENT";

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

  const server = new GraphQLServer({ typeDefs, resolvers });
  server.start(() => console.log("Server is running on localhost:4000"));
};
//valentin.buisson@edu.devinci.fr
