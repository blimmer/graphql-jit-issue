import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
import { GraphQLTemporalDate } from "./scalarResolvers/date.js";
import { Temporal } from "temporal-polyfill";
import { useGraphQlJit } from "@envelop/graphql-jit";

export const schema = createSchema({
  typeDefs: `
    scalar Date

    type Query {
      hello: String
    }

    type Mutation {
      testMutation(input: TestMutationInput!): TestMutationResult!
    }

    input TestMutationInput {
      date: Date!
    }

    type TestMutationResult {
      date: Date!
    }
  `,
  resolvers: {
    Date: GraphQLTemporalDate,
    Query: {
      hello: () => "world",
    },
    Mutation: {
      testMutation: (_, { input }) => {
        const { date } = input;
        if (!(date instanceof Temporal.PlainDate)) {
          throw new Error("Input should be a Temporal.PlainDate");
        }
        return { date };
      },
    },
  },
});

const yoga = createYoga({ schema, graphiql: true, plugins: [useGraphQlJit()] });
const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
