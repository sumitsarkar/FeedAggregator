Accounts.onCreateUser(function(options, user) {
	// Crete the document for UserSubscriptions
	var document = {
		userId: user._id,
		feeds: []
	};

	UserSubscriptions.insert(document);

	return user;
});