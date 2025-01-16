import { GraphQLError, GraphQLScalarType, Kind, type GraphQLScalarTypeConfig } from "graphql";
import { Temporal } from "temporal-polyfill";

const parseDate = (date: string): Temporal.PlainDate => {
  return Temporal.PlainDate.from(date);
};

export const serializeDate = (date: Temporal.PlainDate): string => {
  return date.toString();
};
export const GraphQLTemporalDateConfig: GraphQLScalarTypeConfig<Temporal.PlainDate, string> = {
  name: "Date",
  description:
    "A date string, such as 2007-12-03, compliant with the `full-date` " +
    "format outlined in section 5.6 of the RFC 3339 profile of the " +
    "ISO 8601 standard for representation of dates and times using " +
    "the Gregorian calendar.",
  serialize(value) {
    if (value instanceof Temporal.PlainDate) {
      return value.toString();
    } else if (typeof value === "string") {
      return value;
    } else {
      throw new GraphQLError("Date cannot represent a non string, or non Date type " + JSON.stringify(value));
    }
  },
  parseValue(value) {
    if (!(typeof value === "string")) {
      throw new GraphQLError(`Date cannot represent non string type ${JSON.stringify(value)}`);
    }

    return Temporal.PlainDate.from(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Date cannot represent non string type ${"value" in ast && ast.value}`, { nodes: ast });
    }
    const { value } = ast;
    return Temporal.PlainDate.from(value);
  },
  extensions: {
    codegenScalarType: "Date | string",
    jsonSchema: {
      type: "string",
      format: "date",
    },
  },
};

/**
 * An RFC 3339 compliant date scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 date string as input and
 *    parses it to a javascript Date.
 *
 * Output:
 *    This scalar serializes javascript Dates and
 *    RFC 3339 date strings to RFC 3339 date strings.
 */
export const GraphQLTemporalDate = new GraphQLScalarType(GraphQLTemporalDateConfig);
