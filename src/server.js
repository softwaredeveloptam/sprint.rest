const express = require("express");
const pokeData = require("./data");

const setupServer = () => {
  /**
   * Create, set up and return your express server, split things into separate files if it becomes too long!
   */

  const app = express();

  app.use(express.json());

  app.get("/api/pokemon", (request, response) => {
    const indexOfPokemon =
      undefined || findPokemonIndexByName(request.query.name);
    const id = undefined || removeZeros(request.query.id);
    const limit = undefined || request.query.limit;

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

    if (limit) {
      response.send(pokeData.pokemon.slice(0, limit));
    } else if (id) {
      response.send(pokeData.pokemon[Number(id) - 1]);
    } else if (indexOfPokemon >= 0) {
      response.send(pokeData.pokemon[indexOfPokemon]);
    } else response.send(pokeData.pokemon);
  });

  app.post("/api/pokemon", (request, response) => {
    response.send(request.body);
  });

  app.patch("/api/pokemon", (request, response) => {
    const id = undefined || request.query.id;
    // const name = undefined || request.query.name;

    if (id) {
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        if (id === pokeData.pokemon[i].id) {
          pokeData.pokemon[i] = request.body;
          response.send(pokeData.pokemon[i]);
          break;
        }
      }
    }
  });

  // app.get("/api/pokemon/:id")

  return app;
};

module.exports = { setupServer };
