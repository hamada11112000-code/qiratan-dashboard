/*
  عامل الخدمة — هو ما يجعل هذه الصفحة تطبيقاً لا موقعاً.
  بوجوده يعرض أندرويد «تثبيت التطبيق»، ويفتحه بلا شريط متصفّح.

  التخزين: الواجهة فقط (صفحة وأيقونات). الأرقام لا تُخزَّن أبداً —
  إحصاءةٌ قديمة معروضةً كأنها اليوم أسوأ من لا شيء.
*/
const SHELL = 'qiratan-dash-v1';
const FILES = ['./index.html', './manifest.webmanifest',
               './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== SHELL).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // نداءات الأرقام تمرّ للشبكة دائماً — لا تُخزَّن ولا تُقرأ من مخزن
  if (e.request.method !== 'GET' || url.pathname.includes('/rest/v1/')) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
