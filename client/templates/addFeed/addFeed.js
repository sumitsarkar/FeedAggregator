Template.addFeed.onRendered(function() {
	$('.ui.modal').modal('setting', 'closable', false).modal({
			blurring: true,
			onHidden: function() {
				Template.addFeed.destroy();
			}
		})
		.modal('show');
});