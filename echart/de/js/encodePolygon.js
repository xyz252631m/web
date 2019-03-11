function decode(json) {
    if (!json.UTF8Encoding) {
        return json;
    }

    var features = json.features;
    for (var f = 0; f < features.length; f++) {
        var feature = features[f];
        var geometry = feature.geometry;
        var coordinates = geometry.coordinates;
        var encodeOffsets = geometry.encodeOffsets;
        for (var c = 0; c < coordinates.length; c++) {
            var coordinate = coordinates[c];
            if (geometry.type === 'Polygon') {

                if(Array.isArray(coordinate)){
                    continue;
                }

                coordinates[c] = decodePolygon(
                    coordinate,
                    encodeOffsets[c]
                );
            }
            else if (geometry.type === 'MultiPolygon') {
                for (var c2 = 0; c2 < coordinate.length; c2++) {
                    var polygon = coordinate[c2];
                    coordinate[c2] = decodePolygon(
                        polygon,
                        encodeOffsets[c][c2]
                    );
                }
            }
            
        }
    }
    // Has been decoded
    json.UTF8Encoding = false;
    return json;
}
//解密
function decodePolygon(coordinate, encodeOffsets) {
  var result = [];
  var prevX = encodeOffsets[0];
  var prevY = encodeOffsets[1];

  for (var i = 0; i < coordinate.length; i += 2) {
    var x = coordinate.charCodeAt(i) - 64;
    var y = coordinate.charCodeAt(i + 1) - 64;
    // ZigZag decoding
    x = (x >> 1) ^ (-(x & 1));
    y = (y >> 1) ^ (-(y & 1));
    // Delta deocding
    x += prevX;
    y += prevY;

    prevX = x;
    prevY = y;
    // Dequantize
    result.push([x / 1024, y / 1024]);
  }
  return result;
}
//加密
function encodePolygon(coordinate, encodeOffsets) {
    var result = '';
    var prevX = quantize(coordinate[0][0]);
    var prevY = quantize(coordinate[0][1]);

    encodeOffsets[0] = prevX;
    encodeOffsets[1] = prevY;

    for (var i = 0; i < coordinate.length; i++) {
        var point = coordinate[i];
        result+=encode(point[0], prevX);
        result+=encode(point[1], prevY);

        prevX = quantize(point[0]);
        prevY = quantize(point[1]);
    }
    return result;
}

function quantize(val) {
    return Math.ceil(val * 1024);
}

function encode(val, prev){
    val = quantize(val);
    val = val - prev;

    if (((val << 1) ^ (val >> 15)) + 64 === 8232) {
        val--;
    }
    val = (val << 1) ^ (val >> 15);
    return String.fromCharCode(val+64);
}