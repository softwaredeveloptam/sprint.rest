const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { setupServer } = require("../src/server");
const pokeData = require("../src/data");
const { expect } = require("chai");
const sinon = require("sinon");

/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */

const server = setupServer();

describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(server);
  });

  xdescribe("GET", () => {
    describe("/api/pokemon", () => {
      it("should return all pokemon", async () => {
        const response = await request.get("/api/pokemon");
        expect(JSON.parse(response.text).length == pokeData.pokemon.length).to
          .be.true;
      });

      it("should take query parameter `limit=n` that makes endpoint return first `n` Pokemon", async () => {
        const response = await request
          .get("/api/pokemon")
          .query({ limit: 100 });

        expect(JSON.parse(response.text).length == 100).to.be.true;
      });
    });

    describe("/api/pokemon/:id", () => {
      it("should return pokemon with the given ID", async () => {
        const response = await request.get("/api/pokemon").query({ id: 1 });

        expect(JSON.parse(response.text)).to.be.deep.equal(pokeData.pokemon[0]);
      });
    });

    describe("/api/pokemon/:name", () => {
      it("should return pokemon with the given name", async () => {
        const response = await request
          .get("/api/pokemon")
          .query({ name: "Bulbasaur" });

        expect(JSON.parse(response.text)).to.be.deep.equal(pokeData.pokemon[0]);
      });
    });

    describe("/api/pokemon/:idOrName/evolutions", () => {
      it("should return the evolutions a Pokemon has", async () => {
        const expected = {
          id: 001,
          name: "Bulbasaur",
        };

        const id = expected.id;
        const response = await request.get(`/api/pokemon/${id}/evolutions`);

        // expected to equal pokemon evolutions
        expect(JSON.parse(response.text)).to.be.deep.equal(
          pokeData.pokemon[0].evolutions
        );
      });

      it("should return an empty case if the Pokemon has no evolutions", async () => {
        const expected = {
          id: 143,
          name: "Snorlax",
        };

        const id = expected.id;

        const response = await request.get(`/api/pokemon/${id}/evolutions`);

        // expected to return an empty object because it doesn't have evolutions
        expect(JSON.parse(response.text)).to.be.deep.equal({});
      });
    });

    describe("/api/pokemon/:idOrName/evolutions/previous", () => {
      it("should return an evolved Pokemon's previous evolution", async () => {
        const expected = {
          id: 003,
          name: "Venusaur",
        };

        const id = expected.id;

        const response = await request.get(
          `/api/pokemon/${id}/evolutions/previous`
        );

        // expected to return Venusaur's previous evolution
        expect(JSON.parse(response.text)).to.be.deep.equal(
          pokeData.pokemon[2]["Previous evolution(s)"]
        );
      });
    });

    describe("/api/types", () => {
      it("it should return all available types", async () => {
        const response = await request.get(`/api/types`);

        // should return all available types
        expect(JSON.parse(response.text)).to.be.deep.equal(pokeData.types);
      });

      it("should take query parameter `limit=n` that makes endpoint return only `n` types", async () => {
        const response = await request.get("/api/types").query({ limit: 5 });

        // should return the query number of types
        expect(JSON.parse(response.text).length == 5).to.be.true;
      });
    });

    describe("/api/types/:type/pokemon", () => {
      it("it should return all Pokemon that are of a given type", async () => {
        const expectWord = {
          type: "Dragon",
        };
        const type = expectWord.type;

        const expected = [
          {
            id: "147",
            name: "Dratini",
          },
          {
            id: "148",
            name: "Dragonair",
          },
          {
            id: "149",
            name: "Dragonite",
          },
        ];

        const response = await request.get(`/api/types/${type}/pokemon`);

        // should return all available types
        expect(JSON.parse(response.text)).to.be.deep.equal(expected);
      });
    });

    describe("/api/attacks", () => {
      it("it should return all attacks", async () => {
        const response = await request.get(`/api/attacks`);

        // should return all available attacks
        expect(JSON.parse(response.text)).to.be.deep.equal(pokeData.attacks);
      });

      it("should take query parameter `limit=n` that makes endpoint return only `n` attacks", async () => {
        const response = await request.get("/api/attacks").query({ limit: 5 });

        // should return the query number of fast types
        // can change to send only just fast or special type of attacks
        expect(JSON.parse(response.text).length == 5).to.be.true;
      });
    });

    describe("/api/attacks/fast", () => {
      it("it should return all fast attacks", async () => {
        const response = await request.get(`/api/attacks/fast`);

        // should return all available fast attacks
        expect(JSON.parse(response.text)).to.be.deep.equal(
          pokeData.attacks.fast
        );
      });

      it("should take query parameter `limit=n` that makes endpoint return only `n` attacks", async () => {
        const response = await request
          .get(`/api/attacks/fast`)
          .query({ limit: 5 });

        // should return the query number of types
        expect(JSON.parse(response.text).length == 5).to.be.true;
      });
    });

    describe("/api/attacks/special", () => {
      it("it should return all special attacks", async () => {
        const response = await request.get(`/api/attacks/special`);

        // should return all available fast attacks
        expect(JSON.parse(response.text)).to.be.deep.equal(
          pokeData.attacks.special
        );
      });

      it("should take query parameter `limit=n` that makes endpoint return only `n` attacks", async () => {
        const response = await request
          .get(`/api/attacks/special`)
          .query({ limit: 5 });

        // should return the query number of types
        expect(JSON.parse(response.text).length == 5).to.be.true;
      });
    });

    describe("/api/attacks/:name", () => {
      it("should return a specific attack by name, no matter if it is fast or special", async () => {
        const expected = {
          name: "Tackle",
          type: "Normal",
          damage: 12,
        };
        let name = expected.name;

        const response = await request.get(`/api/attacks/${name}`);

        expect(JSON.parse(response.text)).to.be.deep.equal(expected);
      });
    });

    describe("/api/attacks/:name/pokemon", () => {
      it("should return all Pokemon (id and name) that have an attack with the given name", async () => {
        const expectWord = {
          name: "Psycho Cut",
        };
        const name = expectWord.name;

        const expected = [
          {
            id: "064",
            name: "Kadabra",
          },
          {
            id: "065",
            name: "Alakazam",
          },
          {
            id: "150",
            name: "Mewtwo",
          },
        ];

        const response = await request.get(`/api/attacks/${name}/pokemon`);

        // should return all Pokemon (id & name) with Psycho Cut move
        expect(JSON.parse(response.text)).to.be.deep.equal(expected);
      });
    });
  });

  xdescribe("POST", () => {
    describe("/api/pokemon", () => {
      it("should add Pokemon", async () => {
        const expected = {
          name: "Tam",
          honey: ["I", "shrank", "the", "kids"],
          loopy: {
            loop: {
              deeply: {
                nested: [1, "123", [{ lol: "lol" }, null, null, 5]],
              },
            },
          },
        };
        const response = await request.post("/api/pokemon").send(expected);
        expect(JSON.parse(response.text)).to.be.deep.equal(expected);
      });
    });

    describe("/api/types", () => {
      it("adds a new type", async () => {
        const test = Array.from(pokeData.types);

        const expected = { type: "magic" };
        const expectWord = expected.type;

        const response = await request.post("/api/types").send(expected);

        // expects Magic to be added into Types
        expect(JSON.parse(response.text)).to.include(expectWord);

        pokeData.types = test;
      });
    });
  });

  xdescribe("DELETE", () => {
    describe("/api/pokemon/:idOrName", () => {
      it("should delete given pokemon", async () => {
        const savePokeData = Array.from(pokeData.pokemon);

        let expected = {
          id: 001,
          name: "Bulbasaur",
        };

        let id = expected.id;

        const response = await request.delete(`/api/pokemon/${id}`);

        // checks if bulbasaur is deleted
        expect(JSON.parse(response.text.includes(expected))).to.be.false;

        pokeData.pokemon = savePokeData;
      });
    });

    describe("/api/types/:name", () => {
      it("should delete given type", async () => {
        const savePokeDataTypes = Array.from(pokeData.types);

        let expected = { type: "Dragon" };
        let name = expected.type;

        const response = await request.delete(`/api/types/${name}`);

        // checks if magic is deleted
        expect(JSON.parse(response.text.includes(name))).to.be.false;

        pokeData.types = savePokeDataTypes;
      });
    });
  });

  // fix later
  xdescribe("PATCH", () => {
    describe(`/api/pokemon/:idOrName`, () => {
      it("should allow you to make partial modifications to a Pokemon", async () => {
        const expected =
          // JSON.parse(
          {
            id: "001",
            name: "MODIFIED_Bulbasaur!!!!!!!",
          };
        const id = expected.id;

        const response = await request
          .patch(`/api/pokemon/${id}`) //.patch("/api/pokemon/001") //patch('/api/pokemon/:id')
          // .query({ id: 1 })
          .send(expected);

        expect(JSON.parse(response.text)).to.be.deep.equal(expected);
      });
    });
  });
});
