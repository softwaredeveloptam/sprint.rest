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

  app.get("/api/types", (request, response) => {
    const limit = undefined || request.query.limit;

    if (limit) {
      response.send(pokeData.types.slice(0, limit));
    } else {
      response.send(pokeData.types);
    }
  });

  app.get("/api/types/:type/pokemon", (request, response) => {
    let pokemonWithType = [];

    if (request.params.type) {
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        if (pokeData.pokemon[i].types.includes(request.params.type)) {
          let singlePokemon = {};
          singlePokemon.id = pokeData.pokemon[i].id;
          singlePokemon.name = pokeData.pokemon[i].name;
          pokemonWithType.push(singlePokemon);
        }
      }
    }

    response.send(pokemonWithType);
  });

  app.get("/api/attacks", (request, response) => {
    const limit = undefined || request.query.limit;

    if (limit) {
      response.send(pokeData.attacks.fast.slice(0, limit));
    } else {
      response.send(pokeData.attacks);
    }
  });

  app.get("/api/attacks/fast", (request, response) => {
    const limit = undefined || request.query.limit;

    if (limit) {
      response.send(pokeData.attacks.fast.slice(0, limit));
    } else {
      response.send(pokeData.attacks.fast);
    }
  });

  app.get("/api/attacks/special", (request, response) => {
    const limit = undefined || request.query.limit;

    if (limit) {
      response.send(pokeData.attacks.special.slice(0, limit));
    } else {
      response.send(pokeData.attacks.special);
    }
  });

  app.get("/api/attacks/:name", (request, response) => {
    let name = request.params.name;
    let attack = {};

    for (let key in pokeData.attacks) {
      for (let i = 0; i < pokeData.attacks[key].length; i++) {
        if (pokeData.attacks[key][i].name === name) {
          attack.name = pokeData.attacks[key][i].name;
          attack.type = pokeData.attacks[key][i].type;
          attack.damage = pokeData.attacks[key][i].damage;
        }
      }
    }

    response.send(attack);
  });
  /*
  GET /api/attacks/:name/pokemon
  Returns all Pokemon (id and name) that have an attack with the given name
  */

  app.get("/api/attacks/:name/pokemon", (request, response) => {
    let pokemonWithAttack = [];

    if (request.params.name) {
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        for (let key in pokeData.pokemon[i].attacks) {
          for (let x = 0; x < pokeData.pokemon[i].attacks[key].length; x++) {
            if (
              pokeData.pokemon[i].attacks[key][x].name === request.params.name
            ) {
              let singlePokemon = {};
              singlePokemon.id = pokeData.pokemon[i].id;
              singlePokemon.name = pokeData.pokemon[i].name;
              pokemonWithAttack.push(singlePokemon);
            }
          }
        }
      }
    }

    response.send(pokemonWithAttack);
  });

  app.post("/api/pokemon", (request, response) => {
    response.send(request.body);
    // need to send back status 201
  });

  app.post("/api/types", (request, response) => {
    if (request.body.hasOwnProperty("type")) {
      pokeData.types.push(request.body.type);
    }

    response.send(pokeData.types);
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
      delete pokeData.pokemon[id];
      response.send(pokeData.pokemon[id]);
    }
  });

  app.delete("/api/types/:name", (request, response) => {
    if (request.params.name) {
      index = pokeData.types.indexOf(request.params.name);
      pokeData.types.splice(index);
      response.send(pokeData.types);
    } else {
      console.log("error code"); // edit later
    }
  });

  return app;
};

module.exports = { setupServer };
