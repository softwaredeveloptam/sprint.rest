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

  describe("GET", () => {
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

    /*

    It should return the evolutions a Pokemon has.
      Note that some Pokemon don't have evolutions, it should return an empty array in this case
      Example: GET /api/pokemon/staryu/evolutions should return [ { "id": 121, "name": "Starmie" } ]

    */

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

    /*
      GET /api/pokemon/:idOrName/evolutions/previous
      For evolved Pokemon, this should return it's previous evolutions
      Example: GET /api/pokemon/17/evolutions/previous should return [ { "id": 16, "name": "Pidgey" } ]
    */

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
  });

  /*
    POST /api/pokemon
      It should add a Pokemon.
  */

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
  });

  xdescribe("DELETE", () => {
    describe("/api/pokemon/:idOrName", () => {
      it("should delete given pokemon", async () => {
        const savePokeData = Array.from(pokeData);

        const expected = {
          id: 001,
          name: "Bulbasaur",
        };

        const id = expected.id;

        const response = await request.delete(`/api/pokemon/${id}`);

        // checks if bulbasaur is deleted
        expect(JSON.parse(response.text !== expected)).to.be.true;

        pokeData = savePokeData;
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

    //   describe("/api/attacks/:name", () => {
    //     it("should modify specified attack", () => {

    //     });
  });
});

//  it("POST /echo returns body content", async () => {
//         const expected = {
//           foo: "bar",
//           honey: ["I", "shrank", "the", "kids"],
//           loopy: {
//             loop: {
//               deeply: {
//                 nested: [1, "123", [{ lol: "lol" }, null, null, 5]],
//               },
//             },
//           },
//         };
//         const res = await request.post("/echo").send(expected);
//         res.should.be.json;
//         JSON.parse(res.text).should.deep.equal(expected);
//       });
