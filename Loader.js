/* 
 *  全局对象 module、exports用于导出模块
 *  正则解析require方法，来加载模块
 * })
 */
(function (w, d) {

    class Module {
        constructor() {

        }
        // 依赖树
        dpn_tree(path) {
            this.tree = {};
            this.one_by_one(path, this.tree);
        }
        one_by_one(path, tree) {
           let subTree = tree[path] = {};
            fetch(path)
                .then(respone => {
                    respone.text()
                        .then(txt => {
                            const reg = /var\s\w+\s?=\s?require\(\s?(['"])([-./\w]+)\1\)[;\n]/gm;
                            let exact = '';
                            while (exact != null) {
                                exact = reg.exec(txt);
                                if (exact == null) break;
                                let reqPath = exact[2];
                                subTree[reqPath] = {};
                            }
                            console.log('递归', this.tree);
                        })
                        .then(() => {
                            console.log('>>>>>',subTree)
                            Object.keys(subTree).forEach(sub => {
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