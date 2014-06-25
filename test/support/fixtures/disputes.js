Balanced.Adapter.addFixtures([{
	"meta": {
		"last": "/disputes?sort=initiated_at%2Cdesc&offset=0&q=&limit=50&created_at%5B%3C%5D=2014-06-26T00%3A00%3A00.000Z&type=dispute&created_at%5B%3E%5D=2014-01-22T23%3A00%3A24.645Z",
		"next": null,
		"href": "/disputes?sort=initiated_at%2Cdesc&offset=0&q=&limit=50&created_at%5B%3C%5D=2014-06-26T00%3A00%3A00.000Z&type=dispute&created_at%5B%3E%5D=2014-01-22T23%3A00%3A24.645Z",
		"limit": 50,
		"offset": 0,
		"previous": null,
		"total": 2,
		"first": "/disputes?sort=initiated_at%2Cdesc&offset=0&q=&limit=50&created_at%5B%3C%5D=2014-06-26T00%3A00%3A00.000Z&type=dispute&created_at%5B%3E%5D=2014-01-22T23%3A00%3A24.645Z"
	},
	"links": {
		"disputes.events": "/disputes/{disputes.id}/events",
		"disputes.transaction": "/resources/{disputes.transaction}"
	},
	"disputes": [{
		"status": "pending",
		"links": {
			"transaction": "WD25YaEwlEeYDXPmUmUEslAp"
		},
		"respond_by": "2014-07-25T18:48:17.213582Z",
		"updated_at": "2014-06-25T18:48:27.435284Z",
		"created_at": "2014-06-25T18:48:27.435275Z",
		"reason": "fraud",
		"id": "DT2i1GU1dayFu9xx9VA5cB5p",
		"currency": "USD",
		"amount": 200,
		"meta": {},
		"href": "/disputes/DT2i1GU1dayFu9xx9VA5cB5p",
		"initiated_at": "2014-06-25T18:48:17.213579Z",
		"uri": "/disputes/DT2xOc7zAdgufK4XsCIW5QgD"
	}, {
		"status": "pending",
		"links": {
			"transaction": "WD2e4R5qiBO754zsgNg0xizv"
		},
		"respond_by": "2014-07-16T23:09:37.214304Z",
		"updated_at": "2014-06-16T23:09:54.287539Z",
		"created_at": "2014-06-16T23:09:54.287535Z",
		"reason": "fraud",
		"id": "DT2xOc7zAdgufK4XsCIW5QgD",
		"currency": "USD",
		"amount": 1200,
		"meta": {},
		"href": "/disputes/DT2xOc7zAdgufK4XsCIW5QgD",
		"initiated_at": "2014-06-16T23:09:37.214301Z",
		"uri": "/disputes/DT2xOc7zAdgufK4XsCIW5QgD"
	}]
}]);
