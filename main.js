const fs = require('fs');
//const io = require('socket.io-client');

const utils = require('./utils.js');
const classes = require('./agent.js');

var config = require('./config.json');
var logFile = fs.createWriteStream('log.log', {flags:'a'});

createBots(config.hostname ? config.hostname : 'localhost', config.password);

async function createBots(hostname, password) {
	var bot1 = new classes.SHBot('bot1', password, 'http://', hostname, '8080');
	var bot2 = new classes.SHBot('bot2', password, 'http://', hostname, '8080');
	var bot3 = new classes.SHBot('bot3', password, 'http://', hostname, '8080');
	var bot4 = new classes.SHBot('bot4', password, 'http://', hostname, '8080');
	var bot5 = new classes.SHBot('bot5', password, 'http://', hostname, '8080');
	var bot6 = new classes.SHBot('bot6', password, 'http://', hostname, '8080');
	var bot7 = new classes.SHBot('bot7', password, 'http://', hostname, '8080');
	var bot8 = new classes.SHBot('bot8', password, 'http://', hostname, '8080');
	var bot9 = new classes.SHBot('bot9', password, 'http://', hostname, '8080');
	var bot10 = new classes.SHBot('bot10', password, 'http://', hostname, '8080');

	var bots = [host, bot2, bot3, bot4, bot5, bot6, bot7, bot8, bot9, host0];

	for (bot of bots) {
		await bot.socket;

		bot.socket.on('toLobby', () => {
			setTimeout(() => {
				for (bot of bots) bot.joinGame(host.uid, host.password);
			}, 100);
		});

		bot.socket.on('gameUpdate', (game, noChat) => {
			bot.game = game;
			if (game && game.gameState && game.gameState.isCompleted) {
				bot.socket.emit('leaveGame', {
					userName: bot.username,
					uid: bot.uid
				});

				setTimeout((bot) => {
					for (bot of bots) bot.joinGame(host.uid, host.password);
				}, 100, bot);
			}
		});
	}

	await host.socket;

	host.createGame = () => {
		setTimeout(async () => {
			host.creatingGame = true;
			await host.createNewGame('Bot Game', 5, 10, [], false, false, false, false,
				true, false, false, true, true, false, false, 30,
				false, false, true, false, false, false, false, true, false)
			host.creatingGame = false;
		}, 150);
	}

	host.socket.on('toLobby', () => {
		utils.logWithTime('Previous game deleted, creating new game...', logFile);

		host.createGame();
	});

	host.socket.on('gameUpdate', (game, noChat) => {
		host.game = game;
		if (game && game.gameState && game.gameState.isCompleted && !host.creatingGame) {
			utils.logWithTime('Previous game ended, creating new game...', logFile);

			host.socket.emit('leaveGame', {
				userName: host.username,
				uid: host.uid
			});

			host.createGame();
		}
	});

	host.createGame();

	setTimeout(() => {
		bot2.joinGame(host.uid, host.password);
		bot3.joinGame(host.uid, host.password);
		bot4.joinGame(host.uid, host.password);
		bot5.joinGame(host.uid, host.password);
		bot6.joinGame(host.uid, host.password);
		bot7.joinGame(host.uid, host.password);
		bot8.joinGame(host.uid, host.password);
		bot9.joinGame(host.uid, host.password);
		host0.joinGame(host.uid, host.password);
	}, 300);
}
