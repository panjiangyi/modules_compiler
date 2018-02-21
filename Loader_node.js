let fs = require('fs');
/* 
 *  全局对象 module、exports用于导出模块
 *  正则解析require方法，来加载模块
 * })
 */
// 处理相对路径
let cwd = process.cwd().replace(/\\/g, '/') + '/';
function relativePath(cur, rel) {

    function splitSlash(t) {
        return t.split('/');
    }
    // 如果已为绝对路径则不处理
    if (/^[a-zA-Z]:\//g.test(rel)) return rel;
    cur = splitSlash(cur);
    rel = splitSlash(rel);
    let fileName = rel[rel.length - 1];
    let backTimes = rel.lastIndexOf('..') < 0 ? 0 : rel.lastIndexOf('..') - rel.indexOf('..') + 1;
    let realPath;
    if (backTimes > 0) {
        // 要去掉cur多少个目录
        let deep = cur.length - backTimes;
        // 把目标文件名放入cur中
        cur[deep - 1] = fileName;
        // 去掉多余值
        cur.length = deep < 2 ? 2 : deep;
        realPath = cur.join('/');
    } else {
        // 去掉./
        rel.shift();
        // 去掉cur的当前文件名
        cur.pop();
        realPath = cur.concat(rel).join('/');
    }
    return realPath;
}
// 包装代码
function packCode(txt, path) {
    if (txt.indexOf('module') > -1 || txt.indexOf('exports') > -1) {
        // 有module则添加局部变量module并return
        return `\n/*${path}*/\n_exports['${path}'] = (function(){let module =  {},exports=module.exports={};\n${txt};return exports;\n})();\n`;
    }
    return `\n/*${path}*/\n(function(){\n${txt};\nreturn\n})();\n`
}
// 去掉注释
function awayAnnotation(txt) {
    const doubleSlash_reg = /\s*\/\/.*\r\n/gm;
    const slashDot_reg = /\/\*.*(\r\n)?.*\*\//gm
    return txt.toString().replace(doubleSlash_reg, '').replace(slashDot_reg, '');
}
class Module {
    constructor() {
        // 翻译后的代码；
        this.code = '';
        this.recuried = [];
    }
    replace(txt, path) {
        let packed = packCode(txt, path);
        this.code = packed + this.code;
        // console.log(path);
    }
    suffix() {
        // 添加全局对象，并替换require()
        this.code = `let _module = new Object();\nlet _exports = _module.exports = new Object();` + this.code;
        this.code = this.code.replace(/require\(['"](.+)['"]\)/gm, '_exports["$1"]');
    }
    // 依赖树
    dpn_tree(path) {
        this.one_by_one.call(this, path, this.tree);
    }
    one_by_one(path) {
        if (this.recuried.indexOf(path) > -1) {
            // throw '循环依赖！'
            return
        }
        // 已被递归过的;避免循环引用；
        this.recuried.push(path);

        let txt = fs.readFileSync(path);
        const reg = /var\s\w+\s?=\s?require\(\s?(['"])([-./\w]+)\1\)[;\n]/gm;
        // 存放正则提取的依赖
        let exact = [];
        let sub = [];
        // 无注释字符;
        let noSlashTxt = awayAnnotation(txt);
        // 绝对路径
        let absolutePath = relativePath(cwd, path);
        while (exact != null) {
            exact = reg.exec(noSlashTxt);
            if (exact == null) break;
            // 提取路径并处理相对路径
            let reqPath = relativePath(absolutePath, exact[2]);
            // 把文件中相对路径换成绝对路径
            txt = txt.toString().replace(exact[2], reqPath);
            sub.push(reqPath);
        }
        // 包装函数
        this.replace(txt, absolutePath);
        // 递归
        sub.forEach(this.one_by_one.bind(this))
    }
    require(path) {
        this.dpn_tree(path);
        this.suffix();
        this.bundle();
    }
    bundle() {
        fs.writeFile('./bundle.js', this.code, (err) => {
            if (err) throw err;
            console.log('The bundle has been saved!');
        });
    }
}
let loader = new Module();
loader.require('./module/a.js');