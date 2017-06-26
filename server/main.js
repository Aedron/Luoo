const Koa = require('koa');
const Router = require('koa-router');
const colors = require('colors');
const db = require('./db');
const config = () => require('./package.json').config;


const [app, router] = [new Koa(), new Router()];


router.get('/vols/:preVol', async ctx => {
    ctx.body = JSON.stringify(await db.vol.getList(parseInt(ctx.params.preVol)));
    log(`/vols/${ctx.params.preVol}`, ctx.request.ip)
});


router.get('/singles/:preDate', async ctx => {
    ctx.body = JSON.stringify(await db.single.getList(parseInt(ctx.params.preDate)));
    log(`/singles/${ctx.params.preDate}`, ctx.request.ip)
});


router.get('/vol/:vol', async ctx => {
    const data = await db.vol.get(parseInt(ctx.params.vol));
    data && (data.tracks = await db.vol.tracks(parseInt(ctx.params.vol)));
    ctx.body = JSON.stringify(data || 'error');
    log(`/vol/${ctx.params.Vol}`, ctx.request.ip)
});


router.get('/single/:date', async ctx => {
    const data = await db.single.get(parseInt(ctx.params.date));
    ctx.body = JSON.stringify(data || 'error');
    log(`/single/${ctx.params.date}`, ctx.request.ip)
});


router.get('/latest/:type', ctx => {
    const type = ctx.params.type;
    ctx.body = (type === 'vol' || type === 'single') ?
        db[type].latest() : -1;
    log(`/latest/${ctx.params.type}`, ctx.request.ip)
});


router.get('/download/:platform', ctx => {
    const platform = parseInt(ctx.params.platform);
    const URL = `http://os3s219a3.bkt.clouddn.com/Luoo.qy-v${require('./package.json').update.fullVersion}.${['dmg', 'exe', 'zip'][platform]}`;
    ctx.redirect(URL)
});

router.get('/update/:platform/:preVersion', ctx => {
    const info = require('./package.json').update;
    if (info.type === 'full') ctx.body = JSON.stringify({
        type: 'full',
        version: info.fullVersion,
        URL: `http://os3s219a3.bkt.clouddn.com/Luoo.qy-v${info.fullVersion}.${['dmg', 'exe', 'zip'][parseInt(ctx.params.platform)]}`
    });
    else ctx.body = JSON.stringify({
        type: info.type,
        version: info.version,
        URL: `http://os3s219a3.bkt.clouddn.com/update-v${info.version}.zip}`
    });
});

app.use(router.routes()).listen(config().port);
