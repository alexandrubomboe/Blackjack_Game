let funds = document.getElementById("funds");
let addFunds = document.getElementById("addFunds");
let body = document.getElementById("body");
let overlayText = document.getElementById("overlayText");

addFunds.addEventListener("click", () => {
	funds.innerText = parseInt(funds.innerText) + 10;
});

//creating the DECK
let suits = ["hearts", "diamonds", "clubs", "spades"];
let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let symbols = ["♥", "♦", "♣", "♠"];
let deck = [];
function createDeck() {
	for (let i = 0; i < suits.length; i++) {
		for (let j = 0; j < values.length; j++) {
			let value = values[j];
			let suit = suits[i];
			let symbol;
			if (suit == "hearts") {
				symbol = symbols[0];
			} else if (suit == "diamonds") {
				symbol = symbols[1];
			} else if (suit == "clubs") {
				symbol = symbols[2];
			} else {
				symbol = symbols[3];
			}
			let color;
			["hearts", "diamonds"].includes(suit)
				? (color = "red")
				: (color = "black");
			deck.push({ value, suit, symbol, color });
		}
	}
}
createDeck();

let usersPoints = document.getElementById("usersPoints");
function pointsUpdate(value, usersPoints) {
	if (!["J", "Q", "K", "A"].includes(value)) {
		usersPoints.innerText = parseInt(usersPoints.innerText) + parseInt(value);
	} else if (value == "J" || value == "Q" || value == "K") {
		usersPoints.innerText = parseInt(usersPoints.innerText) + 10;
	} else {
		if (parseInt(usersPoints.innerText) + 11 > 21) {
			usersPoints.innerText = parseInt(usersPoints.innerText) + 1;
		} else {
			usersPoints.innerText = parseInt(usersPoints.innerText) + 11;
		}
	}
}

//when HIT button is clicked, display random card
let hit = document.getElementById("hit");
let stand = document.getElementById("stand");

let userLost = 0;
let opponentLost = 0;
stand.addEventListener("click", () => {
	hit.style.visibility = "hidden";
	stand.style.visibility = "hidden";

	function opponentTurn() {
		if (parseInt(opponentsPoints.innerText) <= 16) {
			opponentHit();
			setTimeout(opponentTurn, 1000); // wait a second, then check again
		} else {
			endGame();
		}
	}

	opponentTurn(); // start the opponent's turn
});
hit.addEventListener("click", () => {
	hit.style.visibility = "hidden";
	stand.style.visibility = "hidden";
	let random = Math.floor(Math.random() * (deck.length + 1));
	let card = deck[random];

	let flipCard = document.getElementById("flipCard");
	let flipCardBack = document.getElementById("flipCardBack");

	//create and display new card on the back side
	showCard(card, flipCardBack);
	flipCardBack.innerHTML = "";
	createNewCard();
	//trigger the flip
	flipCard.classList.add("flipped");

	setTimeout(() => {
		buttonsDisplay();
	}, 1300);
	pointsUpdate(card.value, usersPoints);
	if (parseInt(usersPoints.innerText) > 21) {
		userLost = 1;
		setTimeout(() => {
			stand.click();
		}, 1300);
	}
});
function showCard(card, container, backSideUp) {
	let cardContainer = document.getElementsByClassName(container)[0];
	function createNewCard(card) {
		return `
			<div class="cardFlip" id="flipCard">
				<div class="cardFace cardFront" id="backSideUpCard"></div>
				<div class="cardFace cardBack ${card.color}" id="flipCardBack">
					<div class="topLeft">
						<div id="value">${card.value}</div>
						<div id="symbol">${card.symbol}</div>
					</div>
					<div class="middle">
						<div id="symbol">${card.symbol}</div>
					</div>
					<div class="bottomRight">
						<div id="symbol">${card.symbol}</div>
						<div id="value">${card.value}</div>
					</div>
				</div>
			</div>`;
	}
	cardContainer.innerHTML += createNewCard(card);
}
showCard(deck[0], "cardContainer", false);
showCard(deck[2], "cardContainer", false);
showCard(deck[40], "cardContainer", false);
function opponentHit() {
	if (parseInt(opponentsPoints.innerText) <= 16) {
		let random = Math.floor(Math.random() * (deck.length + 1));
		let card = deck[random];
		showCard(card, opponentsCards);
		pointsUpdate(card.value, opponentsPoints);
	}
	if (parseInt(opponentsPoints.innerText) > 21) {
		opponentLost = 1;
	}
}
function buttonsDisplay() {
	hit.style.visibility = "visible";
	stand.style.visibility = "visible";
}
function endGame() {
	if (userLost == 0 && opponentLost == 0) {
		if (parseInt(usersPoints.innerText) > parseInt(opponentsPoints.innerText)) {
			userWin();
		} else if (
			parseInt(usersPoints.innerText) < parseInt(opponentsPoints.innerText)
		) {
			opponentWin();
		} else {
			draw();
		}
	} else if (userLost == 0 && opponentLost == 1) {
		userWin();
	} else if (userLost == 1 && opponentLost == 0) {
		opponentWin();
	} else {
		draw();
	}
	setTimeout(() => {
		location.reload();
	}, 1400);
}
function userWin() {
	overlayText.style.visibility = "visible";
}
function opponentWin() {
	overlayText.innerText = "Opponent wins!";
	overlayText.style.visibility = "visible";
}
function draw() {
	overlayText.innerText = "Draw!";
	overlayText.style.visibility = "visible";
}
