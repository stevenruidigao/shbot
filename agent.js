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
			this.getUserGameSettings();
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
			console.log(this.username + ': ' + uid);
			this.updateUserStatus('', uid);
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
			this.confirmTOU();
		});

		this.socket.on('updateSeatForUser', () => {
			// Do something
		});

		this.socket.on('userList', list => {
			if (Date() - this.lastReconnectAttempt > 5000) {
				this.lastReconnectAttempt = now;

				if (!list.list.map(user => this.username).includes(this.username)) {
					console.log('Detected own user not in list, attempting to reconnect...');
					this.getUserGameSettings();
				}
			}
		});
	}

	async acknowledgeWarning() {
		this.socket = await this.socket;

		this.socket.emit('acknowledgeWarning');
	}

	async checkRestrictions() {
		this.socket = await this.socket;

		this.socket.emit('receiveRestrictions');
	}

	async checkWarnings() {
		this.socket = await this.socket;

		this.socket.emit('checkWarnings', this.username);
	}

	async claim(claim, claimType) {
		this.socket = await this.socket;

		this.socket.emit({
			claim: claimType,
			claimState, claim
		})
	}

	async confirmTOU() {
		this.socket = await this.socket;

		this.socket.emit('confirmTOU');
	}

	async createNewGame(gameName, minPlayersCount, maxPlayersCount, excludedPlayerCount, eloSliderValue, customGameSettings, isTourny, isPrivate,
			    disableChat, isVerifiedOnly, disableObserverLobby, disableObserver, disableGameChat, rainbowGame, blindMode, timedMode,
			    flappyMode, flappyOnlyMode, casualGame, practiceGame, rebalance6p, rebalance7p, rebalance9p2f, unlistedGame, privatePassword) {
		this.socket = await this.socket;

		this.hasRemade = false;
		this.isHost = true;
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

	async disconnect() {
		this.socket = await this.socket;

		this.socket.emit('disconnect');
	}

	async execute(index) {
		this.socket = await this.socket;

		this.socket.emit('selectedPlayerToExecute', {
			playerIndex: index,
			uid: this.uid
		});
	}

	async freezeGame() {
		this.socket = await this.socket;

		this.socket.emit('modFreezeGame', {
			modName: this.username,
			uid: this.uid
		});
	}

	async gameChat(chat) {
		this.socket = await this.socket;

		this.socket.emit('addNewGameChat', {
			chat: chat,
			uid: this.uid,
			userName: this.username
		});
	}

	async generalChat(chat) {
		this.socket = await this.socket;

		this.socket.emit('addNewGeneralChat', {
			chat: chat,
			userName: this.username
		});
	}

	async getGameInfo(uid) {
		this.socket = await this.socket;

		this.socket.emit('getGameInfo', uid);
	}

	async getGameList() {
		this.socket = await this.socket;

		this.socket.emit('getGameList');
	}

	async getGeneralChats() {
		this.socket = await this.socket;

		this.socket.emit('getGeneralChats');
	}

	async getPlayerNotes(seatedPlayers) {
		this.socket = await this.socket;

		this.socket.emit('getPlayerNotes', {
			seatedPlayers: seatedPlayers,
			userName: this.username
		});
	}

	async getReplayGameChats(uid) {
		this.socket = await this.socket;

		this.socket.emit('getReplayGamechats', uid ? uid : this.uid);
	}

	async getUserGameSettings() {
		this.socket = await this.socket;

		this.socket.emit('getUserGameSettings');
	}

	async getUserList() {
		this.socket = await this.socket;

		this.socket.emit('sendUser');
	}

	async getUserReports() {
		this.socket = await this.socket;

		this.socket.emit('getUserReports');
	}

	async getSignups() {
		this.socket = await this.socket;

		this.socket.emit('getSignups');
	}

	async getAllSignups() {
		this.socket = await this.socket;

		this.socket.emit('getAllSignups');
	}

	async getModInfo(count) {
		this.socket = await this.socket;

		this.socket.emit('getModInfo', count);
	}

	async getPrivateSignups() {
		this.socket = await this.socket;

		this.socket.emit('getPrivateSignups');
	}

	async investigate(index) {
		this.socket = await this.socket;

		this.socket.emit('selectParyMembershipInvestigate', {
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

	async joinGame(uid, password) {
		this.socket = await this.socket;

		this.uid = uid;
		this.password = password;
		this.hasRemade = false;

		this.getGameInfo(uid);

		this.socket.emit('updateSeatedUser', {
			uid: uid,
			password
		});
	}

	async leaveGame() {
		this.socket = await this.socket;

		this.socket.emit('leaveGame', {
			uid: this.uid,
			userName: this.username
		});
	}

	async peekVotes() {
		this.socket = await this.socket;

		this.socket.emit('modPeekVotes', {
			modName: this.username,
			uid: this.uid
		});
	}

	async playerReport(reportedPlayer, reason, gameType, comment) {
		this.socket = await this.socket;

		this.socket.emit({
			gameUid: this.uid,
			reportedPlayer: reportedPlayer,
			reason: reason,
			gameType: gameType,
			comment: comment
		});
	}

	async presidentVoteBurn(vote) {
		this.socket = await this.socket;

		this.socket.emit('selectedPresidentVoteOnBurn', {
			vote: vote,
			uid: this.uid
		});
	}

	async regatherAEMUsernames() {
		this.socket = await this.socket;

		this.socket.emit('regatherAEMUsernames');
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

	async selectPolicies() {
		this.socket = await this.socket;

		this.socket.emit('selectedPolicies', {
			uid: this.uid
		});
	}

	async sendFlappyEvent(team, type) {
		this.socket = await this.socket;

		this.socket.emit('flappyEvent', {
			team: team,
			type: type
		});
	}

	async sendHasSeenNewPlayerModal() {
		this.socket = await this.socket;

		this.socket.emit('hasSeenNewPlayerModal');
	}

	async sendModerationAction(username, isReportResolveChange, ip, action, comment, id) {
		this.socket = await this.socket;

		this.socket.emit({
			userName: username,
			isReportResolveChange: isReportResolveChange,
			ip: ip,
			action: action,
			modName: this.username,
			_id: id
		});
	}

	async sendUpdatedPlayerNote(note, notedUser) {
		this.socket = await this.socket;

		this.socket.emit({
			userName: this.username,
			notedUser: notedUser,
			note: note
		});
	}

	async sendUpdatedTheme(primaryColor, secondaryColor, tertiaryColor, backgroundColor, textColor) {
		this.socket = await this.socket;

		this.socket.emit({
			primaryColor: primaryColor,
			secondaryColor: secondaryColor,
			tertiaryColor: tertiaryColor,
			backgroundColor: backgroundColor,
			textColor: textColor
		});
	}

	async specialElect(index) {
		this.socket = await this.socket;

		this.socket.emit('selectedSpecialElection', {
			playerIndex: index,
			uid: this.uid
		});
	}

	async subscribeModChat() {
		this.socket = await this.socket;

		this.socket.emit('subscribeModChat', uid);
	}

	async updateBio(data) {
		this.socket = await this.socket;

		this.socket.emit('updateBio', data);
	}

	async updateRemake(remakeStatus) {
		this.socket = await this.socket;

		this.hasRemade = remakeStatus;

		this.socket.emit('updateRemake', {
			remakeStatus: remakeStatus,
			uid: this.uid
		});
	}

	async updateSeatedUser() {
		this.socket = await this.socket;

		this.socket.emit('updateSeatedUser', {
			uid: this.uid,
			password: this.password
		});
	}


	async updateUserStatus(type, uid) {
		this.socket = await this.socket;

		this.socket.emit('updateUserStatus', type, this.uid);
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

	async vote(vote) {
		this.socket = await this.socket;

		this.socket.emit('selectedVoting', {
			vote: vote,
			uid: this.uid
		});
	}
}

module.exports.SHBot = SHBot;
