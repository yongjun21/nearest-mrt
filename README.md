# nearest-mrt

A helper function for geospatial feature engineering.
To find the nearest MRT station given a location's longitude & latitude.

Credits *Singapore Land Authority (SLA)* [OneMap API service](https://docs.onemap.sg) for location data.

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
console.log(nearestMRT)
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
				"name": "TAMPINES MRT STATION",
				"code": [
					"EW2",
					"DT32(Future)"
				],
				"line": {
					"EWL": 1,
					"NSL": 0,
					"NEL": 0,
					"CCL": 0,
					"DTL": 2,
					"TEL": 0
				},
				"operational": 1,
				"interchange": 2
			},
			"distance": 278,
			"address": {
				"x": 40444.9965695,
				"y": 37266.9972092,
				"longitude": 103.945144797,
				"latitude": 1.35330141358
			}
		},
		{
			"rank": 2,
			"station": {
				"name": "TAMPINES WEST MRT STATION",
				"code": [
					"DT31(Future)"
				],
				"line": {
					"EWL": 0,
					"NSL": 0,
					"NEL": 0,
					"CCL": 0,
					"DTL": 2,
					"TEL": 0
				},
				"operational": 2,
				"interchange": 0
			},
			"distance": 1084,
			"address": {
				"x": 39698.5275853,
				"y": 36406.0143331,
				"longitude": 103.938436971,
				"latitude": 1.3455153056
			}
		},
		{
			"rank": 3,
			"station": {
				"name": "TAMPINES EAST MRT STATION",
				"code": [
					"DT33(Future)"
				],
				"line": {
					"EWL": 0,
					"NSL": 0,
					"NEL": 0,
					"CCL": 0,
					"DTL": 2,
					"TEL": 0
				},
				"operational": 2,
				"interchange": 0
			},
			"distance": 1330,
			"address": {
				"x": 41501.0748522,
				"y": 37586.6177644,
				"longitude": 103.954634462,
				"latitude": 1.35619148272
			}
		},
		{
			"rank": 4,
			"station": {
				"name": "SIMEI MRT STATION",
				"code": [
					"EW3"
				],
				"line": {
					"EWL": 1,
					"NSL": 0,
					"NEL": 0,
					"CCL": 0,
					"DTL": 0,
					"TEL": 0
				},
				"operational": 1,
				"interchange": 0
			},
			"distance": 1694,
			"address": {
				"x": 41360.6137918,
				"y": 36150.3958835,
				"longitude": 103.953371694,
				"latitude": 1.34320289478
			}
		}
	],
	"accurateAsOf": 1480435200000
}
```

### If you prefer a CSV output
```javascript
var nearestMRT = getNearestMrt(target, false, 2000)
console.log(nearestMRT.toFlatObjects())
console.log(nearestMRT.toTable())
console.log(nearestMRT.toCSV())
```
Flat object output:

```json
[
	{
		"rank": 1,
		"station.name": "TAMPINES MRT STATION",
		"station.code": "EW2 DT32(Future)",
		"station.line.EWL": 1,
		"station.line.NSL": 0,
		"station.line.NEL": 0,
		"station.line.CCL": 0,
		"station.line.DTL": 2,
		"station.line.TEL": 0,
		"station.operational": 1,
		"station.interchange": 2,
		"distance": 278,
		"address.x": 40444.9965695,
		"address.y": 37266.9972092,
		"address.longitude": 103.945144797,
		"address.latitude": 1.35330141358
	},
	{
		"rank": 2,
		"station.name": "TAMPINES WEST MRT STATION",
		"station.code": "DT31(Future)",
		"station.line.EWL": 0,
		"station.line.NSL": 0,
		"station.line.NEL": 0,
		"station.line.CCL": 0,
		"station.line.DTL": 2,
		"station.line.TEL": 0,
		"station.operational": 2,
		"station.interchange": 0,
		"distance": 1084,
		"address.x": 39698.5275853,
		"address.y": 36406.0143331,
		"address.longitude": 103.938436971,
		"address.latitude": 1.3455153056
	},
	{
		"rank": 3,
		"station.name": "TAMPINES EAST MRT STATION",
		"station.code": "DT33(Future)",
		"station.line.EWL": 0,
		"station.line.NSL": 0,
		"station.line.NEL": 0,
		"station.line.CCL": 0,
		"station.line.DTL": 2,
		"station.line.TEL": 0,
		"station.operational": 2,
		"station.interchange": 0,
		"distance": 1330,
		"address.x": 41501.0748522,
		"address.y": 37586.6177644,
		"address.longitude": 103.954634462,
		"address.latitude": 1.35619148272
	},
	{
		"rank": 4,
		"station.name": "SIMEI MRT STATION",
		"station.code": "EW3",
		"station.line.EWL": 1,
		"station.line.NSL": 0,
		"station.line.NEL": 0,
		"station.line.CCL": 0,
		"station.line.DTL": 0,
		"station.line.TEL": 0,
		"station.operational": 1,
		"station.interchange": 0,
		"distance": 1694,
		"address.x": 41360.6137918,
		"address.y": 36150.3958835,
		"address.longitude": 103.953371694,
		"address.latitude": 1.34320289478
	}
]
```

### Interpreting output
- 0 - False
- 1 - True
- 2 - Will be true in future (Planned but under construction)

### How to make sure MRT stations data is always updated? [To be added]
