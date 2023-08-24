// Reading query params
const scriptElement = document.getElementById("livePrintScript");
let clientToken = ''
let automaticRecord = true;
let saveOnSubmit = true;
let keepVideo = false;

if (scriptElement) {
    const scriptSrc = scriptElement.getAttribute("src");
    const urlParams = new URLSearchParams(scriptSrc.split("?")[1]);
    clientToken = urlParams.get("clientToken");
    keepVideo = urlParams.get("keepVideo") ? urlParams.get("keepVideo") : false;
    saveOnSubmit = urlParams.get("saveOnSubmit") ? urlParams.get("saveOnSubmit") : true;
} else {
    console.error("You need add id='livePrintScript' to script")
}
const events = [];
const storageRecord = 'LIVEPRINT_EVENTS';
let pathNamePage = window.location.pathname;
let eventsToSave = {};
const livePrintApiSave = 'http://localhost:3000/api/public/liveprint/saveRecord'
let savingLoading = false;
let record = true;
console.log('clientToken:', clientToken)
console.log('keepVideo:', keepVideo)
console.log('saveOnSubmit:', saveOnSubmit)

if (automaticRecord) {
    startRecord()
}

function startRecord() {
    rrweb.record({
        emit(event) {
            if (record) {
                eventsToSave = localStorage.getItem(storageRecord) ? JSON.parse(localStorage.getItem(storageRecord)) : {};
                eventsToSave[pathNamePage] = [];
                events.push(event);
                if (keepVideo) {
                    eventsToSave[pathNamePage] = Object.assign(events);
                    localStorage.setItem(storageRecord, JSON.stringify(eventsToSave));
                }
            }
        },
        recordCanvas: true,
    });
}

addEventListener("submit", async (event) => {
    console.log('liveprint#onSubmit')
    if (saveOnSubmit) {
        console.log('liveprint#saving on submit')
        event.preventDefault();
        const data = new FormData(event.target);
        const recordKey = await saveRecordWithOnsubmitEvent(data);
        console.log('Record key: ', recordKey)
    }
});

async function saveRecordWithOnsubmitEvent(data) {
    savingLoading = true
    console.log('saveRecordWithOnsubmitEvent')
    const jsonObject = Object.fromEntries(Array.from(data.entries()));
    const userAgent = window.navigator.userAgent;
    const responseIp = await fetch("https://api.ipify.org/?format=json");
    const responseAsJson = await responseIp.json();
    const clientIp = responseAsJson?.ip;
    const eventsToSubmit = !keepVideo ? {[pathNamePage]: events} : JSON.parse(localStorage.getItem(storageRecord));
    const dataSubmit = {
        form: jsonObject,
        events: JSON.stringify(eventsToSubmit),
        clientIp,
        userAgent,
        clientToken: clientToken ? clientToken : ''
    };
    const response = await fetch(livePrintApiSave, {
        method: 'POST',
        body: JSON.stringify(dataSubmit),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
    savingLoading = false;
    record = false;
    if (keepVideo) {
        localStorage.removeItem(storageRecord);
    }
    return await response.json();
}

async function saveRecord(data = {}) {
    console.log('saveRecord');
    savingLoading = true;
    const userAgent = window.navigator.userAgent;
    const responseIp = await fetch("https://api.ipify.org/?format=json");
    const responseAsJson = await responseIp.json();
    const clientIp = responseAsJson?.ip;
    const eventsToSubmit = !keepVideo ? {[pathNamePage]: events} : JSON.parse(localStorage.getItem(storageRecord));
    const dataSubmit = {
        form: data,
        events: JSON.stringify(eventsToSubmit),
        clientIp,
        userAgent,
        clientToken: clientToken ? clientToken : ''
    };
    const response = await fetch(livePrintApiSave, {
        method: 'POST',
        body: JSON.stringify(dataSubmit),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
    savingLoading = false;
    record = false;
    if (keepVideo) {
        localStorage.removeItem(storageRecord);
    }
    return await response.json();
}

