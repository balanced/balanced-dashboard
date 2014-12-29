export default [{
	"uri": "https://auth.balancedpayments.com",
	"csrf": "CSRF-XXXXXXXXXXXXXXXXXXXXXXXXXX"
}, {
	"user_id" : "USeb4a5d6ca6ed11e2bea6026ba7db2987",
	"email_address" : "foo@bar.com",
	"status" : "OTP_REQUIRED",
	"user_uri" : "/users/USeb4a5d6ca6ed11e2bea6026ba7db2987",
	"uri" : "https://auth.balancedpayments.com/logins/current",
	"password" : null,
	"created_at" : "2000-01-01T01:00:00Z",
	"user" : {
		"id": "USeb4a5d6ca6ed11e2bea6026ba7db2987",
		"password": null,
		"marketplaces_uri": "http://auth.balancedpayments.com/users/USeb4a5d6ca6ed11e2bea6026ba7db2987/marketplaces",
		"api_keys_uri": "http://auth.balancedpayments.com/users/USeb4a5d6ca6ed11e2bea6026ba7db2987/api_keys",
		"uri": "/users/USeb4a5d6ca6ed11e2bea6026ba7db2987",
		"email_address": "foo@bar.com",
		"otp_enabled": false,
		"marketplaces": [{
			"id": "MP5m04ORxNlNDm1bB7nkcgSY",
			"uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
			"_type": "marketplace",
			"name": "Nick's Test Marketplace"
		}, {
			"id": "TEST-MP3",
			"uri": "/v1/marketplaces/TEST-MP3",
			"_type": "marketplace",
			"name": "Third Marketplace"
		}, {
			"id": "FIXTURED-MP4cOZZqeAelhxXQzljLLtgl",
			"uri": "/marketplaces/FIXTURED-MP4cOZZqeAelhxXQzljLLtgl",
			"_type": "marketplace",
			"name": "Real Marketplace"
		}]
	}
}, {
	"id": "USeb4a5d6ca6ed11e2bea6026ba7db2987",
	"uri": "/users/USeb4a5d6ca6ed11e2bea6026ba7db2987",
	"password": "sha1$7o8NOGjW$ad156ba4ca3ea0ae25b3e41ae48a6a91fe72aaae",
	"marketplaces_uri": "http://auth.balancedpayments.com/users/USeb4a5d6ca6ed11e2bea6026ba7db2987/marketplaces",
	"api_keys_uri": "http://auth.balancedpayments.com/users/USeb4a5d6ca6ed11e2bea6026ba7db2987/api_keys",
	"email_address": "foo@bar.com",
	"otp_enabled": false,
	"marketplaces": [{
		"id": "MP5m04ORxNlNDm1bB7nkcgSY",
		"uri": "/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY",
		"_type": "marketplace",
		"name": "Nick's Test Marketplace"
	}, {
		"id": "TEST-MP3",
		"uri": "/v1/marketplaces/TEST-MP3",
		"_type": "marketplace",
		"name": "Third Marketplace"
	}, {
		"id": "FIXTURED-MP4cOZZqeAelhxXQzljLLtgl",
		"uri": "/marketplaces/FIXTURED-MP4cOZZqeAelhxXQzljLLtgl",
		"_type": "marketplace",
		"name": "Real Marketplace"
	}]
}];
