import Marketplace from "balanced-dashboard/models/marketplace";

module('Model - Marketplace');

test('#isOrdersRequired', function() {
	var t = function(dateStr, expectedValue) {
		var mp = Marketplace.create({
			created_at: dateStr
		});
		deepEqual(mp.get("isOrdersRequired"), expectedValue, "Date %@ isOrdersRequired".fmt(dateStr));
	};

	t("2014-06-10T02:15:39.415520Z", false);
	t("2014-11-07T00:00:00.000000Z", false);
	t("2014-11-07T00:00:01Z", true);
	t("2014-11-10T02:15:39.415520Z", true);
	t("2014-11-10T02:15:39.415520Z", true);
});
