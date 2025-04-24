const { gql } = require('graphql-tag');

const typeDefs = gql`
    type Movie {
        id: String!
        title: String!
        description: String!
    }

    type TVShow {
        id: String!
        title: String!
        description: String!
    }

    type Query {
        movie(id: String!): Movie
        movies: [Movie]
        tvShow(id: String!): TVShow
        tvShows: [TVShow]
    }

    type Mutation {
        createMovie(id: String!, title: String!, description: String!): Movie
        createTVShow(id: String!, title: String!, description: String!): TVShow
    }
`;

module.exports = typeDefs;