var completedFilter = function(propertyName) {
	return function() {
		return (this.get("collection") || []).filterBy(propertyName);
	}.property("collection.@each." + propertyName);
};

export default completedFilter;
