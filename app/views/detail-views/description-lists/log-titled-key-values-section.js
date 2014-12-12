import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

var LogTitledKeyValuesSectionView = TitledKeyValuesSectionView.extend({
	title: "Card information",

	keyValueListViews: ListValueGenerator.create()
		.add("Created at", "created_at")
		.add("Log ID", "id")
		.add("Method", "message.request.method")
		.add("URI", "short_url")
		.add("Category code", "category_code")
		.add("Description", "description")
		.add("IP address", "ip_address")
		.add("User agent", "message.request.headers.User-Agent")
		.toProperty()
});

export default LogTitledKeyValuesSectionView;
