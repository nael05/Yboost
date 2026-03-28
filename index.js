const express = require('express');
let pokemons = require('./db-pokemons');
let helper = require('./helper');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/pokemons', (req, res) => {
    const message = `List of ${pokemons.length} * pokemons`;
    res.json(helper.success(message, pokemons));    
});

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(pokemon => pokemon.id === id);
    const message = "One pokemon is founded !";
    res.json(helper.success(message, pokemon));
});

app.post('/api/pokemons', (req, res) => {
    const id = pokemons.length + 1;
    const pokemonCreated = { ...req.body, id: id, created: new Date() };
    
    pokemons.push(pokemonCreated);
    
    const pokemonsString = JSON.stringify(pokemons, null, 2);
    const fileContent = `const pokemons = ${pokemonsString};\n\nmodule.exports = pokemons;`;
    fs.writeFileSync('./db-pokemons.js', fileContent);
    
    const message = `Le Pokémon ${pokemonCreated.name} a bien été ajouté !`;
    res.json(helper.success(message, pokemonCreated));
});

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pokemons.findIndex(pokemon => pokemon.id === id);
    
    if (index === -1) {
        return res.status(404).send('Le Pokémon demandé n\'existe pas.');
    }
    
    const pokemonUpdated = { ...pokemons[index], ...req.body, id: id };
    pokemons[index] = pokemonUpdated;
    
    const pokemonsString = JSON.stringify(pokemons, null, 2);
    const fileContent = `const pokemons = ${pokemonsString};\n\nmodule.exports = pokemons;`;
    fs.writeFileSync('./db-pokemons.js', fileContent);
    
    const message = `Le Pokémon ${pokemonUpdated.name} a bien été modifié !`;
    res.json(helper.success(message, pokemonUpdated));
});

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pokemons.findIndex(pokemon => pokemon.id === id);
    
    if (index === -1) {
        return res.status(404).send('Le Pokémon demandé n\'existe pas.');
    }
    
    const pokemonDeleted = pokemons[index];
    pokemons.splice(index, 1);
    
    const pokemonsString = JSON.stringify(pokemons, null, 2);
    const fileContent = `const pokemons = ${pokemonsString};\n\nmodule.exports = pokemons;`;
    fs.writeFileSync('./db-pokemons.js', fileContent);
    
    const message = `Le Pokémon ${pokemonDeleted.name} a bien été supprimé de la base de données !`;
    res.json(helper.success(message, pokemonDeleted));
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

module.exports = app;