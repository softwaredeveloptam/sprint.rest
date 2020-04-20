const express = require("express");
const pokeData = require("./data");

const setupServer = () => {
  /**
   * Create, set up and return your express server, split things into separate files if it becomes too long!
   */

  const app = express();

  app.use(express.json());

  app.get("/api/pokemon", (request, response) => {
    const limit = undefined || request.query.limit;
    if (limit) {
      response.send(pokeData.pokemon.slice(0, limit));
    } else response.send(pokeData.pokemon);
  });

  app.post("/api/pokemon", (request, response) => {
    response.send(request.body);
  });

  // app.patch("/api/pokemon", (request, response) => {
  //   const id = undefined || request.query.id;
  //   const name = undefined || request.query.name;

  //   if (id) {
  //     for(let i = 0; i < pokeData.pokemon.length; i++) {
  //       if (id === pokeData.pokemon[i].id) {
  //         pokeData.pokemon[i] = request.body;
  //         response.send(pokeData.pokemon[i]);
  //         break;
  //       }
  //     }
  //   }

  // });

  // app.get("/api/pokemon/:id")

  return app;
};

module.exports = { setupServer };
