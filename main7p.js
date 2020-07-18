const fs = require('fs');
//const io = require('socket.io-client');

const utils = require('./utils.js');
const classes = require('./agent.js');

var config = require('./config.json');
var logFile = fs.createWriteStream('log.log', {flags:'a'});

createBots(config.hostname ? config.hostname : 'localhost', config.password);

async function createBots(hostname, password) {
	var host = new classes.SHBot('bot1', password, 'http://', hostname, '8080');
	var bot2 = new classes.SHBot('bot2', password, 'http://', hostname, '8080');
	var bot3 = new classes.SHBot('bot3', password, 'http://', hostname, '8080');
	var bot4 = new classes.SHBot('bot4', password, 'http://', hostname, '8080');
	var bot5 = new classes.SHBot('bot5', password, 'http://', hostname, '8080');
	var bot6 = new classes.SHBot('bot6', password, 'http://', hostname, '8080');
	var bot7 = new classes.SHBot('bot7', password, 'http://', hostname, '8080');
	var bot8 = new classes.SHBot('bot8', password, 'http://', hostname, '8080');
	var bot9 = new classes.SHBot('bot9', password, 'http://', hostname, '8080');
	var bot10 = new classes.SHBot('bot10', password, 'http://', hostname, '8080');

	var bots = [host, bot2, bot3, bot4, bot5, bot6, bot7, bot8, bot9, bot10];

	async function createGame(bot) {
		setTimeout(async () => {
			bot.creatingGame = true;
			await bot.createNewGame('Bot Game', 5, 10, [], false, false, false, false,
				true, false, false, true, true, false, false, 0.1,
				false, false, false, false, false, false, false, false, false)
			bot.creatingGame = false;
		}, 1000);
	}

	async function onGameUpdate(bot, game, noChat) {
		await bot.socket;

		if (game.playersState && game.publicPlayersState) bot.playerState = game.playersState[game.publicPlayersState.findIndex(player => player.userName === bot.username)];

		if (bot.playerState) bot.role = bot.playerState.nameStatus;

		bot.game = game;

		if (game && game.gameState) {
//			if (game.general.uid !== this.uid) return;
//			if (bot.lastPhase === 'completed') return;
//			console.log(game.general);

			if (game.gameState.isCompleted){
				if (!bot.hasRemade) {
					utils.log(bot.username + ' is remaking...', logFile);
					setTimeout(() => {
						bot.updateRemake(true);
					});
				}

				if ((!bot.game || !bot.gameState || bot.game.gameState.isCompleted) && !bot.isHost) {
					utils.logWithTime('Previous game ended...', logFile);

					setTimeout(() => {
//						if ((!bot.game || !bot.gameState || bot.game.gameState.isCompleted) && !bot.isHost) bot.leaveGame();
					}, 15000);

					setTimeout(() => {
						utils.logWithTime(bot.username + ' is joining ' + host.uid, logFile);
						bot.joinGame(host.uid, host.password);
					}, 17500);

				} else if ((!bot.game || !bot.gameState || bot.game.gameState.isCompleted) && !bot.creatingGame) {
					utils.logWithTime('Previous game ended, creating new game...', logFile);

					setTimeout(() => {
//						if ((!bot.game || !bot.gameState || bot.game.gameState.isCompleted) && !bot.creatingGame) bot.leaveGame();
					}, 15000);

					setTimeout(() => {
						createGame(bot);
					}, 16000);
				}

				bot.lastPhase = 'completed';
				return;
			}

			if (bot.lastPhase === game.gameState.phase) return;

			switch (game.gameState.phase) {
				case 'voting':
					bot.vote(true);
					console.log('Voted');

				case 'selectingChancellor':
					bot.selectChancellor(0);
			}

			bot.lastPhase = game.gameState.phase;
		}
	}

	async function onToLobby(bot) {
		if ((!bot.game || !bot.gameState || bot.game.gameState.isCompleted) && !bot.isHost) {
			setTimeout(() => {
				bot.joinGame(host.uid, host.password);
			}, 2000);

		} else 	if ((!bot.game || !bot.gameState || bot.game.gameState.isCompleted) && !bot.creatingGame) {
			utils.logWithTime('Previous game deleted, creating new game...', logFile);

			createGame(bot);
		}
	}

	await host.socket;

	host.socket.on('gameUpdate', (game, noChat) => {
		onGameUpdate(host, game, noChat);
	});

	host.socket.on('toLobby', () => {
		onToLobby(host);
	});

	createGame(host);

	await bot2.socket;
	await bot3.socket;
	await bot4.socket;
	await bot5.socket;
	await bot6.socket;
	await bot7.socket;
	await bot8.socket;
	await bot9.socket;
	await bot10.socket;

	bot2.socket.on('gameUpdate', (game, noChat) => {
		onGameUpdate(bot2, game, noChat);
	});

	bot3.socket.on('gameUpdate', (game, noChat) => {
		onGameUpdate(bot3, game, noChat);
	});

	bot4.socket.on('gameUpdate', (game, noChat) => {
		onGameUpdate(bot4, game, noChat);
	});

	bot5.socket.on('gameUpdate', (game, noChat) => {
		onGameUpdate(bot5, game, noChat);
	});

	bot6.socket.on('gameUpdate', (game, noChat) => {
		onGameUpdate(bot6, game, noChat);
	});

	bot7.socket.on('gameUpdate', (game, noChat) => {
		onGameUpdate(bot7, game, noChat);
	});

	bot8.socket.on('gameUpdate', (game, noChat) => {
		onGameUpdate(bot8, game, noChat);
	});

	bot9.socket.on('gameUpdate', (game, noChat) => {
		onGameUpdate(bot9, game, noChat);
	});

	bot10.socket.on('gameUpdate', (game, noChat) => {
		onGameUpdate(bot10, game, noChat);
	});

	bot2.socket.on('toLobby', () => {
		onToLobby(bot2);
	});

	bot3.socket.on('toLobby', () => {
		onToLobby(bot3);
	});

	bot4.socket.on('toLobby', () => {
		onToLobby(bot4);
	});

	bot5.socket.on('toLobby', () => {
		onToLobby(bot5);
	});

	bot6.socket.on('toLobby', () => {
		onToLobby(bot6);
	});

	bot7.socket.on('toLobby', () => {
		onToLobby(bot7);
	});

	bot8.socket.on('toLobby', () => {
		onToLobby(bot8);
	});

	bot9.socket.on('toLobby', () => {
		onToLobby(bot9);
	});

	bot10.socket.on('toLobby', () => {
		onToLobby(bot10);
	});

	setTimeout(() => {
		bot2.joinGame(host.uid, host.password);
		bot3.joinGame(host.uid, host.password);
		bot4.joinGame(host.uid, host.password);
		bot5.joinGame(host.uid, host.password);
		bot6.joinGame(host.uid, host.password);
		bot7.joinGame(host.uid, host.password);
		bot8.joinGame(host.uid, host.password);
		bot9.joinGame(host.uid, host.password);
		bot10.joinGame(host.uid, host.password);
	}, 1500);
}
