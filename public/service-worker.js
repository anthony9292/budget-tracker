const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1"
const FILES_TO_CACHE = [
     '/',
     "/budgetDB.js",
    '/index.html',
    '/index.js',
    '/manifest.webmanifest',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
  ];


//install
self.addEventListener('install', event => { 
    //pre cache budget data 
    event.waitUntil( 
        caches
          .open(CACHE_NAME)
          .then(cache => {
            console.log("successfully pre-cached");
            cache.addAll(FILES_TO_CACHE);
         })
        );
});
    

self.addEventListener("activate", event => { 
    console.log('activated!!')
    const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
    event.waitUntil( 
        caches.keys().then((cacheNames) => {
            return cacheNames.filter((cacheNames) => !currentCaches.includes(cacheNames));
        })

        .then((cacheToDelete) => {
        return Promise.all(cacheToDelete.map((cacheToDelete) =>{
            return caches.delete(cacheToDelete);
        })
        );
        })
          .then(() => self.client.claim())
          )
 });



//fetch
 self.addEventListener('fetch',  event => {  
     if(event.request.url.includes('/api/')) { 
         event.respondWith(
             caches.open(DATA_CACHE_NAME).then((cache) => { 
                 return fetch(event.request).then(response => { 
                     if(response.status === 200) { 
                         cache.put(event.request.url, response.clone());
                     }
                     return response;
                 })
                 .catch(err => {
                     return cache.match(event.request);
                 });
             })
             .catch(err => console.log(err))
         );
     }
 })