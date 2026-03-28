/* index.js */
const express = require('express');
let pokemons = require('./db-pokemons');
let helper = require('./helper');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3003;
/*
*---------------
* R O U T I N G
*---------------
*/
// GET
app.get('/', (req, res) => {
    res.send(`<h3>Hello, YBoosST TEAM !</h3>`);
});
/*
app.get('/api/pokemons/1', (req, res) => {
    res.send(`<h3>Bulbizarre !</h3>`);
});
*/
// parameter
/*
app.get('/api/pokemons/:id', (req, res) => {
    const id = req.params.id;
    res.send(`<h3>About Pokemon ${id} !</h3>`);
});
// parameters
app.get('/api/pokemons/:id/:name', (req, res) => {
    //
    const id = req.params.id;
    const name = req.params.name;
    //
    res.send(`<h3>About Pokemon ${id} : ${name} !</h3>`);
});
*/
app.get('/api/pokemons', (req, res) => {
    //const id = parseInt(req.params.id);
    // 
    //res.send(`Pokemons (${pokemons.length})`);
    //res.json(pokemons);
    const message = `List of ${pokemons.length} * pokemons`;
    res.json( helper.success(message, pokemons) );    
});
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // search for the id & give the name if exist...
    const pokemon = pokemons.find( pokemon=> pokemon.id === id );
    //res.send(`Pokemon {<br>id: ${id},<br>name: '${pokemon.name}'<br>}`);
    //res.json(pokemon);
    const message = "One pokemon is founded !";
    res.json( helper.success(message, pokemon) );
});


/*
*-----------------------------------------------
* L O G  O N  A D M I N  S C R E E N
*-----------------------------------------------
*/
app.listen(PORT, () => {
console.log(`Server listening on http://localhost:${PORT}`);
});





app.post('/api/pokemons', (req, res) => {
    // 1. On calcule le nouvel ID
    const id = pokemons.length + 1;
    
    // 2. On crée le Pokémon avec toutes les informations de Dracaufeu
    const pokemonCreated = { 
        id: id,
        name: "Dracaufeu",
        hp: 78,
        cp: 84,
        picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/006.png",
        types: ["Feu", "Vol"],
        created: new Date() 
    };
    
    // 3. On l'ajoute au tableau local
    pokemons.push(pokemonCreated);
    
    // 4. On transforme le tableau en texte et on sauvegarde dans le fichier
    const pokemonsString = JSON.stringify(pokemons, null, 2);
    const fileContent = `const pokemons = ${pokemonsString};\n\nmodule.exports = pokemons;`;
    fs.writeFileSync('./db-pokemons.js', fileContent);
    
    // 5. On renvoie la réponse
    const message = `Le Pokémon ${pokemonCreated.name} a bien été ajouté et sauvegardé dans le fichier !`;
    res.json(helper.success(message, pokemonCreated));
});

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    const index = pokemons.findIndex(pokemon => pokemon.id === id);
    
    if (index === -1) {
        return res.status(404).send('Le Pokémon demandé n\'existe pas.');
    }
    
    const pokemonActuel = pokemons[index];
    
    const pokemonUpdated = { 
        ...pokemonActuel, 
        name: pokemonActuel.name + " evolution" 
    };
    
    pokemons[index] = pokemonUpdated;
    
    const pokemonsString = JSON.stringify(pokemons, null, 2);
    const fileContent = `const pokemons = ${pokemonsString};\n\nmodule.exports = pokemons;`;
    fs.writeFileSync('./db-pokemons.js', fileContent);
    
    const message = `Le Pokémon s'appelle désormais : ${pokemonUpdated.name} !`;
    res.json(helper.success(message, pokemonUpdated));
});

app.delete('/api/pokemons/:id', (req, res) => {
    // 1. On récupère l'ID passé dans l'URL
    const id = parseInt(req.params.id);
    
    // 2. On cherche l'index du Pokémon dans le tableau
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
    console.log(`Le serveur a démarré sur : http://localhost:${PORT}`);
});