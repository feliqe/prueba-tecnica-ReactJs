// importamos el useState, useEffect, useRef es para buscar campos
import { useState, useEffect, useRef } from 'react';
import './App.css';
// importamos el JSON local
// import data from "./data.json";

// importamos el JSON pero del navegador
import { getCharacter, getPeople, searchCharacter } from './api/people';

function App() {
  //constante para buscar
  const inputSearch = useRef(null);
  // estado de busqueda
  const [textSearch, setTextSearch] = useState("");

  // constante de estados de people
  const [people, setPeople] = useState([]);
  // para iniciar el estado con un valor
  const [currentCharacter, setCurrentCharacter] = useState(1);
  // campos vacios
  const [details, setDetails] = useState({});

  // constante para la paginacion de principio en la pagina 1
  const [page, setPage] = useState(1);

   // constante de erro
  const [errorState, setErrorState] = useState({ hasError: false});

  // recorreo el JSon de people
  useEffect(() => {
    getPeople(page).then(setPeople).catch(handleError);
  }, [page]);

  //ejecutar cuando el campos currentCharacter cambien de valor
  useEffect(() => {
    getCharacter(currentCharacter).then(setDetails).catch(handleError);
  }, [currentCharacter]);

const handleError = (err) => {
  // si el estado de hasError cambia a true enviara el mesanje del constructor en peiple.js
  setErrorState({ hasError: true, message: err.message})
};

const showDetails = (character) => {
  // traemos el numero del id del la url https://swapi.dev/api/species/1/
  // separamos por / y despues borramos los "" vacios indicando el [0] para tomar el numero al final y transformarlo en numero
  const id = Number(character.url.split("/").slice(-2)[0]);
  setCurrentCharacter(id);
};

//funcion de buscar y pasar los parametros
const onChangeTextSearch = (event) => {
  event.preventDefault();
  const text = inputSearch.current.value;
  setTextSearch(text);
};

const onSearchSubmit = (event) => {
  // valida si no es enter se devuleve sin ejecutar
  if(event.key !== "Enter") return;
  // limpiamos el campo
  inputSearch.current.value = "";
  setDetails({});
  //searchCharacter - funcion de people.js donde buscamos por la url el campo
  // llamamos el campo setPeople para que traiga todo los campos
  searchCharacter(textSearch).then(setPeople).catch(handleError);
};

//funcion para la paginacion
const onChangePage = (next) => {
  if(!people.previous && page + next <= 0) return;
  if(!people.next && page + next >= 9) return;
  // si ninguna condicion se cumple se ejecuta
  setPage(page + next);
};

  return (
    <div>
      {/* campo para buscar por palabra */}
      <input
        ref={inputSearch}
        onChange={onChangeTextSearch}
        onKeyDown={onSearchSubmit}
        type="text"
        placeholder="Busca un personaje"
      />
      <ul>
        {/* mostrar el mensaje del error en pantalla */}
        {errorState.hasError && <div>{errorState.message}</div>}

        {/* mapeamos el people de la funcion externa */}
        {people?.results?.map((character) =>(
           <li key={character.name} onClick={() => showDetails(character)}>
           {character.name}
         </li>
        ))}
      </ul>

      {/* botones para la paginacion  */}
      <section>
        <button onClick={() => onChangePage(-1)}>Previo</button>| {page} |<button onClick={() => onChangePage(1)}>Siguiente</button>
      </section>

        {/* validamos si existe para poder mostrarlo */}
        { details && (
          <aside>
            <h1>{details.name}</h1>
            <ul>
              <li>Altura: {details.height}</li>
              <li>Masa: {details.mass}</li>
              <li>Año de nacimineto: {details.birth_year}</li>
            </ul>
          </aside>
        )}
    </div>
  );
}
export default App;