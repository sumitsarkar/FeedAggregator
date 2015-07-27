UserSubscriptions = new Mongo.Collection('userSubscriptions');

var Schemas = {};

Schemas.UserSubscription = new SimpleSchema({
	userId: {
		type: String
	},
	feedId: {
		type: [String]
	}
});

UserSubscriptions.attachSchema(Schemas.UserSubscription);


UserSubscriptions.deny({
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