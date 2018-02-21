let _module = new Object();
let _exports = _module.exports = new Object();
/*c:/workspace/modulesLoader/module/e.js*/
_exports['c:/workspace/modulesLoader/module/e.js'] = (function(){let module =  {},exports=module.exports={};
var d = _exports["c:/workspace/modulesLoader/module/d.js"];
console.log('e的D',d);
exports.say = function(){
    console.log('success!')
}
console.log('e loaded!');return exports;
})();

/*c:/workspace/modulesLoader/module/d.js*/
_exports['c:/workspace/modulesLoader/module/d.js'] = (function(){let module =  {},exports=module.exports={};
var e = _exports["c:/workspace/modulesLoader/module/e.js"];
e.say();
console.log('d loaded!')
module.exports = 'wo shi d';;return exports;
})();

/*c:/workspace/modulesLoader/module/c.js*/
_exports['c:/workspace/modulesLoader/module/c.js'] = (function(){let module =  {},exports=module.exports={};
console.log('c loaded!');
exports = 'jim';;return exports;
})();

/*c:/workspace/modulesLoader/module/b.js*/
_exports['c:/workspace/modulesLoader/module/b.js'] = (function(){let module =  {},exports=module.exports={};
'use strict';
console.log('b loaded');
var c = _exports["c:/workspace/modulesLoader/module/c.js"];
console.log('c of b:',c);return exports;
})();

/*c:/workspace/modulesLoader/module/a.js*/
_exports['c:/workspace/modulesLoader/module/a.js'] = (function(){let module =  {},exports=module.exports={};
   var b = _exports["c:/workspace/modulesLoader/module/b.js"];
var d = _exports["c:/workspace/modulesLoader/module/d.js"];
var e = _exports["c:/workspace/modulesLoader/module/e.js"];
e.say();
console.log('a loaded!');return exports;
})();
