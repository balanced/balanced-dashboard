var map = function(obj, callback) {
	var result = [];
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			result.push(callback(obj[i], i));
		}
	}
	return result;
};

var cellNeedsQuoting = function(cellValue) {
	// Fields containing a line-break, double-quote, and/or commas should be quoted.
	var regexp = /(\n|"|,)/g;

	cellValue = cellValue || "";
	return cellValue.match(regexp) !== null;
};

var CsvWriter = function() {
	this.rows = [];
	this.columnNames = [];
};

CsvWriter.prototype.addRow = function(object) {
	this.rows.push(object);
	return this;
};

CsvWriter.prototype.addColumnName = function(key, label) {
	label = label || key;
	this.columnNames.push({
		key: key,
		label: label
	});
	return this;
};

CsvWriter.prototype.addColumnNames = function(names) {
	for (var i = 0; i < names.length; i++) {
		this.addColumnName(names[i]);
	}
	return this;
};

CsvWriter.prototype.toCsvString = function() {
	var buffer = [];
	var columnNames = this.columnNames;

	var rowCells = map(this.rows, function(row, index) {
		var csvRow;

		if (columnNames) {
			csvRow = map(columnNames, function(name, index) {
				return row[name.key];
			});
		} else {
			csvRow = map(row, function(value, index) {
				return cellNeedsQuoting(value) ?
					'"' + value.replace(/"/g, '""') + '"' :
					value;
			});
		}
		return csvRow.join(",");
	});
	if (columnNames && columnNames.length > 0) {
		rowCells.unshift(columnNames.map(function(col) {
			return col.label;
		}));
	}
	return rowCells.join("\n");
};

export default CsvWriter;
