(function (ctx) {

var map = function(obj, callback) {
	var result = [];
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			result.push(callback(obj[i], i));
		}
	}
	return result;
};

var cellNeedsQuoting = function (cellValue) {
	// Fields containing a line-break, double-quote, and/or commas should be quoted.
	var regexp = /(\n|"|,)/g;
	return cellValue.match(regexp) !== null;
};

var CsvWriter = function () {
	this.rows = [];
	this.columnNames = [];
};

CsvWriter.prototype.addRow = function (object) {
	this.rows.push(object);
	return this;
};

CsvWriter.prototype.addColumnName = function (key, label) {
	label = label || key;
	this.columnNames.push({
		key: key,
		label: label
	});
	return this;
};

CsvWriter.prototype.toCsvString = function () {
	var buffer = [];
	var columnNames = this.columnNames;

	return map(this.rows, function(row, index) {
		var csvRow;

		if (this.columnNames) {
			csvRow = map(columnNames, function(name, index) {
				return row[name];
			});
		}
		else {
			csvRow = map(row, function (value, index) {
				return cellNeedsQuoting(value) ?
					'"' + value.replace(/"/g, '""') + '"' :
					value;
			});
		}
		return csvRow.join(",");
	}).join("\n");
};


ctx.CsvWriter = CsvWriter;

})(Balanced);
