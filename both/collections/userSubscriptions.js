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