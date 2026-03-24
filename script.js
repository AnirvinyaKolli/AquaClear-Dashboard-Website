/*the url to the realtime database

Actual url
const DB_URL = "https://drainfiltertesting-default-rtdb.firebaseio.com/data.json";
Testing url
const DB_URL = "https://drainfiltertesting-default-rtdb.firebaseio.com/test.json";

*/
const DB_URL = "https://drainfiltertesting-default-rtdb.firebaseio.com/test.json";

// Container 
const container = document.getElementById("devices-container");
const searchInput = document.getElementById("search")

let data = {};

searchInput.addEventListener("input", () => {
    renderDevices(data);
});

function formatTimestamp(ts) {
    const date = new Date(ts);

    if (isNaN(date)) return "Unknown";

    return date.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

//LOADING SKELETONS
function showLoadingSkeletons(count) {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton-card";
        container.appendChild(skeleton);
    }
}
// async and await allow the code to fetch the data 
async function loadDeviceData() {
    const res = await fetch(DB_URL)
    data = await res.json();
    renderDevices(data)
}

function renderDevices(data){
    const query = searchInput.value.toLowerCase();
    container.innerHTML = "";
    const renderedDevices = Object.keys(data).filter((k) => k.includes(query));
    if (renderedDevices.length == 0){
        const card = document.createElement("div");
        card.className = "no-results";
        card.innerHTML = `
            <p>No filters match your search :(<p/>
        `;
        container.appendChild(card);
        return
    }

    for (const deviceId of renderedDevices) {
        const status = data[deviceId].filterStatus.toLowerCase();
        const card = document.createElement("a");

        card.href = `device.html?id=${deviceId}`;
        card.className = "filter-item";
        card.innerHTML = `
            <div class="card-content">
                <div class="card-header">
                    <h3>Filter ID: ${deviceId}</h3>
                    <span class="status-tag status-${status}">
                        ${data[deviceId].filterStatus}
                    </span>
                </div>

                <p>Water Flow: ${data[deviceId].waterFlow}</p>

                <span class="timestamp bottom-right">
                    ${formatTimestamp(data[deviceId].timeStamp)}
                </span>
            </div>
        `;

        container.appendChild(card);
    }
}
//Repeat every 5 seconds
showLoadingSkeletons(10)
loadDeviceData()
setInterval(loadDeviceData, 5000); 