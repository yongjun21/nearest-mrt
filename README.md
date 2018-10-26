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

const target = [103.736083, 1.341832]

/**
 * @param lnglat - coordinates of query location (required)
 * @param excludeFuture - whether to exclude future stations ({boolean}, default false)
 * @param radius - limit radius of search in meters ({numeric}, default 1000)
 */
const nearestMRT = getNearestMrt(target, false, 2000)
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
        "longitude": 103.7327666,
        "latitude": 1.3422449,
        "x": 16809.69,
        "y": 36044.45,
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
        "interchange": 0,
        "locations": [
          {
            "platform": "EW25",
            "longitude": 103.7327663,
            "latitude": 1.3422443,
            "x": 16809.65,
            "y": 36044.37
          }
        ]
      },
      "distance": 372
    },
    {
      "rank": 2,
      "station": {
        "name": "JURONG EAST",
        "code": "NS1 EW24 JE5",
        "longitude": 103.7421539,
        "latitude": 1.3332951,
        "x": 17854.36,
        "y": 35054.77,
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
        "interchange": 1,
        "locations": [
          {
            "platform": "NS1",
            "longitude": 103.7422651,
            "latitude": 1.3330741,
            "x": 17866.73,
            "y": 35030.34
          },
          {
            "platform": "EW24",
            "longitude": 103.7422651,
            "latitude": 1.3330741,
            "x": 17866.73,
            "y": 35030.34
          }
        ],
        "exchanges": [
          {
            "from": "NSL",
            "to": "EWL",
            "distance": 0
          },
          {
            "from": "EWL",
            "to": "NSL",
            "distance": 0
          }
        ]
      },
      "distance": 1161
    },
    {
      "rank": 3,
      "station": {
        "name": "BUKIT BATOK",
        "code": "NS2",
        "longitude": 103.7495558,
        "latitude": 1.348992,
        "x": 18678.17,
        "y": 36790.44,
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
        "interchange": 0,
        "locations": [
          {
            "platform": "NS2",
            "longitude": 103.7495554,
            "latitude": 1.3489914,
            "x": 18678.13,
            "y": 36790.36
          }
        ]
      },
      "distance": 1695
    },
    {
      "rank": 4,
      "station": {
        "name": "LAKESIDE",
        "code": "EW26",
        "longitude": 103.7209246,
        "latitude": 1.3442249,
        "x": 15491.81,
        "y": 36263.44,
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
        "interchange": 0,
        "locations": [
          {
            "platform": "EW26",
            "longitude": 103.7209243,
            "latitude": 1.3442242,
            "x": 15491.77,
            "y": 36263.36
          }
        ]
      },
      "distance": 1708
    }
  ],
  "accurateAsOf": 1539273600000
}
```

### If you prefer a CSV output
```javascript
const nearestMRT = getNearestMrt(target, false, 2000)
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
