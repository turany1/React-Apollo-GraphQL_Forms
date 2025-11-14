// packages/server/src/index.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Helper function to start the server
async function startApolloServer() {
  // 1. Create the new ApolloServer instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // 2. Start the server using the new 'startStandaloneServer' helper
  // This replaces the old `server.listen()`
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`Server is running on: ${url}`);
}

// 3. Call the function to start the server
startApolloServer();