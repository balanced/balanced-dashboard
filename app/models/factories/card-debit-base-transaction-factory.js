import TransactionFactory from "./transaction-factory";
import Card from "../card";
import Debit from "../debit";

var CardDebitBaseTransactionFactory = TransactionFactory.extend({
	save: function() {
		var self = this;
		var card = Card.create(this.getDestinationAttributes());
		return card.tokenizeAndCreate().then(function(card) {
			var debitAttributes = _.extend(self.getDebitAttributes(), {
				uri: card.get('debits_uri'),
				source_uri: card.get('uri')
			});

			return Debit.create(debitAttributes).save();
		});
	}
});

export default CardDebitBaseTransactionFactory;
