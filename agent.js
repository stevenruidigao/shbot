const fs = require('fs');
const io = require('socket.io-client');

const classes = require('./agent.js');
const utils = require('./utils.js');

var logFile = fs.createWriteStream('log.log', {flags:'a'});

class SHBot {
	constructor(username, password, protocol, hostname, port) {
		this.username = username;
		this.lastReconnectAttempt = Date();
		this.socket = utils.signin(username, password, protocol, hostname, port);
		this.createSocket();
	}

	async createSocket() {
		this.socket = await this.socket;

		this.socket.on('connect', () => {
			console.log('Socket connected.');
			this.socket.emit('hasSeenNewPlayerModal');
			this.socket.emit('updateUserStatus');
			this.socket.emit('getUserGameSettings');
			this.socket.emit('sendUser', {
				userName: this.username,
				verified: false,
				staffRole: '',
				hasNotDismissedSignupModal: false
			});
			this.socket.emit('upgrade');
		});

		this.socket.on('fetchUser', () => {
			this.socket.emit('sendUser', {
				userName: this.username,
				verified: false,
				staffRole: '',
				hasNotDismissedSignupModal: false
			});
		});

		this.socket.on('gameUpdate', game => {
			this.game = game;
		});

		this.socket.on('gameSettings', gameSettings => {
			this.gameSettings = gameSettings;
		});

		this.socket.on('generalChats', chats => {
			// Maybe do something
			console.log(chats);
		});

		this.socket.on('joinGameRedirect', uid => {
			console.log(uid);
			this.socket.emit('updateUserStatus', '', this.game && this.game.general && this.game.general.uid);
			this.uid = uid;
		});

		this.socket.on('manualDisconnection', async () => {
			console.log('Disconnected, attempting to reconnect...');
			this.socket = await utils.signin(this.username, this.password);
			this.socket = this.socket;
		});

		this.socket.on('manualReload', async () => {
			console.log('Disconnected, attempting to reconnect...');
			this.socket = await utils.signin(this.username, this.password);
			this.socket = this.socket;
		});

		this.socket.on('playerChatUpdate', chat => {
			console.log(chat);
		});

		this.socket.on('touChange', changeList => {
			this.socket.emit('confirmTOU');
		});

		this.socket.on('updateSeatForUser', () => {
			
		});

		this.socket.on('userList', list => {
			if (Date() - this.lastReconnectAttempt > 5000) {
				this.lastReconnectAttempt = now;
				if (!list.list.map(user => this.username).includes(this.username)) {
					console.log('Detected own user not in list, attempting to reconnect...');
					this.socket.emit('getUserGameSettings');
				}
			}
		});
	}

	async createNewGame(gameName, minPlayersCount, maxPlayersCount, excludedPlayerCount, eloSliderValue, customGameSettings, isTourny, isPrivate,
			    disableChat, isVerifiedOnly, disableObserverLobby, disableObserver, disableGameChat, rainbowGame, blindMode, timedMode,
			    flappyMode, flappyOnlyMode, casualGame, practiceGame, rebalance6p, rebalance7p, rebalance9p2f, unlistedGame, privatePassword) {
		this.socket = await this.socket;
		this.password = privatePassword;

		console.log('Creating a game with name ' + gameName);
		this.socket.emit('addNewGame', {
			gameName: gameName,
			minPlayersCount: minPlayersCount,
			maxPlayersCount: maxPlayersCount,
			excludedPlayerCount: excludedPlayerCount,
			eloSliderValue: eloSliderValue,
			customGameSettings: customGameSettings,
			isTourny: isTourny,
			isPrivate: isPrivate,
			disableChat: disableChat,
			isVerifiedOnly: isVerifiedOnly,
			disableObserverLobby: disableObserverLobby,
			disableObserver: disableObserver,
			disableGameChat: disableGameChat,
			rainbowgame: rainbowGame,
			blindMode: blindMode,
			timedMode: timedMode,
			flappyMode: flappyMode,
			flappyOnlyMode: flappyOnlyMode,
			casualGame: casualGame,
			practiceGame: practiceGame,
			rebalance6p: rebalance6p,
			rebalance7p: rebalance7p,
			rebalance9p2f: rebalance9p2f,
			unlistedGame: unlistedGame,
			privatePassword: privatePassword
		});
	}

	async generalChat(message) {
		this.socket = await this.socket;

		this.socket.emit('addNewGeneralChat', {
			username: this.username,
			chat: message
		});
	}

	async getGameInfo(uid) {
		this.socket = await this.socket;
		this.socket.emit('getGameInfo', uid);
	}

	async joinGame(uid, password) {
		this.socket = await this.socket;

		this.uid = uid;
		this.password = password;

		this.socket.emit('updateSeatedUser', {
			uid: uid,
			password
		});
	}

	async selectVote(vote) {
		this.socket = await this.socket;

		this.socket.emit('selectedVoting', {
			vote: vote,
			uid: this.uid
		});
	}

	async selectChancellor(index) {
		this.socket = await this.socket;

		this.socket.emit('presidentSelectedChancellor', {
			chancellorIndex: index,
			uid: this.uid
		});
	}

	async selectPolicy(selection) {
		if (this.game && this.game.publicPlayersState) {
			currentPlayer = await this.game.publicPlayersState.find(player => player.userName === this.username);

			if (currentPlayer.govermentStatus === 'isPresident') {
				selectPresidentPolicy(selection);

			} else if (currentPlayer.govermentStatus === 'isChancellor') {
				selectChancellorPolicy(selection);
			}
		}
	}

	async selectPresidentPolicy(selection) {
		this.socket = await this.socket;

		this.socket.emit('selectedPresidentPolicy', {
			uid: this.uid,
			selection: selection
		});
	}

	async selectChancellorPolicy(selection) {
		this.socket = await this.socket;

		this.socket.emit('selectedChancellorPolicy', {
			uid: this.uid,
			selection: selection
		});
	}

	async investigate(index) {
		this.socket = await this.socket;

		socket.emit('selectParyMembershipInvestigate', {
			playerIndex: index,
			uid: this.uid
		});
	}

	async investigateReverse(index) {
		this.socket = await this.socket;

		this.socket.emit('selectParyMembershipInvestigateReverse', {
			playerIndex: index,
			uid: this.uid
		});
	}

	async specialElect(index) {
		this.socket = await this.socket;

		this.socket.emit('selectedSpecialElection', {
			playerIndex: index,
			uid: this.uid
		});
	}

	async execute(index) {
		this.socket = await this.socket;

		this.socket.emit('selectedPlayerToExecute', {
			playerIndex: index,
			uid: this.uid
		});
	}

	async voteVeto(vote) {
		if (this.game && this.game.publicPlayersState) {
			currentPlayer = await this.game.publicPlayersState.find(player => player.userName === this.username);

			if (currentPlayer.govermentStatus === 'isChancellor') {
				chancellorVoteVeto(vote);

			} else if (currentPlayer.govermentStatus === 'isPresident') {
				presidentVoteVeto(vote);
			}
		}
	}

	async chancellorVoteVeto(vote) {
		this.socket = await this.socket;

		this.socket.emit('selectedChancellorVoteOnVeto', {
			vote: vote,
			uid: this.uid
		});
	}

	async presidentVoteVeto(vote) {
		this.socket = await this.socket;

		this.socket.emit('selectedPresidentVoteOnVeto', {
			vote: vote,
			uid: this.uid
		});
	}

	async presidentVoteBurn(vote) {
		this.socket = await this.socket;

		this.socket.emit('selectedPresidentVoteOnBurn', {
			vote: vote,
			uid: this.uid
		});
	}
}

module.exports.SHBot = SHBot;
