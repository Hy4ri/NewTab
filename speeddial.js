document.addEventListener('DOMContentLoaded', () => {
    const speedList = document.getElementById('speedlist');
    const addButton = document.getElementById('add-entry');

    // Load saved Speed Dial entries from storage
    chrome.storage.sync.get('speedDial', (data) => {
        const entries = data.speedDial || [];
        entries.forEach(({ name, url }) => {
            addSpeedDialEntry(name, url);
        });
    });

    // Add Speed Dial entry
    addButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent any default form behavior or navigation

        let name = null;
        let url = null;

        // Force user to choose a name
        while (!name) {
            name = prompt("Enter the name of the site:");
            if (!name) {
                alert("Name is required. Please enter a name.");
            }
        }

        // Ask for URL
        while (!url) {
            url = prompt("Enter the URL of the site:");
            if (!url) {
                alert("URL is required. Please enter a valid URL.");
            } else if (!/^https?:\/\//i.test(url)) {
                url = `https://${url}`; // Add https:// if not present
            }
        }

        // Add entry to DOM and save
        addSpeedDialEntry(name, url);
        saveSpeedDialEntry(name, url);
    });

    // Add entry to the DOM
    function addSpeedDialEntry(name, url) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        const removeButton = document.createElement('span');

        link.href = url;
        link.textContent = name;
        link.target = '_blank'; // Open in a new tab

        removeButton.textContent = 'x';
        removeButton.style.cursor = 'pointer';
        removeButton.style.marginLeft = '10px';
        removeButton.style.color = 'red';
        removeButton.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${name}"?`)) {
                li.remove();
                removeSpeedDialEntry(name);
            }
        });

        li.appendChild(link);
        li.appendChild(removeButton);
        speedList.appendChild(li);
    }

    // Save entry to storage
    function saveSpeedDialEntry(name, url) {
        chrome.storage.sync.get('speedDial', (data) => {
            const entries = data.speedDial || [];
            entries.push({ name, url });
            chrome.storage.sync.set({ speedDial: entries });
        });
    }

    // Remove entry from storage
    function removeSpeedDialEntry(name) {
        chrome.storage.sync.get('speedDial', (data) => {
            const entries = data.speedDial || [];
            const updatedEntries = entries.filter(entry => entry.name !== name);
            chrome.storage.sync.set({ speedDial: updatedEntries });
        });
    }
});
