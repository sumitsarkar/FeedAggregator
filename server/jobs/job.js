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
    return parser.text('every 5 seconds');
  };

  UpdateFeedJob.prototype.handleJob = function() {
  	feedUpdate();
    return console.log('Job complete');
  };

  return UpdateFeedJob;

})(Job);
