// Reading query params
const scriptElement = document.getElementById("livePrintScript");
let clientToken = ''
if (scriptElement) {
    const scriptSrc = scriptElement.getAttribute("src");
    const urlParams = new URLSearchParams(scriptSrc.split("?")[1]);
    clientToken = urlParams.get("clientToken");
} else {
    console.error("You need add id='livePrintScript' to script")
}
let automaticRecord = true;
let saveOnSubmit = true;
const events = [];
const storageRecord = 'LIVEPRINT_EVENTS';
let pathNamePage = window.location.pathname;
let storageEvents =  {};
storageEvents[pathNamePage] = [];
console.log('Reset storegae in ', pathNamePage)
const livePrintApiSave = 'http://localhost:3000/api/public/liveprint/saveRecord'
const keepVideo = true;

console.log('clientToken:', clientToken)
if (automaticRecord) {
    startRecord()
}


function startRecord() {
    console.log('starting liveprint')
    rrweb.record({
        emit(event) {
            events.push(event);
            if (keepVideo) {
                storageEvents[pathNamePage] = Object.assign(events);
                // localStorage.setItem(storageRecord, JSON.stringify(storageEvents));
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
    console.log('saveRecordWithOnsubmitEvent')
    const jsonObject = Object.fromEntries(Array.from(data.entries()));
    const userAgent = window.navigator.userAgent;
    const responseIp = await fetch("https://api.ipify.org/?format=json");
    const responseAsJson = await responseIp.json();
    const clientIp = responseAsJson?.ip;
    const dataSubmit = {
        form: jsonObject,
        events: localStorage.getItem(storageRecord),
        clientIp,
        userAgent,
        clientToken: clientToken ? clientToken : ''
    };
    console.log('dataSubmit: ', dataSubmit)
    const response = await fetch(livePrintApiSave, {
        method: 'POST',
        body: JSON.stringify(dataSubmit),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
    return await response.json();
}

async function saveRecord(formDataObject) {
    console.log('saveRecord')
    const userAgent = window.navigator.userAgent;
    const responseIp = await fetch("https://api.ipify.org/?format=json");
    const responseAsJson = await responseIp.json();
    const clientIp = responseAsJson?.ip;
    const dataSubmit = {form: formDataObject, events, clientIp, userAgent, clientToken: clientToken ? clientToken : ''};
    console.log('dataSubmit: ', dataSubmit)
    const response = await fetch(livePrintApiSave, {
        method: 'POST',
        body: JSON.stringify(dataSubmit),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
    return await response.json();
}

