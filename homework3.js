
/* =====================================================
   L.W. Medical Hospital - Homework 3
   External JavaScript Validation
   Author: Lynijah Williams
   File: homework3.js
   ===================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("patientForm");
    const validateButton = document.getElementById("validateButton");
    const submitButton = document.getElementById("submitButton");
    const formMessage = document.getElementById("formMessage");

    const slider = document.getElementById("severity");
    const sliderValue = document.getElementById("severityValue");

    // Update slider value while moving the slider.
    slider.addEventListener("input", function () {
        sliderValue.value = slider.value;
        sliderValue.textContent = slider.value;
    });

    // Convert email address to lowercase.
    const email = document.getElementById("email");

    email.addEventListener("input", function () {
        email.value = email.value.toLowerCase();
    });

    // Fields that require individual validation.
    const fieldIds = [
        "fname", "mname", "lname", "dob", "patientId",
        "email", "phone", "address1", "address2",
        "city", "state", "zip", "message",
        "userId", "password", "confirmPassword"
    ];

    // Validate fields when users leave them.
    fieldIds.forEach(function (id) {

        const field = document.getElementById(id);

        field.addEventListener("blur", function () {
            validateField(id);
        });

        field.addEventListener("input", function () {
            const error = document.getElementById(id + "Error");

            if (error.textContent !== "") {
                validateField(id);
            }

            submitButton.hidden = true;
        });

    });

    // Display an error message.
    function showError(id, message) {
        const error = document.getElementById(id + "Error");

        if (error) {
            error.textContent = message;
        }
    }

    // Validate individual form fields.
    function validateField(id) {

        const field = document.getElementById(id);
        const value = field.value.trim();

        let message = "";

        switch (id) {

            case "fname":
            case "lname":

                if (!value) {
                    message = "This field is required.";
                }
                else if (value.length > 30) {
                    message = "Maximum 30 characters allowed.";
                }
                else if (!/^[A-Za-z'-]+$/.test(value)) {
                    message = "Use letters, apostrophes, or dashes only.";
                }

                break;

            case "mname":

                if (value && !/^[A-Za-z]$/.test(value)) {
                    message = "Enter one letter or leave blank.";
                }

                break;

            case "dob":

                if (!value) {
                    message = "Date of birth is required.";
                }
                else {

                    const entered = new Date(value + "T00:00:00");

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const oldest = new Date();
                    oldest.setHours(0, 0, 0, 0);
                    oldest.setFullYear(oldest.getFullYear() - 120);

                    if (entered > today) {
                        message = "Date cannot be in the future.";
                    }
                    else if (entered < oldest) {
                        message = "Date cannot be more than 120 years ago.";
                    }
                }

                break;

            case "patientId":

                if (!/^[0-9]{9}$/.test(value)) {
                    message = "Enter exactly nine digits.";
                }

                break;

            case "email":

                field.value = value.toLowerCase();

                if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) {
                    message = "Enter a valid email address.";
                }

                break;

            case "phone":

                if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(value)) {
                    message = "Use format 713-555-1234.";
                }

                break;

            case "address1":

                if (!value) {
                    message = "Address is required.";
                }
                else if (value.length < 2 || value.length > 30) {
                    message = "Enter 2–30 characters.";
                }
                else if (!/^[A-Za-z0-9\s#.,'-]+$/.test(value)) {
                    message = "Enter a valid street address.";
                }

                break;

            case "address2":

                if (value && (value.length < 2 || value.length > 30)) {
                    message = "Enter 2–30 characters.";
                }

                break;

            case "city":

                if (!value) {
                    message = "City is required.";
                }
                else if (value.length < 2 || value.length > 30) {
                    message = "Enter 2–30 characters.";
                }
                else if (!/^[A-Za-z\s.'-]+$/.test(value)) {
                    message = "Enter a valid city name.";
                }

                break;

            case "state":

                if (!value) {
                    message = "Please select a state.";
                }

                break;

            case "zip":

                if (!/^[0-9]{5}$/.test(value)) {
                    message = "Enter exactly five digits.";
                }

                break;

            case "message":

                if (value.length > 500) {
                    message = "Maximum 500 characters allowed.";
                }

                break;

            case "userId":

                if (value.length < 5 || value.length > 20) {
                    message = "User ID must be 5–20 characters.";
                }
                else if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(value)) {
                    message = "Start with a letter. No spaces or special characters.";
                }

                break;

            case "password":

                if (value.length < 8) {
                    message = "Password must contain at least 8 characters.";
                }
                else if (!/[A-Z]/.test(value)) {
                    message = "Include at least one uppercase letter.";
                }
                else if (!/[a-z]/.test(value)) {
                    message = "Include at least one lowercase letter.";
                }
                else if (!/[0-9]/.test(value)) {
                    message = "Include at least one number.";
                }
                else if (value === document.getElementById("userId").value) {
                    message = "Password cannot equal your User ID.";
                }

                break;

            case "confirmPassword":

                if (value !== document.getElementById("password").value) {
                    message = "Passwords do not match.";
                }

                break;
        }

        showError(id, message);

        return message === "";
    }

    // Validate required radio button groups.
    function validateRadioGroup(groupName) {

        const selected = form.querySelector(
            'input[name="' + groupName + '"]:checked'
        );

        const message = selected ? "" : "Please select an option.";

        showError(groupName, message);

        return message === "";
    }

    // Validate every field and count errors.
    function validateEverything() {

        let errorCount = 0;

        fieldIds.forEach(function (id) {

            if (!validateField(id)) {
                errorCount++;
            }

        });

        if (!validateRadioGroup("vaccinated")) {
            errorCount++;
        }

        if (!validateRadioGroup("insurance")) {
            errorCount++;
        }

        return errorCount;
    }

    // Display the registration information.
    function displayPreview() {

        const rows = [
            ["First Name", fname.value],
            ["Middle Initial", mname.value || "Not provided"],
            ["Last Name", lname.value],
            ["Date of Birth", dob.value],
            ["Email", email.value],
            ["Phone", phone.value],
            ["Address", address1.value],
            ["Address Line 2", address2.value || "Not provided"],
            ["City", city.value],
            ["State", state.selectedOptions[0].text],
            ["ZIP Code", zip.value],
            ["Patient Conditions",
                Array.from(document.querySelectorAll(
                    'input[name="conditions"]:checked'
                )).map(item => item.value).join(", ") || "None selected"
            ],
            ["Gender",
                document.querySelector('input[name="gender"]:checked')?.value || "Not provided"
            ],
            ["Vaccinated",
                document.querySelector('input[name="vaccinated"]:checked').value
            ],
            ["Insurance",
                document.querySelector('input[name="insurance"]:checked').value
            ],
            ["Wellbeing Rating", slider.value],
            ["Reason for Visit", message.value || "Not provided"],
            ["User ID", userId.value]
        ];

        const tbody = document.getElementById("outputTableBody");

        tbody.replaceChildren();

        rows.forEach(function (row) {

            const tr = document.createElement("tr");

            const heading = document.createElement("th");
            const data = document.createElement("td");

            heading.textContent = row[0];
            data.textContent = row[1];

            tr.append(heading, data);

            tbody.appendChild(tr);

        });

        document.getElementById("outputContent").hidden = false;

        document.getElementById("outputIntro").textContent =
            "All fields passed validation. Review your information before submitting.";

    }

    // VALIDATE BUTTON
    validateButton.addEventListener("click", function () {

        formMessage.textContent = "";

        const errorCount = validateEverything();

        if (errorCount > 0) {

            submitButton.hidden = true;

            formMessage.textContent =
                "Please correct " + errorCount +
                " error(s) before submitting.";

            document.getElementById("outputContent").hidden = true;

        }
        else {

            formMessage.textContent =
                "Validation successful! You may now submit.";

            displayPreview();

            submitButton.hidden = false;

        }

    });

    // SUBMIT BUTTON
    submitButton.addEventListener("click", function () {

        const errorCount = validateEverything();

        if (errorCount === 0) {

            window.location.href = "thankyou.html";

        }
        else {

            submitButton.hidden = true;

            formMessage.textContent =
                "Please correct the errors before submitting.";

        }

    });

    // CLEAR FORM BUTTON
    form.addEventListener("reset", function () {

        setTimeout(function () {

            fieldIds.forEach(function (id) {
                showError(id, "");
            });

            showError("vaccinated", "");
            showError("insurance", "");

            submitButton.hidden = true;

            formMessage.textContent = "";

            document.getElementById("outputContent").hidden = true;

            sliderValue.textContent = slider.value;

        }, 0);

    });

});
