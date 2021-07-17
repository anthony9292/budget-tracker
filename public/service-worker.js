const cacheName = 'v1'
const cacheFiles = [
    '/',
    'index.js',
    'index.html',
    'style.css',
     'db.js'
]

self.addEventListener('install', function(e) { 
    console.log('Service worker is now working!!');


    e.waitUntil(
        caches.open(cacheName)
        .then(function (cache) { 
            console.log('Caching files')
            return cache.addAll(cacheFiles)
        })
    )
})

self.addEventListener('acrive', function(e) { 
    console.log('Service worker has been activated!!')

    e.waitUntil( 
        catches.keys()
        .then(function (cacheNames) { 
               return Promise.all(cacheNames.map(function (thisCacheName) { 
                   if(thisCacheName !== cacheName) { 
                       console.log('Files Removed from cache')
                       return caches.delete(thisCacheName)
                   }
               }))
        })
    )
})

 self.addEventListener('fetch', function (e) { 
     console.log('Service working is fetching', e.request.url)
     e.respondWith(
         caches.match(e.request)
         .then(function(response){ 
             if (response) { 
                 console.log(e.request.url)
                 return response
             }

             const reqClone = e.request.clone()


             fetch(reqClone)
             .then(function (response) { 
                 if(!response) { 
                     console.log('fetch is not responding')
                     return response 
                 }

                 const respClone = response.clone.then(function(cache) { 
                     cache.put(e.request, respClone ) 
                     return response 
                 })
             })
             .catch(function(error) { 
                 console.log('error has been made', error); 
             })
         })
     )
 })