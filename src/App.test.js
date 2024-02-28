import { render, screen } from '@testing-library/react';
import App from './App';
// importamos el JSON (test json local)
import data from "./data.json";

// realizamos  el test de que si existe un nombre Luke Skywalker en el JSON
describe("Star Wars APP", () => {
  // indica que empezara primero y que este vijilando el metodo fetch
  beforeAll(() => jest.spyOn(window, 'fetch'));

    // //test de si tiene un nombre en expesifico (test json local)
    // it("Should show a list of characters including Luke Skywalker", () => {
    //   render(<App />);
    //   expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    // })


  // // test de si cada caracter de name tiene informacion (test json local)
  // it("should show a list of characters from a JSON file", () => {
  //   render(<App />);
  //   // realizamos recorrido del JSON expecialmente del caracter name
  //   for(let character of data.results){
  //     expect(screen.getByText(character.name)).toBeInTheDocument();
  //   }
  // });

  // test realizar la  PETICION a la API directo de la web
  it("should show a list of characters from the API", async() => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    });

    render(<App />);
    expect(window.fetch).toHaveBeenCalledTimes(2);
    expect(window.fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/?page=1');

    for(let character of data.results){
      expect(await screen.findByText(character.name)).toBeInTheDocument();
    }
  });

  // test de erro de red en la api externa
  it('should show an error message when has a network error', async () => {
    window.fetch.mockResolvedValueOnce(new Error ("Network error"));

    render(<App />);
    // validara si es igual el mensaje del constructor de error de people.js
    expect(await screen.findByText("Network error")).toBeInTheDocument();
  })

  it("should show an error message if there's a network error", async () => {
    window.fetch.mockRejectedValue(new Error("Network error"));

    render(<App />);
    expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
  });

  //test de error 500
  it("should show an error message if there's a server error", async () => {
    window.fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(<App />);
    expect(
      await screen.findByText(/There was a server error./i)
    ).toBeInTheDocument();
  });

  //test de error 404
  it("should show an error message if there's a NotFound error", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<App />);
    expect(
      await screen.findByText(/The resource you requested was not found./i)
    ).toBeInTheDocument();
  });
});