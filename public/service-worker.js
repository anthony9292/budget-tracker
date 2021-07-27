const FILES_TO_CACHE = [
     '/',
    '/index.html',
    '/manifest.webmanifest',
    '/db.js',
    '/index.js',
    'styles.css',
    '/icons/icon-192x192png',
    '/icons/icon-512x512.png',
  ];
  

const CACHE_NAME = 'static files';
const DATA_CACHE_NAME = "data files";

//install
self.addEventListener('install', event => { 
    //pre cache budget data 
    event.waitUntil( 
        caches.open(CACHE_NAME).then(cache => {
            console.log("successfully pre-cached");
    cache.addAll(FILES_TO_CACHE);
         })
        .then(() => self.skipWaiting())
        .cache(err => console.log(err))
        );
});
    

self.addEventListener('activate', event => { 
    console.log('Service worker has been activated!!')
    event.waitUntil( 
        catches.keys().then((keyList) => { 
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME) { 
                        return caches.delete(key);
                    }
                })
            );
       })
    );
      self.clients.claim(); 
 });



//fetch
 self.addEventListener('fetch',  evt => { 
    console.log(evt.request.url) 
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => { 
                return fetch(evt.request).then(response => { 
                     
                     if(response.status === 200) { 
                         cache.put(evt.request.url, response.clone());
                     }

                     return response;
                })
                .catch(err => { 
                    return cache.match(evt.request); 
                });
            })
            .catch(err => console.log(err))
            );
            return;
    }

    evt.respondWith(
        caches.match(evt.request).then(function(response) { 
            return response || fetch(evt.request);
        })
    );
 })