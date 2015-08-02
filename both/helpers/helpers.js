validateUrl = function(url) {
	var expression = /http[s]?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi
	var regex = new RegExp(expression);

	if (url.match(regex)) {
		return true;
	} else {
		return false;
	}
};

removeStyle = function(all) {
	var i = all.length;
	var j, is_hidden;

	// Presentational attributes.
	var attr = [
		'align',
		'background',
		'bgcolor',
		'border',
		'cellpadding',
		'cellspacing',
		'color',
		'face',
		'height',
		'hspace',
		'marginheight',
		'marginwidth',
		'noshade',
		'nowrap',
		'valign',
		'vspace',
		'width',
		'vlink',
		'alink',
		'text',
		'link',
		'frame',
		'frameborder',
		'clear',
		'scrolling',
		'style'
	];

	var attr_len = attr.length;

	while (i--) {
		is_hidden = (all[i].style.display === 'none');

		j = attr_len;

		while (j--) {
			all[i].removeAttribute(attr[j]);
		}

		// Re-hide display:none elements,
		// so they can be toggled via JS.
		if (is_hidden) {
			all[i].style.display = 'none';
			is_hidden = false;
		}
	}
}