
var HomeScene = function () {
    this.root = new PIXI.Container(); // 场景根节点
    this.divList = [];          // 场景Div节点
    this.init();    // 初始化场景内容
    this.curDiv = null; // 目前选择到的div
    this.root.on('pointerdown', this.mouseStart.bind(this));
    // this.root.on('pointermove', this.mouseMove.bind(this))
    this.root.interactive = true;

}

HomeScene.prototype.init = function (num) {
    var root = this.root
    var self = this;

    // 新增DIV
    $("#new").click(function () {
        self.createDiv();
    })

    // 选择文件
    $("#file").change(function (e) {
        for (var i = 0; i < e.target.files.length; i++) {
            var file = e.target.files.item(i);
            self.fileName = file.name;
            var freader = new FileReader();
            freader.readAsDataURL(file);
            freader.onload = function (e) {
                self.onSelectFile(e);
            }
        }
    });

    // 生成
    $('#build').click(function () {
        self.build();
    })

    // 属性设置
    $('#state-name').on("input", function (e) {
        self.changeDivState(e);
    })

    // 删除描点节点
    window.addEventListener('keyup', function (e) {
        if (e.which == 46) {
            self.deleteDiv();
        }
    }, false);

    // 导入JSOn
    $("#file2").change(function (e) {
        for (var i = 0; i < e.target.files.length; i++) {
            var file = e.target.files.item(i);
            var freader = new FileReader();
            freader.readAsText(file, 'utf-8');
            freader.onload = function (e) {
                var myjsonData = JSON.parse(e.target.result)
                self.fileName = myjsonData.fileName;
                self.importData(myjsonData.data);
            }
        }
    });
}

HomeScene.prototype.onSelectFile = function (e) {
    var root = this.root;
    var src = e.target.result;
    var imageElement = new Image();
    var self = this;
    imageElement.src = src;
    imageElement.onload = function () {
        var baseTexture = new PIXI.BaseTexture(imageElement);
        var sprite = PIXI.Sprite.from(baseTexture);
        root.addChild(sprite);
        self.fileWidth = imageElement.width;
        self.fileHeight = imageElement.height;
    }
}

HomeScene.prototype.createDiv = function () {
    var div = new MyDiv();
    this.root.addChild(div.root);
    this.divList.push(div);
    this.changeFocseDiv(div);
}

HomeScene.prototype.createDivWithData = function (data) {
    var div = new MyDiv(data);
    this.root.addChild(div.root);
    this.divList.push(div);
    this.changeFocseDiv(div);

}

HomeScene.prototype.changeFocseDiv = function (div) {
    if (this.curDiv) {
        this.curDiv.hideM();
    }

    this.curDiv = div;
    this.curDiv.showM();
    this.updateState();
}

HomeScene.prototype.checkPoint = function () {

}

HomeScene.prototype.mouseStart = function (e) {
    for (var i = 0; i < this.divList.length; i++) {
        if (this.divList[i].root.getBounds().contains(e.data.global.x, e.data.global.y)) {
            this.changeFocseDiv(this.divList[i]);
            break;
        }
    }

}

HomeScene.prototype.updateState = function () {
    if (this.curDiv) {
        $('#state-name').val(this.curDiv.name);
        $('#state-x').val(this.curDiv.root.position.x + this.curDiv.root.graphicsData[0].shape.x);
        $('#state-y').val(this.curDiv.root.position.y + this.curDiv.root.graphicsData[0].shape.y);
        $('#state-w').val(this.curDiv.root.graphicsData[0].shape.width);
        $('#state-h').val(this.curDiv.root.graphicsData[0].shape.height);
    }
}

// 导出数据
HomeScene.prototype.build = function () {
    var children = this.divList;
    var warpObject = {};
    var dataList = [];
    for (var i = 0; i < children.length; i++) {
        var object = new Object();
        object.name = children[i].name;
        object.x = parseInt(children[i].root.position.x + children[i].root.graphicsData[0].shape.x);
        object.y = parseInt(children[i].root.position.y + children[i].root.graphicsData[0].shape.y);
        object.w = parseInt(children[i].root.graphicsData[0].shape.width);
        object.h = parseInt(children[i].root.graphicsData[0].shape.height);
        dataList.push(object);
    }
    warpObject.data = dataList;
    warpObject.fileName = this.fileName;
    warpObject.fileWidth = this.fileWidth;
    warpObject.fileHeight = this.fileHeight;
    var text = JSON.stringify(warpObject);

    $('#data').text(text);
    $('#data').show();
}

HomeScene.prototype.changeDivState = function (e) {
    if (this.curDiv) {
        this.curDiv.name = e.target.value;
    }

}

HomeScene.prototype.deleteDiv = function () {
    if (this.curDiv) {
        for (var i = 0; i < this.divList.length; i++) {
            if (this.curDiv === this.divList[i]) {
                this.divList[i].root.destroy();
                this.divList.splice(i, 1);
                this.curDiv = null;
                console.log('删除数据了')
                break;
            }
        }

        if (this.divList.length > 0) {
            this.changeDivState(this.divList[0]);
        }
    }
}

HomeScene.prototype.importData = function (jsonObject) {
    for (var i = 0; i < jsonObject.length; i++) {
        this.createDivWithData(jsonObject[i]);
    }
}