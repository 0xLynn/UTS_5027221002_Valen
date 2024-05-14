const display = document.querySelector('#cve tbody')

async function fetchData() {
    try {
        const res = await fetch('http://localhost:5002/cve');
        const data = await res.json();
        const results = data.cves;
        console.log(results);
        display.innerHTML = '';

        results.map((item) => {
            
            const row = document.createElement('tr');
            const titleCell = document.createElement('td');
            titleCell.textContent = item.title;
            row.appendChild(titleCell);

            const severityCell = document.createElement('td');
            severityCell.textContent = item.severity;
            row.appendChild(severityCell);

            const platformCell = document.createElement('td');
            platformCell.textContent = item.platform; 
            row.appendChild(platformCell);

            display.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData()
