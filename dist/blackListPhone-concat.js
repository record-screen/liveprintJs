// liveprint v.1.0.0
const scriptElement = document.getElementById("blackListPhone");
if (scriptElement) {
    const scriptSrc = scriptElement.getAttribute("src");
    const urlParams = new URLSearchParams(scriptSrc.split("?")[1]);
    inputPhoneId = urlParams.get("blackListPhone") ? urlParams.get("inputPhoneId") : 'phone';
} else {
    console.error("You need add id='blackListPhone' to script")
}

const phoneInputElement = document.getElementById(inputPhoneId);
phoneInputElement.addEventListener("blur", function (event) {
    const phone = event.target.value;
    if (phone === '0000000000') {
        alert(`Your phone number ${phone} is in black list`);
        location.reload()
    }
});
