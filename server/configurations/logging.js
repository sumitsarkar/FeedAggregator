logger = Meteor.npmRequire('winston');

var loggerLevels = {
	levels: {
		silly: 0,
		info: 1,
		warn: 2,
		error: 3
	},
	colors: {
		silly: 'white',
		info: 'blue',
		warn: 'orange',
		error: 'red'
	}
};

logger.addColors(loggerLevels.colors);
