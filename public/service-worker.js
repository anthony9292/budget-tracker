const FILES_TO_CACHE = [
    '/index.html',
    '/manifest.webmanifest',
    '/db.js',
    '/index.js',
    '/styles.css',
    '/favicon.ico',
  ];
  

const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = "data-cache-v1";

//install
self.addEventListener('install', function (evt) { 
    //pre cache budget data 
    evt.waitUntil( 
        caches.open(CACHE_NAME).then(cache => {
            console.log("successfully pre-cached");
        return cache.addAll(FILES_TO_CACHE);
         })
    );
    //lets browser know to activate this sevice worker immediately once it has finished installing
    self.skipwaiting();
        });

self.addEventListener('activate', function (evt) { 
    console.log('Service worker has been activated!!')
    evt.waitUntil( 
        catches.keys().then((keyList) => { 
            return Promise.all(
                keyList.map((key) => {
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

//fetch
 self.addEventListener('fetch', function (evt) { 
     if(evt.request.url.includes('/api/')) {
     evt.respondWith(
         caches.open(DATA_CACHE_NAME).then(cache => { 
             return fetch(evt.request)
             .then(response => { 
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
            //sever files from cache
   evt.respondWith( 

    caches.open(CACHE_NAME).then(cache => {
         return cache.match(evt.request).then(response => { 
                return response || fetch(evt.request);
         });
        })
   )
    });