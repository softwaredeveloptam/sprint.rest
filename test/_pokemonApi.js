const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { setupServer } = require("../src/server");
const pokeData = require("../src/data");
const { expect } = require("chai");

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

  /*

  DELETE /api/pokemon/:idOrName
    It should allow you to make partial modifications to a Pokemon

  */

  describe("DELETE", () => {
    describe("/api/pokemon/:idOrName", () => {
      it("should delete given pokemon", async () => {
        const expected = {
          id: 001,
          name: "Bulbasaur",
        };

        const id = expected.id;

        const response = await request.delete(`/api/pokemon/:${id}`);
        // const responseName = await request
        //   .get("/api/pokemon")
        //   .query({ name: "Bulbasaur" });

        expect(JSON.parse(response.text).length == pokeData.pokemon.length).to
          .be.true;
      });
    });
  });

  // fix later
  xdescribe("PATCH", () => {
    describe(`/api/pokemon/:idOrName`, () => {
      it("should allow you to make partial modifications to a Pokemon", async () => {
        const expected =
          //JSON.parse(
          {
            id: "001",
            name: "MODIFIED_Bulbasaur!!!!!!!",
          };
        const id = expected.id;

        const response = await request
          .patch(`/api/pokemon/:${id}`) //.patch("/api/pokemon/001") //patch('/api/pokemon/:id')
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
