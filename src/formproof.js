// Reading query params
const scriptElement = document.getElementById("formproofScript");
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
    console.error("You need add id='formproofScript' to script")
}
const events = [];
const storageRecord = 'FORMPROOF_EVENTS';
let pathNamePage = window.location.pathname;
let eventsToSave = {};
const formProofApiSave = 'https://bright-source-jxr9r.ampt.app/api/recordings'
let savingLoading = false;
let record = true;


if (automaticRecord) {
    console.log('formproof start..')
    formProoftStartRecord()
}

function formProoftStartRecord() {
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
    event.preventDefault();
    console.log('formproof#onSubmit')
    if (saveOnSubmit) {
        console.log('formproof#saving on submit')
        const data = new FormData(event.target);
        const recordKey = await formproofSaveRecordWithOnsubmitEvent(data);
        console.log('Record key: ', recordKey)
    }
    event.target.submit();
});

async function formproofSaveRecordWithOnsubmitEvent(data) {
    savingLoading = true
    console.log('formproofSaveRecordWithOnsubmitEvent')
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
    const response = await fetch(formProofApiSave, {
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

async function formproofSaveRecord(data = {}) {
    console.log('formproofSaveRecord#saveRecord');
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
    const response = await fetch(formProofApiSave, {
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
