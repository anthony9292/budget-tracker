// holds db objects when connection is complete 

let db; 

//connects to IndexDB database 
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) { 
    const db = event.target.result; 

    if (navigator.onLine) { 
        uploadTransaction(); 
    }
};

request.onerror = function(event) { 
    console.log(event.target.errorCode); 
};

function saveRecord(record) { 
    const transaction = db.transaction(['new_transaction'], 'readwrite'); 
    const budgetObjectStore = transaction.objectStore('new_transaction');
    budgetObjectStore.add(record); 
}

function uploadTransaction() { 
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_transaction');
    budgetObjectStore.add(record); 
}

function uploadTransaction() { 
    const transaction = db.transaction(['new_transaction'], 'readwrite'); 
   const  budgetObjectStore = transaction.objectStore('new_transaction'); 
   const getAll = budgetObjectStore.getAll(); 


getAll.onsuccess = function() { 
    if(getAll.result.length > 0) { 
        fetch('/api/transaction/bulk', { 
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: { 
                Accept: 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(serverResponse => { 
            if (serverResponse.message) { 
                throw new Error(serverResponse); 
            }

            const transaction = db.transaction(['new_transaction'], 'readwrite'); 
            const budgetObjectStore = transaction.objectStore('new_transaction');
            budgetObjectStore.clear();

            alert('All transactions have been saved and submitted');
        })
        .catch(err => { 
            console.log(err);
        });
    }
}

};

windows.addEventListener('online', uploadTransaction);