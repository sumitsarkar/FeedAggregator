validateUrl = function(url) {
	var expression = /http[s]?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi
	var regex = new RegExp(expression);

	if (url.match(regex)){
		return true;
	} else {
		return false;
	}
}