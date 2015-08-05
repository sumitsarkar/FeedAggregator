UserHistory = new Mongo.Collection('userHistory');

UserHistory.deny({
	insert: function (userId, doc) {
	    return true;
	},
	update: function (userId, doc, fields, modifier) {
		// update not allowed
		return true;
	},
	remove: function (userId, doc) {
		// remove not allowed
		return true;
	}
});