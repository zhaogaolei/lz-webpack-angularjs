/**
 * Created by chengshuailiu on 17/4/8.
 */

var CountUp = function(target, startVal, endVal, decimals, duration, options) {

    // make sure requestAnimationFrame and cancelAnimationFrame are defined
    // polyfill for browsers without native support
    // by Opera engineer Erik Möller
    var lastTime = 0;
    var vendors = ['webkit', 'moz', 'ms', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

    var self = this;
    self.version = function () { return '1.8.3'; };

    function formatNumber(num) {
        num = num.toFixed(self.decimals);
        num += '';
        var x, x1, x2, rgx;
        x = num.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? self.options.decimal + x[1] : '';
        rgx = /(\d+)(\d{3})/;
        if (self.options.useGrouping) {
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + self.options.separator + '$2');
            }
        }
        return self.options.prefix + x1 + x2 + self.options.suffix;
    }
    // Robert Penner's easeOutExpo
    function easeOutExpo(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    }
    function ensureNumber(n) {
        return (typeof n === 'number' && !isNaN(n));
    }

    // default options
    self.options = {
        useEasing: true, // toggle easing
        useGrouping: true, // 1,000,000 vs 1000000
        separator: ',', // character to use as a separator
        decimal: '.', // character to use as a decimal
        easingFn: easeOutExpo, // optional custom easing function, default is Robert Penner's easeOutExpo
        formattingFn: formatNumber, // optional custom formatting function, default is formatNumber above
        prefix: '', // optional text before the result
        suffix: '' // optional text after the result
    };

    // extend default options with passed options object
    if (options && typeof options === 'object') {
        for (var key in self.options) {
            if (options.hasOwnProperty(key) && options[key]) {
                self.options[key] = options[key];
            }
        }
    }

    if (self.options.separator === '') self.options.useGrouping = false;

    self.initialize = function() {
        if (self.initialized) return true;
        self.d = (typeof target === 'string') ? document.getElementById(target) : target;
        if (!self.d) {
            console.error('[CountUp] target is null or undefined', self.d);
            return false;
        }
        self.startVal = Number(startVal);
        self.endVal = Number(endVal);
        // error checks
        if (ensureNumber(self.startVal) && ensureNumber(self.endVal)) {
            self.decimals = Math.max(0, decimals || 0);
            self.dec = Math.pow(10, self.decimals);
            self.duration = Number(duration) * 1000 || 2000;
            self.countDown = (self.startVal > self.endVal);
            self.frameVal = self.startVal;
            self.initialized = true;
            return true;
        }
        else {
            console.error('[CountUp] startVal or endVal is not a number', self.startVal, self.endVal);
            return false;
        }
    };

    // Print value to target
    self.printValue = function(value) {
        var result = self.options.formattingFn(value);

        if (self.d.tagName === 'INPUT') {
            this.d.value = result;
        }
        else if (self.d.tagName === 'text' || self.d.tagName === 'tspan') {
            this.d.textContent = result;
        }
        else {
            this.d.innerHTML = result;
        }
    };

    self.count = function(timestamp) {

        if (!self.startTime) { self.startTime = timestamp; }

        self.timestamp = timestamp;
        var progress = timestamp - self.startTime;
        self.remaining = self.duration - progress;

        // to ease or not to ease
        if (self.options.useEasing) {
            if (self.countDown) {
                self.frameVal = self.startVal - self.options.easingFn(progress, 0, self.startVal - self.endVal, self.duration);
            } else {
                self.frameVal = self.options.easingFn(progress, self.startVal, self.endVal - self.startVal, self.duration);
            }
        } else {
            if (self.countDown) {
                self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
            } else {
                self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
            }
        }

        // don't go past endVal since progress can exceed duration in the last frame
        if (self.countDown) {
            self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
        } else {
            self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
        }

        // decimal
        self.frameVal = Math.round(self.frameVal*self.dec)/self.dec;

        // format and print value
        self.printValue(self.frameVal);

        // whether to continue
        if (progress < self.duration) {
            self.rAF = requestAnimationFrame(self.count);
        } else {
            if (self.callback) self.callback();
        }
    };
    // start your animation
    self.start = function(callback) {
        if (!self.initialize()) return;
        self.callback = callback;
        self.rAF = requestAnimationFrame(self.count);
    };
    // toggles pause/resume animation
    self.pauseResume = function() {
        if (!self.paused) {
            self.paused = true;
            cancelAnimationFrame(self.rAF);
        } else {
            self.paused = false;
            delete self.startTime;
            self.duration = self.remaining;
            self.startVal = self.frameVal;
            requestAnimationFrame(self.count);
        }
    };
    // reset to startVal so animation can be run again
    self.reset = function() {
        self.paused = false;
        delete self.startTime;
        self.initialized = false;
        if (self.initialize()) {
            cancelAnimationFrame(self.rAF);
            self.printValue(self.startVal);
        }
    };
    // pass a new endVal and start animation
    self.update = function (newEndVal) {
        if (!self.initialize()) return;
        cancelAnimationFrame(self.rAF);
        self.paused = false;
        delete self.startTime;
        self.startVal = self.frameVal;
        self.endVal = Number(newEndVal);
        if (ensureNumber(self.endVal)) {
            self.countDown = (self.startVal > self.endVal);
            self.rAF = requestAnimationFrame(self.count);
        } else {
            console.error('[CountUp] update() - new endVal is not a number', newEndVal);
        }
    };

    // format startVal on initialization
    if (self.initialize()) self.printValue(self.startVal);
};

angular.module('directives')

.directive('countUp', ['$filter', function ($filter) {
    return {
        restrict: 'A',
        scope: {
            startVal: '=?',
            endVal: '=?',
            duration: '=?',
            decimals: '=?',
            reanimateOnClick: '=?',
            filter: '@',
            options: '=?'
        },
        link: function ($scope, $el, $attrs) {
            var options = {};

            if ($scope.filter) {
                var filterFunction = createFilterFunction();
                options.formattingFn = filterFunction;
            }

            if ($scope.options) {
                angular.extend(options, $scope.options);
            }

            var countUp = createCountUp($scope.startVal, $scope.endVal, $scope.decimals, $scope.duration);
            
            function createFilterFunction() {
                var filterParams = $scope.filter.split(':');
                var filterName = filterParams.shift();

                return function (value) {
                    var filterCallParams = [value];
                    Array.prototype.push.apply(filterCallParams, filterParams);
                    value = $filter(filterName).apply(null, filterCallParams);
                    return value;
                };
            }

            function createCountUp(sta, end, dec, dur) {
                sta = sta || 0;
                if (isNaN(sta)) sta = Number(sta.match(/[\d\-\.]+/g).join('')); // strip non-numerical characters
                end = end || 0;
                if (isNaN(end)) end = Number(end.match(/[\d\-\.]+/g).join('')); // strip non-numerical characters
                dur = Number(dur) || 2;
                dec = Number(dec) || 0;

                // construct countUp
                var countUp = new CountUp($el[0], sta, end, dec, dur, options);
                if (end > 999) {
                    // make easing smoother for large numbers
                    countUp = new CountUp($el[0], sta, end - 100, dec, dur / 2, options);
                }

                return countUp;
            }

            function animate() {
                countUp.reset();
                if ($scope.endVal > 999) {
                    countUp.start(function () {
                        countUp.update($scope.endVal);
                    });
                }
                else {
                    countUp.start();
                }
            }

            // fire on scroll-spy event, or right away
            if ($attrs.scrollSpyEvent) {
                // listen for scroll spy event
                $scope.$on($attrs.scrollSpyEvent, function (event, data) {
                    if (data === $attrs.id) {
                        animate();
                    }
                });
            }
            else {
                animate();
            }

            // re-animate on click
            var reanimateOnClick = angular.isDefined($scope.reanimateOnClick) ? $scope.reanimateOnClick : false;
            if (reanimateOnClick) {
                $el.on('click', function () {
                    animate();
                });
            }

            $scope.$watch('endVal', function (newValue, oldValue) {
                if (newValue === null || newValue === oldValue) {
                    return;
                }

                if (countUp !== null) {
                    countUp.update($scope.endVal);
                } else {
                    countUp = createCountUp($scope.startVal, $scope.endVal, $scope.decimals, $scope.duration);
                    animate();
                }
            });
        }
    };
}])

