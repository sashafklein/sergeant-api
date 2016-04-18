var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');

var steps = require('./data/steps.json');
var drills = require('./data/drills.json');

var stepType = new graphql.GraphQLObjectType({
  name: 'Step',
  fields: {
    id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
    name: { type: graphql.GraphQLString },
    minutes: { type: graphql.GraphQLInt }
  }
});

var drillType = new graphql.GraphQLObjectType({
  name: 'Drill',
  fields: {
    id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
    name: { type: graphql.GraphQLString },
    steps: {
      type: new graphql.GraphQLList(stepType),
      resolve: function (drill) {
        return steps.filter(function(s) { return s.drillID === drill.id; });
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      drill: {
        type: drillType,
        // `args` describes the arguments that the `user` query accepts
        args: {
          id: { type: graphql.GraphQLInt }
        },
        resolve: function (_, args) {
          return drills.find(function(d) { return d.id === args.id; });
        }
      }
    }
  })
});

var port = process.env.PORT || 8080;

express()
  .use('/graphql', graphqlHTTP({ schema: schema, pretty: true }))
  .listen(port);

console.log(`GraphQL server running on http://localhost:${port}/graphql`);