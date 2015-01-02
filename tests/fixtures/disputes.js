export default [{
	"uri": "/disputes?limit=50&sort=initiated_at%2Cdesc&created_at%5B%3E%5D=2013-08-01T00%3A00%3A00.000Z&created_at%5B%3C%5D=2013-08-01T23%3A59%3A59.999Z",
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
			"transaction": "WD2e4R5qiBO754zsgNg0xizv"
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
		"uri": "/disputes/DT2i1GU1dayFu9xx9VA5cB5p"
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
}, {
	"uri": "/disputes/disputes/documents"
}, {
	"uri": "/disputes/DT2i1GU1dayFu9xx9VA5cB5p/documents"
}, {
	"uri": "/disputes?limit=50&sort=initiated_at%2Cdesc"
}, {
	"uri": "/disputes?limit=100&sort=initiated_at%2Cdesc&status=pending"
}, {
	"uri": "/disputes?limit=50&offset=0&q=&sort=initiated_at%2Cdesc&type=dispute"
}, {
	"uri": "/logs?limit=5&sort=created_at%2Cdesc&method%5Bin%5D=post%2Cput%2Cdelete&resource_id=DT2xOc7zAdgufK4XsCIW5QgD"
}, {
	"uri": "/disputes/DT2xOc7zAdgufK4XsCIW5QgD",
	"meta": {},
	"disputes": [{
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
		"initiated_at": "2014-06-16T23:09:37.214301Z"
	}],
	"links": {
		"disputes.events": "/disputes/{disputes.id}/events",
		"disputes.transaction": "/resources/{disputes.transaction}"
	}
}, {
	"uri": "/logs?limit=5&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&resource_id=DT2xOc7zAdgufK4XsCIW5QgD&sort=created_at%2Cdesc"
}, {
	"uri": "/disputes/DT2xOc7zAdgufK4XsCIW5QgD/events"
}, {
	"uri": "/disputes/DT2xOc7zAdgufK4XsCIW5QgD/documents"
}, {
	"uri": "/logs?limit=5&method%5Bin%5D=post%2Cput%2Cdelete&offset=0&q=&resource_id=undefined&sort=created_at%2Cdesc"
}, {
	"uri": "/logs?limit=5&sort=created_at%2Cdesc&offset=0&method%5Bin%5D=post%2Cput%2Cdelete&resource_id=DT2xOc7zAdgufK4XsCIW5QgD"
}, {
	"uri": "/logs?limit=5&sort=created_at%2Cdesc&offset=0&method%5Bin%5D=post%2Cput%2Cdelete"
}, {
	"uri": "/resources/WD2e4R5qiBO754zsgNg0xizv",
	"debits": [{
		"status": "succeeded",
		"description": null,
		"links": {
			"customer": null,
			"source": "CC2cYQO0cT7yGPFsiUCQ0b11",
			"order": null,
			"dispute": "DT2xOc7zAdgufK4XsCIW5QgD"
		},
		"updated_at": "2014-06-16T23:09:37.401056Z",
		"created_at": "2014-06-16T23:09:36.716724Z",
		"transaction_number": "W380-148-4883",
		"failure_reason": null,
		"currency": "USD",
		"amount": 1200,
		"failure_reason_code": null,
		"meta": {},
		"href": "/debits/WD2e4R5qiBO754zsgNg0xizv",
		"appears_on_statement_as": "BAL*dispute test",
		"id": "WD2e4R5qiBO754zsgNg0xizv"
	}],
	"links": {
		"debits.customer": "/customers/{debits.customer}",
		"debits.dispute": "/disputes/{debits.dispute}",
		"debits.source": "/resources/{debits.source}",
		"debits.order": "/orders/{debits.order}",
		"debits.refunds": "/debits/{debits.id}/refunds",
		"debits.events": "/debits/{debits.id}/events"
	}
}];
