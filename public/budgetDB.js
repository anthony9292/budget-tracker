const indexedDB = 
 window.indexedDB ||
 window.mozIndexedDB ||
 window.webkitIndexedDB ||
 window.msIndexedDB ||
 window.shimIndexedDB;

 let dataB;
 let newBudget


 const request = indexedDB.open('BudgetData', 1)

 request.onupgradeneeded = (e) => {
     console.log('Upgraded Needed')
 
 const {oldVersion } = e;

 const newVersion = e.newVersion || dataB.version 
 console.log(`Updated from version ${oldVersion} to ${newVersion}`);

 let dataB = e.target.result; 
 dataB.createObjectStore('BudgetStore', { autoIncrement: true})
};

request.onerror = function (e) { 
    console.log(`Woops! ${e.target.errorCode}`);
};

request.onsuccess = function (e) {
    console.log('Success')
    dataB = e.target.result;
    if(navigator.onLine) { 
        console.log('backend Online')
        workingDB()
    }
}


function workingDB() { 
    let transaction = dataB.transaction(['BudgetStore'], 'readwrite');

    const store = transaction.objectStore('BudgetStore');

    const getAll = store.getAll() 

    getAll.onsuccess = function () { 
        if (getAll.result.length > 0) { 
            fetch('/api/transaction', {
                method: 'POST', 
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then(() => { 
                const transaction = dataB.transaction(['BudgetStore'], 'readwrite');
                const currentStore = transaction.objectStore('BudgetStore');
                currentStore.clear()
                console.log("store is cleared")
            });
        }
    }
}

const saveRecord = (record) => {
    console.log('store record invoked');
    const transaction = dataB.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
    store.add(record);
};

window.addEventListener('online', workingDB)