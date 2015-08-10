var extend = function(child, parent) {
		for (var key in parent) {
			if (hasProp.call(parent, key)) child[key] = parent[key];
		}

		function ctor() {
			this.constructor = child;
		}
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		child.__super__ = parent.prototype;
		return child;
	},
	hasProp = {}.hasOwnProperty;



this.UpdateFeedJob = (function(superClass) {
	extend(UpdateFeedJob, superClass);

	function UpdateFeedJob() {
		return UpdateFeedJob.__super__.constructor.apply(this, arguments);
	}

	UpdateFeedJob.setupCron = function(parser) {
		return parser.text('every 1 minute');
	};

	UpdateFeedJob.prototype.handleJob = function() {
		feedUpdate();
	};

	return UpdateFeedJob;

})(Job);


this.UpdateIndividualFeedJob = (function(superClass) {
	extend(UpdateIndividualFeedJob, superClass);

	function UpdateIndividualFeedJob() {
		return UpdateIndividualFeedJob.__super__.constructor.apply(this, arguments);
	}

	UpdateIndividualFeedJob.prototype.handleJob = function() {
		updateIndividualFeed(this.params.feed);
	};

	return UpdateIndividualFeedJob;

})(Job);


this.SlackJob = (function(superClass) {
	extend(SlackJob, superClass);

	function SlackJob() {
		return SlackJob.__super__.constructor.apply(this, arguments);
	}

	SlackJob.prototype.handleJob = function() {
		return HTTP.post(Meteor.settings.slack.url, {
			data: {
				channel: "#feedaggregator",
				username: "The App",
				text: this.params.text,
				icon_url: "https://usercycle.com/img/icon.png",
				link_names: 1
			}
		});
	};

	return SlackJob;

})(Job);

this.Slack = (function() {
	function Slack() {}

	Slack.notify = function(text) {
		return Job.push(new SlackJob({
			text: text
		}));
	};

	return Slack;

})();