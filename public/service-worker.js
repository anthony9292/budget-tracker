const cacheName = 'v1'
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    '/',
    'index.js',
    'index.html',
    'style.css',
     'db.js'
];

//install
self.addEventListener('install', function(e) { 
    //pre cache budget data 
    e.waitUntil( 
        cache.open(DATA_CACHE_NAME).then((cache) => cache.add("/api/transaction"))
    );

    e.waitUntil(
        caches.open(cacheName)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
     //lets browser know to activate this sevice worker immediately once it has finished installing
     self.skipwaiting();
        });

self.addEventListener('activate', function(e) { 
    console.log('Service worker has been activated!!')
    e.waitUntil( 
        catches.keys()
        .then(keyList => { 
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) { 
                        console.log("Removing old cache data", key); 
                        return caches.delete(key);
                    }
                })
            );
            })
    );
 self.clients.claim(); 
        });



//handel requests 
 self.addEventListener('fetch', function (e) { 
     if(e.request.url.includes('api')) {
     console.log('[Service Worker] Fetch (data)', e.request.url);


     e.respondWith(
         caches.open.(DATA_CACHE_NAME).then(catche=> { 
             return fetch(e.request).then(res => { 
                 if(res.status === 200) { 
                     cache.put(e.request.url, res.clone());
                 }
                    return res;
                }).catch(err => { 
                    console.log(err);
                    return cache.match(e.request);
                })
             })


         );
         return;

            }
            //sever files from cache
        e.respondWith(
         caches.open(CACHE_NAME).then(cache => { 
             return cache.match(e.request).then(res => { 
                 return res || fetch(e.request);
             })
            })
        );
         });
         