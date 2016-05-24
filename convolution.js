(function (ns) {

    'use strict';

    /**
     *  Convolution
     *
     *  @param {CanvasImageData} src
     *  @param {CanvasImageData} dst
     *  @param {Array} kernel
     */
    function convolution(src, dst, kernel) {
        var len = kernel.length;
        var sq  = Math.sqrt(len);
        var d   = (sq - 1);
        var width  = src.width;
        var height = src.height;
        var weight = (function () {
            var w = 0;
            for (var i = 0; i < kernel.length; i++) {
                w += kernel[i];
            }
            return w;
        }());
        
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var x = j + 1;
                var y = i + 1;

                var color = [0, 0, 0, 254];

                for (var k = 0; k < len; k++) {
                    var kx = ((k % sq) + 1) - d;
                    var ky = (((k / sq) | 0) + 1) - d;
                    var _x = x + kx;
                    var _y = y + ky;
                    var pixel = getPixel(src, _x, _y);
                    var bias  = kernel[k];// / weight;
                    color[0] += pixel[0] * bias;
                    color[1] += pixel[1] * bias;
                    color[2] += pixel[2] * bias;
                    // TODO: あとでα値の扱いを見直す
                    // color[3] += pixel[3] * bias;
                }

                if (color[0] > 254) {
                    color[0] = 254;
                }
                else if (color[0] < 0) {
                    color[0] = 0;
                }

                if (color[1] > 254) {
                    color[1] = 254;
                }
                else if (color[1] < 0) {
                    color[1] = 0;
                }

                if (color[2] > 254) {
                    color[2] = 254;
                }
                else if (color[2] < 0) {
                    color[2] = 0;
                }

                // TODO: あとでα値の扱いを見直す
                // if (color[3] > 254) {
                //     color[3] = 254;
                // }
                // else if (color[3] < 0) {
                //     color[3] = 0;
                // }

                putPixel(dst, x, y, color);
            }
        }
    }

    /**
     *  Get pixel at `x, y`
     *
     *  @param {CanvasImageData} imageData
     *  @param {number} x
     *  @param {number} y
     *
     *  @return {Array}
     */
    function getPixel(imageData, x, y) {
        var width  = imageData.width;
        var height = imageData.height;
        var data   = imageData.data;

        var _x = x - 1;
        var _y = y - 1;

        if (_x < 0) {
            _x = 0;
        }
        else if (_x > width - 1) {
            _x = width - 1;
        }

        if (_y < 0) {
            _y = 0;
        }
        else if (_y > height - 1) {
            _y = height - 1;
        }

        var pos = (_x + (_y * width)) * 4;
        return [
            data[pos + 0],
            data[pos + 1],
            data[pos + 2],
            data[pos + 3]
        ];
    }

    /**
     *  Put pixel at `x, y`
     *
     *  @param {CanvasImageData} imageData
     *  @param {number} x
     *  @param {number} y
     *  @param {Array.<number>} color
     */
    function putPixel(imageData, x, y, color) {
        var width  = imageData.width;
        var height = imageData.height;
        var data   = imageData.data;

        var _x = x - 1;
        var _y = y - 1;

        if (_x < 0) {
            _x = 0;
        }
        else if (_x > width - 1) {
            _x = width - 1;
        }

        if (_y < 0) {
            _y = 0;
        }
        else if (_y > height - 1) {
            _y = height - 1;
        }

        var pos = (_x + (_y * width)) * 4;
        data[pos + 0] = color[0];
        data[pos + 1] = color[1];
        data[pos + 2] = color[2];
        data[pos + 3] = color[3];
    }

    /*! ------------------------------------------------------
        EXPORTS.
    ---------------------------------------------------------- */
    ns.convolution = convolution;

}(window));
