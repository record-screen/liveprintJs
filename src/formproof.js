// Reading query params
const scriptElement = document.getElementById("formproofScript");
let clientToken = ''
let apiKey = '';
let phoneNumber = '';
let automaticRecord = true;
let saveOnSubmit = true;
let keepVideo = false;
let tfaTwilio = false;
let blackList = false;
let phoneInputId = 'phone';

if (scriptElement) {
    const scriptSrc = scriptElement.getAttribute("src");
    const urlParams = new URLSearchParams(scriptSrc.split("?")[1]);
    clientToken = urlParams.get("clientToken");
    keepVideo = urlParams.get("keepVideo") ? urlParams.get("keepVideo") : false;
    tfaTwilio = urlParams.get("tfaTwilio") ? urlParams.get("tfaTwilio") : false;
    blackList = urlParams.get("blackList") ? urlParams.get("blackList") : false;
    saveOnSubmit = urlParams.get("saveOnSubmit") ? urlParams.get("saveOnSubmit") : true;
} else {
    console.error("You need add id='formproofScript' to script")
}
const events = [];
const storageRecord = 'FORMPROOF_EVENTS';
let pathNamePage = window.location.pathname;
let eventsToSave = {};
const formProofApiSave = 'https://smart-stack-ce8yl.ampt.app/api/recordings'
let savingLoading = false;
let record = true;
const sendTfaCode = 'https://smart-stack-ce8yl.ampt.app/api/tfa/sendCode';
const validateTfCode = 'https://smart-stack-ce8yl.ampt.app/api/tfa/validate';
const validateBlackList = 'https://smart-stack-ce8yl.ampt.app/api/blacklist';
const getConfig = `https://smart-stack-ce8yl.ampt.app/api/tokens/token/j57d0zz4tz1fta10wtrmw44fvh6j5fwj/config`;

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
    if (tfaTwilio && tfaTwilio === 'true' && blackList === 'false'){
        await tfaValidation(tfaTwilio, phoneInputId, sendTfaCode, validateTfCode, saveOnSubmit, event);
    } else if (blackList && blackList === 'true') {
        await blackListPhone(tfaTwilio, blackList, phoneInputId, validateBlackList, saveOnSubmit, event)
    } else {
        await saveRecording(saveOnSubmit, event)
    }
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
    const response = await saveRecordings(formProofApiSave, dataSubmit)
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
    const response = await saveRecordings(formProofApiSave, dataSubmit)
    savingLoading = false;
    record = false;
    if (keepVideo) {
        localStorage.removeItem(storageRecord);
    }
    return await response.json();
}
