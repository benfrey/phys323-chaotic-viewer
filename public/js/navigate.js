function init() {
    if(document.getElementById("NextYear") !== null) {
        document.getElementById("NextYear").addEventListener("click", navigateNextYear, false);
    }
    if(document.getElementById("PrevYear") !== null) {
        document.getElementById("PrevYear").addEventListener("click", navigatePreviousYear, false);
    }
    if(document.getElementById("state-submit") !== null) {
        document.getElementById("state-submit").addEventListener("click", stateSubmit, false);
    }
    if(document.getElementById("state-input") !== null) {
        document.getElementById("state-input").addEventListener("keyup", stateInput, false)
    }
    if(document.getElementById("year-submit") !== null) {
        document.getElementById("year-submit").addEventListener("click", yearSubmit, false);
    }
    if(document.getElementById("NextState") !== null) {
        document.getElementById("NextState").addEventListener("click", navigateNextState, false);
    }
    if(document.getElementById("PrevState") !== null) {
        document.getElementById("PrevState").addEventListener("click", navigatePrevState, false);
    }

    if(document.getElementById("NextSource") !== null) {
        document.getElementById("NextSource").addEventListener("click", navigateNextSource, false);
    }

    if(document.getElementById("PrevSource") !== null) {
        document.getElementById("PrevSource").addEventListener("click", navigatePrevSource, false);
    }

    if(document.getElementById("year-label") !== null) {
        document.getElementById("year-label").addEventListener("keyup", yearInput, false)
    }
}

function navigateNextYear(event) {
    if (parseInt(document.getElementById("header").innerHTML) == 2018) {
        location.href = "http://localhost:8000/year/1960";
    } else {
        location.href = "http://localhost:8000/year/" + (parseInt(document.getElementById("header").innerHTML) + 1);
    }
}

function navigatePreviousYear(event) {
    if(parseInt(document.getElementById("header").innerHTML) == 1960) {
        location.href = "http://localhost:8000/year/2018";
    } else {
        location.href = "http://localhost:8000/year/" + (parseInt(document.getElementById("header").innerHTML) - 1);
    }
}

function navigateNextState(event) {
    let i;
    let cs = window.location.href.split("/")[4].toUpperCase();
    for (i = 0; i < document.getElementById("state-option").options.length; i++) {
        if (document.getElementById("state-option").options[i].value == cs) {
            if (cs == "WY") {
                location.href = "http://localhost:8000/state/AK";
            } else {
                location.href = "http://localhost:8000/state/" + document.getElementById("state-option").options[i + 1].value;
            }
        }
    }
}

function navigatePrevState(event) {
    let i;
    let cs = window.location.href.split("/")[4].toUpperCase();
    for (i = 0; i < document.getElementById("state-option").options.length; i++) {
        if (document.getElementById("state-option").options[i].value == cs) {
            if (cs == "AK") {
                location.href = "http://localhost:8000/state/WY";
            } else {
                location.href = "http://localhost:8000/state/" + document.getElementById("state-option").options[i - 1].value;
            }
        }
    }
}

function stateSubmit(event) {
    location.href = "http://localhost:8000/state/" + document.getElementById("state-input").value;
}

function stateInput(event) {
    if(event.keyCode == 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        document.getElementById("state-submit").click();
    }
}

function yearInput(event) {
    if(event.keyCode == 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        document.getElementById("year-submit").click();
    }
}

function yearSubmit(event) {
    location.href = "http://localhost:8000/year/" + parseInt(document.getElementById("year-label").value)
}

function navigateNextSource(event) {
    let i;
    let cs = window.location.href.split("/")[4].toLowerCase();
    for (i = 0; i < document.getElementById("energy-type-label").options.length; i++) {
        if (document.getElementById("energy-type-label").options[i].value.toLowerCase() == cs.toLowerCase()) {
            if (cs.toLowerCase() == "renewable") {
                location.href = "http://localhost:8000/energy/coal";
            } else {
                location.href = "http://localhost:8000/energy/" + document.getElementById("energy-type-label").options[i + 1].value.toLowerCase();
            }
        }
    }
}

function navigatePrevSource(event) {
    console.log("navigate prev source");
    let i;
    let cs = window.location.href.split("/")[4].toLowerCase();
    for (i = 0; i < document.getElementById("energy-type-label").options.length; i++) {
        if (document.getElementById("energy-type-label").options[i].value.toLowerCase() == cs.toLowerCase()) {
            if (cs.toLowerCase() == "coal") {
                location.href = "http://localhost:8000/energy/renewable";
            } else {
                location.href = "http://localhost:8000/energy/" + document.getElementById("energy-type-label").options[i - 1].value.toLowerCase();
            }
        }
    }
}