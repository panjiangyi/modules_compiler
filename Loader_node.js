let fs = require('fs');
/* 
 *  全局对象 module、exports用于导出模块
 *  正则解析require方法，来加载模块
 * })
 */
function packCode(txt, path) {
    if (txt.indexOf('module') > -1) {
        // 有module则添加局部变量module并return
        return `\n/*${path}*/\n(function(){let module = {};\n${txt}\nreturn module;\n})();\n`;
    }
    // 没有module直接用函数包起来。
    return `\n/*${path}*/\n(function(){\n${txt}\n})();\n`;
}

class Module {
    constructor() {
        this.code = `
            let _module = new Object();
            let _exports = _module.exports = new Object();
        `;
    }
    replace(txt, path) {
        let packed = packCode(txt, path);
        if (this.code.indexOf(`require('${path}')`) > -1) {
            this.code = this.code.replace(`require('${path}');`, packed);
        } else {
            this.code += packed;
        }
    }
    // 依赖树
    dpn_tree(path) {
        this.one_by_one(path, this.tree);
    }
    one_by_one(path) {
        let txt = fs.readFileSync(path);
        this.replace(txt, path);
        const reg = /var\s\w+\s?=\s?require\(\s?(['"])([-./\w]+)\1\)[;\n]/gm;
        let exact = '';
        let sub = [];
        while (exact != null) {
            exact = reg.exec(txt);
            if (exact == null) break;
            let reqPath = exact[2];
            sub.push(reqPath);
        }
        // 递归
        sub.forEach(this.one_by_one.bind(this))

    }
    require(path) {
        this.dpn_tree(path);
    }
    print() {
        fs.writeFile('./bundle.js', this.code, (err) => {
            if (err) throw err;
            console.log('The bundle has been saved!');
        });
    }
}
let loader = new Module();
loader.require('./module/a.js');
loader.print();