const express = require("express");
const pokeData = require("./data");

const setupServer = () => {
  /**
   * Create, set up and return your express server, split things into separate files if it becomes too long!
   */
  function removeZeros(strNum) {
    if (strNum !== undefined) {
      let num;
      if (strNum.charAt(0) === "0") {
        num = strNum
          .split("")
          .slice(1, strNum.length)
          .join("");
      } else {
        num = Number(strNum);
      }
      return num;
    }
  }

  function findPokemonIndexByName(name) {
    for (let i = 0; i < pokeData.pokemon.length; i++) {
      if (pokeData.pokemon[i].name === name) {
        return i;
      }
    }
  }

  const app = express();

  app.use(express.json());

  app.get("/api/pokemon", (request, response) => {
    const indexOfPokemon =
      undefined || findPokemonIndexByName(request.query.name);
    const id = undefined || removeZeros(request.query.id);
    const limit = undefined || request.query.limit;

    if (limit) {
      response.send(pokeData.pokemon.slice(0, limit));
    } else if (id) {
      response.send(pokeData.pokemon[Number(id) - 1]);
    } else if (indexOfPokemon >= 0) {
      response.send(pokeData.pokemon[indexOfPokemon]);
    } else response.send(pokeData.pokemon);
  });

  app.get(`/api/pokemon/:idOrName/evolutions`, (request, response) => {
    const id = parseInt(request.params.idOrName) - 1;

    if (id >= 0) {
      if (pokeData.pokemon[id].evolutions) {
        response.send(pokeData.pokemon[id].evolutions);
      } else {
        response.send({});
      }
    }
  });

  app.get(`/api/pokemon/:idOrName/evolutions/previous`, (request, response) => {
    const id = parseInt(request.params.idOrName) - 1;

    if (id >= 0) {
      if (pokeData.pokemon[id]["Previous evolution(s)"]) {
        response.send(pokeData.pokemon[id]["Previous evolution(s)"]);
      } else {
        response.send({});
      }
    }
  });

  app.post("/api/pokemon", (request, response) => {
    response.send(request.body);
    // need to send back status 201
  });

  app.patch(`/api/pokemon/:idOrName`, (request, response) => {
    const id = request.params.idOrName;
    // const pokemonName = request.params.name
    // const id = undefined || removeZeros(request.body.id);

    const indexOfPokemon =
      undefined || findPokemonIndexByName(request.body.name); // const id = undefined || request.query.id;
    // const name = undefined || request.query.name;

    const index = id - 1; //|| indexOfPokemon;
    if (index >= 0) {
      // for (let i = 0; i < pokeData.pokemon.length; i++) {
      //   if (id === pokeData.pokemon[i].id) {
      pokeData.pokemon[index] = request.body;
      response.send(pokeData.pokemon[index]);
      // request.params
      // break;
    }
  });

  app.delete("/api/pokemon/:idOrName", (request, response) => {
    const id = parseInt(request.params.idOrName) - 1;

    if (id >= 0) {
      // delete pokeData.pokemon[id]
      delete pokeData.pokemon[id];
      response.send(pokeData.pokemon[id]);
    }
  });

  return app;
};

module.exports = { setupServer };
