// liveprint v.1.0.0
const scriptElement = document.getElementById("blackListPhone");
if (scriptElement) {
    const scriptSrc = scriptElement.getAttribute("src");
    const urlParams = new URLSearchParams(scriptSrc.split("?")[1]);
    inputPhoneId = urlParams.get("inputPhoneId") ? urlParams.get("inputPhoneId") : 'phone';
} else {
    console.error("You need add id='blackListPhone' to script")
}

const phoneInputElement = document.getElementById(inputPhoneId);
phoneInputElement.addEventListener("blur", function (event) {
    const phone = event.target.value;
    if (phone === '0000000000') {
        const dialog = document.createElement("dialog");
        dialog.id = "blackListPhoneDialog";
        dialog.innerHTML = `
            <h5>Your phone is in blacklist.</h5>
            <p>Do you want to continue and accept the call?</p>
            <button id="blackListCancelBTn">No</button>
            <button id="blackListContinueBTn">Yes</button>
        `;
        document.body.appendChild(dialog);
        const myDialog = document.getElementById("blackListPhoneDialog");
        myDialog.showModal();

        const continueDialogButton = document.getElementById("blackListContinueBTn");
        continueDialogButton.addEventListener("click", function () {
            myDialog.close();
        });

        const blackListCancelBTn = document.getElementById("blackListCancelBTn");
        blackListCancelBTn.addEventListener("click", function () {
            location.reload()
        });
    }
});

