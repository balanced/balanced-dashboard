var JustitiaDispute = Balanced.Model.extend({});

JustitiaDispute.reopenClass({
	loadFromUri: function(uri) {
		return Balanced.ModelArray.newArrayLoadedFromUri(uri, Balanced.JustitiaDispute, "disputes");
	}
});

export default JustitiaDispute;
