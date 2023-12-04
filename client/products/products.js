

async function displayCurrentGames () {
    const response = await fetch('/api/games')
    const data = await response.json()
    const games = data.games
    console.log(games)

    const currentGamesDiv = document.getElementById('currentGames')
    currentGamesDiv.innerHTML = '<h2>Current Games:</h2>'
    if (games.length === 0) {
        currentGamesDiv.innerHTML += '<p>No games available</p>'
    } else {
        games.forEach(game => {
            currentGamesDiv.innerHTML += `
            <p>ID: ${game.id} Name: ${game.name} Year: ${game.year} Price: ${game.price}$ Description: ${game.description}</p>
            `                        
        });
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    await displayCurrentGames();
})