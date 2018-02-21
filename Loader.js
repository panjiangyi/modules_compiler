/* 
 *  全局对象 module、exports用于导出模块
 *  正则解析require方法，来加载模块
 * })
 */
(function (w, d) {
    function packCode(txt, path) {
        if (txt.indexOf('module') > -1) {
            return `\n/*${path}*/\n(function(){let module = {};\n${txt}\nreturn module;\n})();\n`
        }
        return `\n/*${path}*/\n(function(){\n${txt}\n})();\n`
    }

    class Module {
        constructor() {

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
            this.tree = {};
            this.code = '';
            this.recuried = [];
            this.one_by_one(path, this.tree);
        }
        one_by_one(path, tree) {
            if (this.recuried.indexOf(path) > -1) {
                return
            }
            // 已被递归过的;
            this.recuried.push(path)
            let subTree = tree[path] = {};
            fetch(path)
                .then(respone => {
                    respone.text()
                        .then(txt => {
                            this.replace(txt, path);
                            const reg = /var\s\w+\s?=\s?require\(\s?(['"])([-./\w]+)\1\)[;\n]/gm;
                            let exact = '';
                            while (exact != null) {
                                exact = reg.exec(txt);
                                if (exact == null) break;
                                let reqPath = exact[2];
                                subTree[reqPath] = {};
                            }
                            console.log(JSON.stringify(this.tree), this.tree);
                        })
                        // 递归
                        .then(() => {
                            Object.keys(subTree).forEach(sub => {
                                console.log('递归', sub)
                                this.one_by_one(sub, subTree)
                            });
                        })
                        .catch(err => {
                            console.warn(err);
                        })
                })
                .catch(err => {
                    console.warn(err);
                })
            // 遍历树
            // this.one_by_one()
        }
        require(path) {
            this.dpn_tree(path);
        }
    }
    let loader = new Module();
    w.require = function (path) {
        loader.require(path)
    }
})(window, document)