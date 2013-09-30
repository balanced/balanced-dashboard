(function($) {
	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};
	$.fn.highlightWords = function(words) {
		var TEXT_NODE = 3;

		var $that = $(this);

		function getTextNodesIn(node, includeWhitespaceNodes) {
			var textNodes = [],
				whitespace = /^\s*$/;

			function getTextNodes(node) {
				if (node.nodeType === TEXT_NODE) {
					if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
						textNodes.push(node);
					}
				} else {
					for (var i = 0, len = node.childNodes.length; i < len; ++i) {
						getTextNodes(node.childNodes[i]);
					}
				}
			}

			getTextNodes(node);
			return textNodes;
		}

		function removeHighlights() {
			var tables = $that;

			for (var k = 0; k < tables.length; k++) {
				var nodes = getTextNodesIn(tables[k]);
				for (var i = 0; i < nodes.length; i++) {
					var node = nodes[i];
					var parentNode = node.parentNode;

					if (parentNode.className && parentNode.className.indexOf('highlight') !== -1) {
						// node = "Hello world"
						// parentNode = "<span class="highlight">Hello world</span>"
						// parentNode.parentNode.replaceChild(node, parentNode)
						var gpNode = parentNode.parentNode;
						gpNode.replaceChild(node, parentNode);
					}
				}
			}
		}

		function makeTextNodeContiguous(re, litUp) {
			var $t = $(this);
			var contiguous = [];

			// join separate text nodes into a single continual node.
			// e.g. "j" "ohn" becomes "john"
			// should remove the subsequent nodes and leave only the first
			// node which is replaced with the joined content

			function joinContiguous(contiguous) {
				if (!contiguous.length) {
					return;
				}

				// add them all together
				var condensedValue = $.map(contiguous, function(el) {
					return el.nodeValue;
				});

				// the first element is the one we will replace so get a
				// reference
				var el = contiguous.pop();

				//  remove all the other nodes
				var e;
				while ((e = contiguous.pop())) {
					$t[0].removeChild(e);
				}
				var replacable = condensedValue.join('');
				$t.find(el).replaceWith(replacable.replace(re, litUp));
			}

			// for each direct child node, let's check if it's text. add all
			// those to a collection and then join once we meet a non-text node
			$t.contents().each(function() {
				if (this.nodeType === TEXT_NODE) {
					contiguous.push(this);
				} else {
					joinContiguous(contiguous);
				}
			});
			joinContiguous(contiguous);
		}

		function highlightWord(word) {
			// http://stackoverflow.com/a/6969486/6084 - escape regex chars
			var wordre = word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
			var re = new RegExp('(' + wordre + ')', 'gi');
			var litUp = '<span class="highlight">$1</span>';
			$(':icontains(' + word + ')', $that).not('.highlight').each(function() {
				makeTextNodeContiguous.call(this, re, litUp);
			});
		}

		words = $.map(words.split(' '), function(word) {
			return (word) ? word : null;
		});

		removeHighlights();

		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			highlightWord(word);
		}

	};
})(jQuery);

// http://css-tricks.com/snippets/jquery/make-jquery-contains-case-insensitive/
$.expr[":"].icontains = $.expr.createPseudo(function(arg) {
	return function(elem) {
		return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
	};
});
