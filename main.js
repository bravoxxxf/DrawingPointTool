// 优化分辨率
window.onresize = function () {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 6.4 + 'px';
};
onresize();


PIXI.utils.createSprite = function (id, pos, anchor, parent) {
    var sprite = new Sprite(TextureCache[id]);
    sprite.anchor.x = anchor.x;
    sprite.anchor.y = anchor.y;
    sprite.x = pos.x;
    sprite.y = pos.y;
    if (parent) {
        parent.addChild(sprite);
    }
    return sprite;
}

// 设置别名, 方便编码
Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite
Utils = PIXI.utils;

// 补间动画
PIXI.Ticker.timingMode = PIXI.Ticker.RAF; // 设置补间动画更新频率与渲染频率相同
Tween = PIXI.Tween;
Ease = PIXI.Ease;




// 初始化舞台
function initCanvas() {
    ;
    renderer = autoDetectRenderer(1500, 800);
    // 把pixi创建的canvas元素插入到dom文档中
    document.body.appendChild(renderer.view);

    // 创建舞台、渲染器
    stage = new Container();
    var homeScene = new HomeScene();
    stage.addChild(homeScene.root)
}

// 按照每秒60的速度执行, 用来更新画面
function animate(time) {
    renderer.render(stage);
    requestAnimationFrame(animate);
}

initCanvas();

animate();
