
let _module = new Object();
let _exports = _module.exports = new Object();

/*./module/a.js*/
(function () {
    let module = {};
    var b =
        /*./module/b.js*/
        (function () {
            let module = {};
            'use strict';
            console.log('b loaded');
            var c =
                /*./module/c.js*/
                (function () {
                    console.log('c loaded!');
                })();

            return module;
        })();

    var d =
        /*./module/d.js*/
        (function () {
            let module = {};
            var e =
                /*./module/e.js*/
                (function () {
                    let module = {};
                    module.say = function () {
                        console.log('success!')
                    }
                    console.log('e loaded!')
                    return module;
                })();

            e.say();
            console.log('d loaded!')
            module = 'wo shi d';
            return module;
        })();

    console.log('a loaded!')
    return module;
})();
