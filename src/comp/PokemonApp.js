import React, { useState, useEffect } from 'react';

const PokemonApp = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading Pokémon');

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
        setIsLoading(false);
      };

      fetchAllPokemonData();
    };

    fetchPokemonData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prevText) => {
        if (prevText.endsWith('...')) {
          return 'Loading Pokémon';
        } else {
          return prevText + '.';
        }
      });
    }, 500);

    return () => clearInterval(interval);
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
    <div style={{ backgroundColor: '#ffd000', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c325.png" alt="Pikachu" style={{ height: '80px', marginRight: '10px' }} />
        <h1>Pokemon Database</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name or ID..."
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {isLoading ? (
        <p>{loadingText}</p>
      ) : (
        <ul style={{ listStyleType: 'none', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {displayedPokemonList.map((pokemon) => (
            <li key={pokemon.id} style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
              <h2>{pokemon.name}</h2>
              <img src={pokemon.image} alt={pokemon.name} style={{ height: '150px' }} />
              <p>
                <strong>CP:</strong> {pokemon.cp}
              </p>
              <p>
                <strong>Attack:</strong> {pokemon.attack}
              </p>
              <p>
                <strong>Defense:</strong> {pokemon.defense}
              </p>
              <p>
                <strong>Type:</strong> {pokemon.type}
              </p>
            </li>
          ))}
        </ul>
      )}
      <div id="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button id="previous" disabled={currentPage === 1} onClick={handlePreviousPage}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
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
