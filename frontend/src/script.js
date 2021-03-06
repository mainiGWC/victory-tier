
/**
 * Scrolls down the page
 */

function scroll() {
	window.scrollTo(0,1000);
}


/**
 * Creates a single datapoint DOM object
 */
function createDataPoint(key, val) {
	let label = key.replace(/([A-Z])/g, " $1");

	let root = document.createElement("div");
	root.className = "data";
	root.innerHTML = "<p>" + label + " : " + val + "</p>"
	return root
}


/**
 * Given a position abbreviation, get the full name
 */
function positionLookup(code) { 
	switch(code) {
	case "C":
		return "Center";
	case "PF":
		return "Power Forward";
	case "PG":
		return "Point Guard";
	case "SG":
		return "Shooting Guard";
	case "SF":
		return "Small Forward";
	default:
		return code;
	}
}


/**
 * Creates a DOM element for a single player
 */
function createPlayer(playerName, playerData) {
	let playerElement = document.createElement("div");
	playerElement.className = "playerElement";

	let name = document.createElement("h1");
	name.innerHTML = playerName;
	name.className = "playName";

	// Render basic statistics (number of points, position, team)
	let baseStats = document.createElement('div');
	baseStats.className = "baseStats";

	baseStats.append(createDataPoint('Points', playerData['Points']));

	let position = positionLookup(playerData['Position'])
	baseStats.append(createDataPoint('Position', position));

	baseStats.append(createDataPoint('Team', playerData['Team']));

	// Render a dropdown menu with more detailed statistics
	let dropdownMenu = document.createElement('div');
	dropdownMenu.className = 'dropdownMenu'

	// Dropdown menu should disappear and reappear on every click
	dropdownMenu.onclick = function() {
		for(child of dropdownMenu.childNodes) {
			if(child.classList.contains('dropdownMenuStats')) {
				console.log(child);
				child.classList.toggle("show");
			}
		}
	}

	let dropdownMenuTitle = document.createElement('h2');
	dropdownMenuTitle.className = 'dropdownMenuTitle';
	dropdownMenuTitle.innerHTML = "More Statistics";

	dropdownMenu.append(dropdownMenuTitle);

	let dropdownMenuStats = document.createElement('div');
	dropdownMenuStats.className = 'dropdownMenuStats';

	// Go through the extra stats and render them
	let extraStats = [
		'Rebounds', 'Assists', 'BlockedShots', 'Steals', 'Turnovers',
		'FieldGoalsPercentage', 'FreeThrowsPercentage', 'TwoPointersMade',
		'ThreePointersMade', 'PersonalFouls', 'DoubleDoubles',
		'TripleDoubles'
	]

	for(stat of extraStats) {
		dropdownMenuStats.append(createDataPoint(stat, playerData[stat]));
	}

	dropdownMenu.append(dropdownMenuStats);

	// Combine the created elements into a single card
	playerElement.append(name);
	playerElement.append(baseStats);
	playerElement.append(dropdownMenu);

	return playerElement
}


/**
 * Draw players and their data to the screen
 */
function renderPlayers(queriedPlayer, similarPlayers) {
	let bottom = document.getElementById("bottom");
	bottom.innerHTML = "";

	queriedPlayerElement = createPlayer(queriedPlayer['Name'], queriedPlayer);
	bottom.append(queriedPlayerElement);

	let similarPlayerParent = document.createElement('div');
	similarPlayerParent.className = 'similarPlayerParent';

	for(const [name, data] of Object.entries(similarPlayers)) {
		similarPlayerParent.append(createPlayer(name, data));
	}

	bottom.append(similarPlayerParent);
}


/**
 * Performs a search and updates the DOM.
 * Note: this function is asynchronous
 */
function search() {
	// Get the search text
	let query = document.getElementById("search-box").value;

	// Prepare an XHR request for the server data
	const requestBody = {search: query};
	const request = new Request('/search',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		}
	)

	// Make the request and parse the response
	fetch(request).then(response => response.json()).then(json => {
		renderPlayers(JSON.parse(json.queried_player), JSON.parse(json.results));
	})
	

}

/**
 * Callback for when the user searches for a player
 */
function onSearch() {
	search();
}

/**
 * Main application entrypoint
 */
function main() {

}
