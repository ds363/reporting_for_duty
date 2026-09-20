/* ═══════════════════════════════════════════════════════════════════════════
   sw.js — Service Worker（服务工作线程）
   ═══════════════════════════════════════════════════════════════════════════

   【它是什么】
   一个跑在浏览器后台的独立脚本，拦截本应用的网络请求，实现：
     - 离线可用：首次访问时把文件缓存到本地，断网也能打开
     - 加载更快：优先从本地缓存读取，不走网络

   【注意】
   Service Worker 只在 HTTPS 或 localhost 下才能注册生效（浏览器强制要求）。
   如果部署在 http:// 环境，此文件不会起作用，但不影响页面本身正常显示。
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   【事件 1：install】首次安装时触发
   作用：把列表中的文件预先下载到缓存里
   ───────────────────────────────────────────── */
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('v1').then(function (cache) {
            /* ⚠️ 下面用的是「根路径」（以 / 开头），
               意味着本应用假设部署在域名的根目录。
               若部署在子路径（如 example.com/app/），
               这里需要相应改成 '/app/xxx' 或相对路径。 */
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/icon.png'
            ]);
        })
    );
});

/* ─────────────────────────────────────────────
   【事件 2：fetch】页面每次发起网络请求时触发
   作用：优先从缓存返回；缓存没有（未命中）才真正去网络取
   ═══════════════════════════════════════════════════════════════════════════ */
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // response 存在 → 用缓存的；不存在 → 走网络 fetch
            return response || fetch(event.request);
        })
    );
});

/* ⚠️ 提示：此文件修改后，用户端不会立即生效（旧 SW 仍在运行）。
   需在浏览器里强制刷新，或等待浏览器自动更新 SW。
   开发调试时：Chrome DevTools → Application → Service Workers → Update on reload */