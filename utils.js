const fs = require('fs');
const http = require('http');
const https = require('https');
const io = require('socket.io-client');

const utils = require('./utils.js');

module.exports.log = function (string, file) {
	console.log(string);
	file.write(string + '\n');
}

module.exports.logWithTime = function (string, file) {
	var dateTime = new Date();
	utils.log((dateTime.getMonth() + 1).toString().padStart(2, '0') + '/' + dateTime.getDate().toString().padStart(2, '0') + '/' + dateTime.getFullYear() + ' ' + dateTime.getHours().toString().padStart(2, '0') + ':' + dateTime.getMinutes().toString().padStart(2, '0') + ':' + dateTime.getSeconds().toString().padStart(2, '0') + '.' + dateTime.getMilliseconds().toString().padStart(3, '0') + ': ' + string, file);
}

module.exports.signin = async function (username, password, protocol, hostname, port) {
	if (username && password) {
		var SID = await utils.getSID(username, password, hostname, port);
		var socketOptions = {
			reconnect: true,
			transportOptions: {
				polling: {
					extraHeaders: {
						'Cookie': SID
					}
				}
			}
		}
	}

	socket = await io(protocol + hostname + port, socketOptions);
	return socket;
}

module.exports.getSID = async function (username, password, hostname, port) {
	var encodedData = JSON.stringify({
		username: username,
		password: password
	});

	var signinOptions = {
		host: hostname,
		port: port,
		path: '/account/signin',
		method: 'POST',
	        headers: {
			'Content-Length': Buffer.byteLength(encodedData),
			'Content-Type': 'application/json'
		}
	}
	try {
		var response = await utils.makeHTTPSPOSTRequest(signinOptions, encodedData);
		return response.headers['set-cookie'][0].split(';')[0];

	} catch(e) {
		console.log(e);
		return e.headers['set-cookie'][0].split(';')[0];
	}
}

module.exports.getOnlineUsers = async function (hostname, port) {
	var options = {
		host: hostname,
		port: port,
		path: '/online-playercount',
		headers: {'User-Agent': 'request'}
	};

	try {
		var data = await utils.makeHTTPSGETRequest(options);
		return data.data.count;

	} catch(e) {
		logWithTime('Something\'s wrong, please try again later', logFile);
	}
}

module.exports.makeHTTPGETRequest = function (options) {
	return new Promise((resolve, reject) => {
		var json = '';
		var data = {};

		http.get(options, res => {
			res.on('data', chunk => {
				json += chunk;
			});
			res.on('end', () => {
				if (res.statusCode === 200) {
					try {
						data = JSON.parse(json);
						// data is available here:
						resolve({
							data: data,
							error: null,
							headers: res.headers,
							statusCode: res.statusCode
						});

					} catch (e) {
						reject({
							data: data,
							error: e,
							headers: res.headers,
							statusCode: res.statusCode
						});
					}

				} else {
					try {
						data = JSON.parse(json);
						reject({
							data: data,
							error: null,
							headers: res.headers,
							statusCode: res.statusCode
						});
					} catch (e) {
						reject({
							data: data,
							error: e,
							headers: res.headers,
							statusCode: res.statusCode
						});
					}
				}
			});
		}).on('error', function (err) {
			reject({
				data: null,
				error: err,
				headers: null,
				statusCode: null
			});
		});
	});
}

module.exports.makeHTTPSGETRequest = function (options) {
	return new Promise((resolve, reject) => {
		var json = '';
		var data = {};

		https.get(options, res => {
			res.on('data', chunk => {
				json += chunk;
			});
			res.on('end', () => {
				if (res.statusCode === 200) {
					try {
						data = JSON.parse(json);
						// data is available here:
						resolve({
							data: data,
							error: null,
							headers: res.headers,
							statusCode: res.statusCode
						});

					} catch (e) {
						reject({
							data: data,
							error: e,
							headers: res.headers,
							statusCode: res.statusCode
						});
					}

				} else {
					try {
						data = JSON.parse(json);
						reject({
							data: data,
							error: null,
							headers: res.headers,
							statusCode: res.statusCode
						});
					} catch (e) {
						reject({
							data: data,
							error: e,
							headers: res.headers,
							statusCode: res.statusCode
						});
					}
				}
			});
		}).on('error', function (err) {
			reject({
				data: null,
				error: err,
				headers: null,
				statusCode: null
			});
		});
	});
}

module.exports.makeHTTPPOSTRequest = function (options, encodedData) {
	return new Promise((resolve, reject) => {
		var json = '';
		var data = null;

		var req = http.request(options, res => {
			res.on('data', chunk => {
				json += chunk;
			});
			res.on('end', () => {
				if (res.statusCode === 200) {
					try {
						if (json.length > 0) data = JSON.parse(json);
						resolve({
							data: data,
							error: null,
							headers: res.headers,
							statusCode: res.statusCode
						});

					} catch (e) {
						reject({
							data: data,
							error: e,
							headers: res.headers,
							statusCode: res.statusCode
						});
					}

				} else {
					try {
						if (json.length > 0) data = JSON.parse(json);
						reject({
							data: data,
							error: null,
							headers: res.headers,
							statusCode: res.statusCode
						});

					} catch (e) {
						reject({
							data: data,
							error: e,
							headers: res.headers,
							statusCode: res.statusCode
						});
					}
				}
			});
		}).on('error', function (err) {
			reject({
				data: null,
				error: err,
				headers: null,
				statusCode: null
			});
		});

		req.write(encodedData);
		req.end();
	});
}

module.exports.makeHTTPSPOSTRequest = function (options, encodedData) {
	return new Promise((resolve, reject) => {
		var json = '';
		var data = null;

		var req = https.request(options, res => {
			res.on('data', chunk => {
				json += chunk;
			});
			res.on('end', () => {
				if (res.statusCode === 200) {
					try {
						if (json.length > 0) data = JSON.parse(json);
						resolve({
							data: data,
							error: null,
							headers: res.headers,
							statusCode: res.statusCode
						});

					} catch (e) {
						reject({
							data: data,
							error: e,
							headers: res.headers,
							statusCode: res.statusCode
						});
					}

				} else {
					try {
						if (json.length > 0) data = JSON.parse(json);
						reject({
							data: data,
							error: null,
							headers: res.headers,
							statusCode: res.statusCode
						});

					} catch (e) {
						reject({
							data: data,
							error: e,
							headers: res.headers,
							statusCode: res.statusCode
						});
					}
				}
			});
		}).on('error', function (err) {
			reject({
				data: null,
				error: err,
				headers: null,
				statusCode: null
			});
		});

		req.write(encodedData);
		req.end();
	});
}
