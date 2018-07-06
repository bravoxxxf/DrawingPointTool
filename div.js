var MyDiv = function (data) {
  this.root = null;
  this.ms = [];
  if (data) {
    this.initWithData(data);
  } else {
    this.init();
  }
}

MyDiv.prototype.initWithData = function (data) {

  var div = new PIXI.Graphics();
  div.beginFill(0xffffff, 0.5);
  div.drawRect(0, 0, data.w, data.h);
  div.endFill();
  div.position.x = data.x;
  div.position.y = data.y;
  this.name = data.name;
  this.root = div;

  // Div锚点
  var listPoint = [{ x: -10, y: -10 }, { x: div.width, y: -10 }, { x: div.width, y: div.height }, { x: -10, y: div.height }];

  for (var i = 0; i < listPoint.length; i++) {
    var m = new PIXI.Graphics();
    m.beginFill(0xb22f2f, 1);
    m.drawRect(0, 0, 10, 10);
    m.endFill();
    m.position.x = listPoint[i].x;
    m.position.y = listPoint[i].y;
    m.idx = i;
    div.addChild(m);
    this.ms.push(m);

    m.on('pointerdown', this.mouseDownm.bind(this));
    m.on('pointermove', this.mouseMovem.bind(this));
    m.on('pointerup', this.mouseUpm.bind(this));
    m.on('pointerupoutside', this.mouseUpm.bind(this));

    m.interactive = true;

  }
  this.hideM();

  this.root.on('pointerdown', this.mouseDown.bind(this));
  this.root.on('pointermove', this.mouseMove.bind(this));
  this.root.on('pointerup', this.mouseUp.bind(this));
  this.root.on('pointerup', this.mouseUpm.bind(this));
  this.root.interactive = true;
}

MyDiv.prototype.init = function () {
  // Div背景
  var div = new PIXI.Graphics();
  div.beginFill(0xffffff, 0.5);
  div.drawRect(0, 0, 100, 100);
  div.endFill();
  this.root = div;

  // Div锚点
  var listPoint = [{ x: -10, y: -10 }, { x: div.width, y: -10 }, { x: div.width, y: div.height }, { x: -10, y: div.height }];

  for (var i = 0; i < listPoint.length; i++) {
    var m = new PIXI.Graphics();
    m.beginFill(0xb22f2f, 1);
    m.drawRect(0, 0, 10, 10);
    m.endFill();
    m.position.x = listPoint[i].x;
    m.position.y = listPoint[i].y;
    m.idx = i;
    div.addChild(m);
    this.ms.push(m);

    m.on('pointerdown', this.mouseDownm.bind(this));
    m.on('pointermove', this.mouseMovem.bind(this));
    m.on('pointerup', this.mouseUpm.bind(this));
    m.on('pointerupoutside', this.mouseUpm.bind(this));

    m.interactive = true;

  }
  this.hideM();

  this.root.on('pointerdown', this.mouseDown.bind(this));
  this.root.on('pointermove', this.mouseMove.bind(this));
  this.root.on('pointerup', this.mouseUp.bind(this));
  this.root.on('pointerup', this.mouseUpm.bind(this));
  this.root.interactive = true;
}


MyDiv.prototype.hideM = function () {
  for (var i = 0; i < this.ms.length; i++) {
    this.ms[i].visible = false;
  }
}

MyDiv.prototype.showM = function () {
  for (var i = 0; i < this.ms.length; i++) {
    this.ms[i].visible = true;
  }
}

MyDiv.prototype.mouseDown = function (e) {
  if (this.mCanMove) return;
  this.canMove = true;
  this.lastPos = { x: e.data.global.x, y: e.data.global.y };
}

MyDiv.prototype.mouseMove = function (e) {
  if (this.canMove) {
    this.root.position.x += (e.data.global.x - this.lastPos.x);
    this.root.position.y += (e.data.global.y - this.lastPos.y);
    this.lastPos = { x: e.data.global.x, y: e.data.global.y };
  }
  // console.log("x,y :  " + e.data.global.x + "," + e.data.global.y);
}

MyDiv.prototype.mouseUp = function (e) {
  this.canMove = false;
}

// mmmm
MyDiv.prototype.mouseDownm = function (e) {
  this.canMove = false;
  this.mCanMove = true;
  this.lastPos = { x: e.data.global.x, y: e.data.global.y };
  this.curM = e.target;
}

MyDiv.prototype.mouseMovem = function (e) {
  if (this.mCanMove && this.curM) {

    this.curM.position.x += (e.data.global.x - this.lastPos.x);
    this.curM.position.y += (e.data.global.y - this.lastPos.y);
    this.updateDiv();
    this.lastPos = { x: e.data.global.x, y: e.data.global.y };
  }
  // console.log("x,y :  " + e.data.global.x + "," + e.data.global.y);
}

MyDiv.prototype.mouseUpm = function (e) {
  this.mCanMove = false;
  console.log(this.root.position.x + this.root.graphicsData[0].shape.x);
  console.log("wh :" + this.root.graphicsData[0].shape.width + "," + this.root.graphicsData[0].shape.height);
}

MyDiv.prototype.updateDiv = function () {
  // 后面跟y，前面跟x走
  var nextIdx = (this.curM.idx + 1) > 3 ? 0 : (this.curM.idx + 1);
  var preIdx = (this.curM.idx - 1) < 0 ? 3 : (this.curM.idx - 1);

  if (this.curM.idx == 0 || this.curM.idx == 2) {
    this.ms[nextIdx].y = this.curM.y;
    this.ms[preIdx].x = this.curM.x;
  } else {
    this.ms[preIdx].y = this.curM.y;
    this.ms[nextIdx].x = this.curM.x;
  }


  var x = this.ms[0].x + 10;
  var y = this.ms[0].y + 10;
  var w = this.ms[1].x - this.ms[0].x - 10;
  var h = this.ms[2].y - this.ms[1].y - 10;


  var pos = this.root.toGlobal({ x: x, y: y });

  this.root.clear();
  this.root.beginFill(0xffffff, 0.5);
  this.root.drawRect(x, y, w, h);
  this.root.endFill();
}