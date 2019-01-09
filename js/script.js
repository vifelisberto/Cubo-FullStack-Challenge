(async () => {
    await reload();
})();

/**
 * Mount Table
 * @param {Array} participations - Data
 * @returns {void}
 */
function initTable(participations) {
    let tbody = document.querySelector('div.table table tbody');
    tbody.innerHTML = '';

    for (participation of participations) {
        let tr = document.createElement("tr");

        let idTd = document.createElement("td");
        let firstNameTd = document.createElement("td");
        let lastNameTd = document.createElement("td");
        let participationTd = document.createElement("td");

        idTd.innerText = participation.id;
        firstNameTd.innerText = participation.firstName;
        lastNameTd.innerText = participation.lastName;
        participationTd.innerText = `${participation.participation}%`;

        tr.appendChild(idTd);
        tr.appendChild(firstNameTd);
        tr.appendChild(lastNameTd);
        tr.appendChild(participationTd);

        tbody.appendChild(tr);
    }
}

/**
 * Mount graph
 * @param {Array} participations - Data
 * @returns {void}
 */
function initGraph(participations) {
    let names = participations.map(function (item) { return item.firstName; });
    let percentage = participations.map(function (item) { return item.participation; });
    let colors = [];

    for (let i = 0; i < participations.length; i++) {
        colors.push(getRandomColor());
    }

    let data = {
        labels: names,
        datasets: [{
            label: 'Participation',
            data: percentage,
            backgroundColor: colors,
            borderWidth: 3
        }]
    };

    let options = {
        layout: {
            padding: {
                left: 50,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        legend: {
            position: "right",
            labels: {
                usePointStyle: true,
                fontSize: 17,
                padding: 15,
            }

        }
    };

    let ctx = document.getElementById("myChart").getContext('2d');
    let myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

async function reload() {
    let participations = await getData();

    if (participations && participations.Count > 0) {
        initTable(participations.Items);
        initGraph(participations.Items);
    } else {

    }
}

/**
 * Get data for API
 * @returns {Array} Array the participations
 */
async function getData() {
    let response = await fetch('https://p2qeldjm6f.execute-api.us-east-1.amazonaws.com/dev/');
    const json = await response.json();

    return json;
}

/**
 * Random Color
 * - Reference:e https://stackoverflow.com/questions/1484506/random-color-generator
 * @returns {String} color random
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
