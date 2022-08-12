const cors = require('cors');
const express = require('express');
const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema} = require('graphql')
const {graphqlHTTP} = require('express-graphql');

const app = express();

const seedData = [
  {id: 1, language: 'js', loved: true},
  {id: 2, language: 'js', loved: true},
  {id: 3, language: 'js', loved: true}
]

// schema
// resolver

const languageType = new GraphQLObjectType({
  name: 'Language',
  description: 'programing language',
  fields: {
    id: {
      type: GraphQLInt
    },
    language: {
      type: GraphQLString
    },
    loved: {
      type: GraphQLBoolean
    }
  }
})

const getData = new GraphQLObjectType({
  name: 'GetData',
  description: 'This is a function get data',
  fields: {
    languages: {
      type: GraphQLList(languageType),
      
      resolve: () => seedData
    },
    language: {
      type: languageType,
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve: (_, args) => seedData.find(item => item.id = args.id)
    }
  }
})

const rootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'This is function add data',
  fields: {
    language: {
      type: languageType,
      args: {
        language: {type: GraphQLString},
        loved: {type: GraphQLBoolean}
      },
      resolve: (_, args) => {
        const newData = {id: seedData.length + 1, language: args.language, loved: args.loved};
        seedData.push(newData);
        return newData;
      }
    }, 
    delete: {
      type: languageType,
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (_, args) => {
        const item = seedData.find(item => item.id === args.id);
        return item;
      }
    }
  }
})




const schema = new GraphQLSchema({query: getData, mutation: rootMutation})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql :true
}));

const port = 5000;

app.listen(
   port, () => console.info(
      `Server started on port ${port}`
   )
);