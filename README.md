# nearest-mrt

A helper function for geospatial feature engineering.
To find the nearest MRT station given a location longitude and latitude

### To use
```bash
npm install --save nearest-mrt
```

```javascript
import getNearestMrt from 'nearest-mrt'

var target = [103.9428355, 1.3542633]

/**
 * @param lnglat - coordinates of query location (required)
 * @param excludeFuture - whether to exclude future stations ({boolean}, default false)
 * @param radius - limit radius of search in meters ({numeric}, default 1000)
 */
var nearestMRT = getNearestMrt(target, false, 2000)
```

### Sample output
```json
{
	"query": {
		"lnglat": [
			103.9428355,
			1.3542633
		],
		"excludeFuture": false,
		"radius": 2000
	},
	"result": [
		{
			"rank": 1,
			"station": {
				"STATION_NAME": "TAMPINES MRT STATION",
				"STATION_CODE": [
					"EW2",
					"DT32 (Future)"
				],
				"LINE": {
					"EWL": 1,
					"NSL": 0,
					"NEL": 0,
					"CCL": 0,
					"DTL": 2,
					"TEL": 0
				},
				"OPERATIONAL": 1,
				"INTERCHANGE": 2
			},
			"distance": 278
		},
		{
			"rank": 2,
			"station": {
				"STATION_NAME": "TAMPINES WEST MRT STATION",
				"STATION_CODE": [
					"DT31 (Future)"
				],
				"LINE": {
					"EWL": 0,
					"NSL": 0,
					"NEL": 0,
					"CCL": 0,
					"DTL": 2,
					"TEL": 0
				},
				"OPERATIONAL": 2,
				"INTERCHANGE": 0
			},
			"distance": 1084
		},
		{
			"rank": 3,
			"station": {
				"STATION_NAME": "TAMPINES EAST MRT STATION",
				"STATION_CODE": [
					"DT33 (Future)"
				],
				"LINE": {
					"EWL": 0,
					"NSL": 0,
					"NEL": 0,
					"CCL": 0,
					"DTL": 2,
					"TEL": 0
				},
				"OPERATIONAL": 2,
				"INTERCHANGE": 0
			},
			"distance": 1330
		},
		{
			"rank": 4,
			"station": {
				"STATION_NAME": "SIMEI MRT STATION",
				"STATION_CODE": [
					"EW3"
				],
				"LINE": {
					"EWL": 1,
					"NSL": 0,
					"NEL": 0,
					"CCL": 0,
					"DTL": 0,
					"TEL": 0
				},
				"OPERATIONAL": 1,
				"INTERCHANGE": 0
			},
			"distance": 1694
		}
	],
	"accurateAsOf": 1480435200000
}
```

### Interpreting output
- 0 - False
- 1 - True
- 2 - Will be True sometime in future

### How to make sure MRT stations data is always updated? [To be added]
