import React, { useState, useEffect } from 'react';

const PokemonApp = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 10;
  const totalPokemons = 1281;

  useEffect(() => {
    const fetchPokemonData = async () => {
      const getPokemonDetails = async (id) => {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch Pokémon with ID: ${id}`);
          }
          const pokemonData = await response.json();
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            image: pokemonData.sprites.front_default,
            cp: Math.floor(Math.random() * 1000) + 500, // Random CP for demonstration
            attack: pokemonData.stats.find((stat) => stat.stat.name === 'attack').base_stat,
            defense: pokemonData.stats.find((stat) => stat.stat.name === 'defense').base_stat,
            type: pokemonData.types[0].type.name,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      };

      const fetchAllPokemonData = async () => {
        const allPokemonData = [];
        for (let id = 1; id <= totalPokemons; id++) {
          const pokemon = await getPokemonDetails(id);
          if (pokemon) {
            allPokemonData.push(pokemon);
          }
        }
        setPokemonList(allPokemonData);
        setTotalPages(Math.ceil(allPokemonData.length / itemsPerPage));
      };

      fetchAllPokemonData();
    };

    fetchPokemonData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const filteredPokemonList = pokemonList.filter(
    (pokemon) => pokemon.name.toLowerCase().includes(searchTerm) || String(pokemon.id) === searchTerm
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPokemonList = filteredPokemonList.slice(startIndex, endIndex);

  return (
    <div>
      <h1>Pokemon Search</h1>
      <input
        id="search"
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by name or ID..."
      />
      <ul>
        {displayedPokemonList.map((pokemon) => (
          <li key={pokemon.id}>
            <span id="name">{pokemon.name}</span>
            <img src={pokemon.image} alt={pokemon.name} />
            <p>CP: {pokemon.cp}</p>
            <p>Attack: {pokemon.attack}</p>
            <p>Defense: {pokemon.defense}</p>
            <p>Type: {pokemon.type}</p>
          </li>
        ))}
      </ul>
      <div id="pagination">
        <button id="previous" disabled={currentPage === 1} onClick={handlePreviousPage}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button id="next" disabled={currentPage === totalPages} onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PokemonApp;
