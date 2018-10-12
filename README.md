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

var target = [103.736083, 1.341832]

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
      103.736083,
      1.341832
    ],
    "excludeFuture": false,
    "radius": 2000
  },
  "result": [
    {
      "rank": 1,
      "station": {
        "name": "CHINESE GARDEN",
        "code": "EW25",
        "longitude": 103.7324762421645,
        "latitude": 1.3422823547445326,
        "x": 16777.3363717552,
        "y": 36048.51065699755,
        "line": {
          "NSL": 0,
          "EWL": 1,
          "CGL": 0,
          "NEL": 0,
          "CCL": 0,
          "DTL": 0,
          "TEL": 0,
          "JRL": 0
        },
        "operational": 1,
        "interchange": 0
      },
      "distance": 381
    },
    {
      "rank": 2,
      "station": {
        "name": "JURONG EAST",
        "code": "NS1 EW24 JE5",
        "longitude": 103.7423421452522,
        "latitude": 1.333204265938424,
        "x": 17875.268665437758,
        "y": 35044.65773708412,
        "line": {
          "NSL": 1,
          "EWL": 1,
          "CGL": 0,
          "NEL": 0,
          "CCL": 0,
          "DTL": 0,
          "TEL": 0,
          "JRL": 2
        },
        "operational": 1,
        "interchange": 1
      },
      "distance": 1070
    },
    {
      "rank": 3,
      "station": {
        "name": "LAKESIDE",
        "code": "EW26",
        "longitude": 103.72104178838626,
        "latitude": 1.344156130602595,
        "x": 15504.813046554602,
        "y": 36255.759060163546,
        "line": {
          "NSL": 0,
          "EWL": 1,
          "CGL": 0,
          "NEL": 0,
          "CCL": 0,
          "DTL": 0,
          "TEL": 0,
          "JRL": 0
        },
        "operational": 1,
        "interchange": 0
      },
      "distance": 1622
    },
    {
      "rank": 4,
      "station": {
        "name": "BUKIT BATOK",
        "code": "NS2",
        "longitude": 103.74967972589062,
        "latitude": 1.3491784477332078,
        "x": 18691.92607099394,
        "y": 36810.9739732202,
        "line": {
          "NSL": 1,
          "EWL": 0,
          "CGL": 0,
          "NEL": 0,
          "CCL": 0,
          "DTL": 0,
          "TEL": 0,
          "JRL": 0
        },
        "operational": 1,
        "interchange": 0
      },
      "distance": 1624
    }
  ],
  "accurateAsOf": 1539273600000
}
```

### If you prefer a CSV output
```javascript
var nearestMRT = getNearestMrt(target, false, 2000)
console.log(nearestMRT.toFlatObjects())
console.log(nearestMRT.toTable())
console.log(nearestMRT.toCSV())
```
[Sample](./data/sample.json) flat object output: 

[Sample](./data/sample.csv) CSV output

### Interpreting output
- 0 - False
- 1 - True
- 2 - Will be true in future (Planned but under construction)
