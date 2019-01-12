/**
 * @author Vinicius Felisberto
 * Jan/2019
 */
const urlApi = 'https://p2qeldjm6f.execute-api.us-east-1.amazonaws.com/dev';
let graph;

(async () => {
    let form = document.getElementById('formParticipation');
    form.onsubmit = async (event) => {
        event.preventDefault();
        await postData();
    };

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

    let count = 1;
    for (participation of participations) {
        let tr = document.createElement('tr');

        let idTd = document.createElement('td');
        let firstNameTd = document.createElement('td');
        let lastNameTd = document.createElement('td');
        let participationTd = document.createElement('td');
        let deleteTd = document.createElement('td');
        let spanDelete = document.createElement('span');

        idTd.innerText = count++; // participation.id; - Devido o ID do dynamoDB ser uuid, optei por exibir um count
        firstNameTd.innerText = participation.firstName;
        lastNameTd.innerText = participation.lastName;
        participationTd.innerText = `${participation.participation}%`;
        spanDelete.className = 'delete-icon';
        spanDelete.onclick = async () => {
            await deleteItem(participation.id, spanDelete);
            await reload();
        };
        spanDelete.title = 'Delete';

        tr.appendChild(idTd);
        tr.appendChild(firstNameTd);
        tr.appendChild(lastNameTd);
        tr.appendChild(participationTd);
        deleteTd.appendChild(spanDelete);
        tr.appendChild(deleteTd);

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

    if (graph) {
        removeData(graph);
        addData(graph, data);
    }
    else {
        let ctx = document.getElementById("myChart").getContext('2d');
        graph = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });
    }
}

/**
 * Reload data the table and graph
 * @returns {voide}
 */
async function reload() {
    let participations = await getData();
    let section = document.querySelector('body > section.tableGraph');
    if (participations && participations.Count > 0) {
        section.style.display = 'flex';

        let span = document.getElementById('spanWarning');
        if (span)
            span.parentElement.removeChild(span);

        initTable(participations.Items);
        initGraph(participations.Items);
    } else {
        section.style.display = 'none';
        let sectionDesc = document.querySelector('body > section.description');
        let span = document.createElement('span');
        span.id = 'spanWarning';
        span.innerText = 'Please enter participation!';
        span.style.color = '#e8a115';

        sectionDesc.parentNode.insertBefore(span, sectionDesc.nextSibling);
    }
}

/**
 * Post data
 * @returns {void}
 */
async function postData() {
    let form = document.querySelectorAll('#formParticipation input');
    form.forEach((input) => { input.disabled = true });
    let btnForm = document.getElementById('btnForm');
    btnForm.disabled = true;
    btnForm.className = 'signin-spinner-white'
    btnForm.style.opacity = '0.8';

    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let participation = document.getElementById('participation');

    const response = await fetch(urlApi, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'firstName': firstName.value, 'lastName': lastName.value, 'participation': Number(participation.value) })
    });

    const status = await response.status;
    debugger;
    if (status !== 201) {
        let responseJson = await response.json();
        if (responseJson.message) {
            if (responseJson.message === 'limit max participation.')
                alert('limit participation reached! Try a smaller amount if the sum of the shares did not reach 100%');
            else if (responseJson.message === 'value participation is invalid.')
                alert(responseJson.message);
            else
                alert('error insert');
        }
    }
    else {
        await reload();
    }

    firstName.value = '';
    lastName.value = '';
    participation.value = '';

    btnForm.disabled = false;
    btnForm.className = '';
    btnForm.style.opacity = '1';
    form.forEach((input) => { input.disabled = false });
}

/**
 * Get data for API
 * @returns {Array} Array the participations
 */
async function getData() {
    let response = await fetch(urlApi);
    const json = await response.json();

    return json;
}

async function deleteItem(id, btnDelete) {
    btnDelete.disabled = true;
    btnDelete.className = 'signin-spinner-white'
    btnDelete.style.opacity = '0.8';

    const response = await fetch(urlApi, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'id': id })
    });
    const status = await response.status;
    if (status !== 200)
        alert('error delete');
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

/**
 * 
 * @param {Chart} chart Instance graph
 */
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

/**
 * 
 * @param {Chart} chart  Instance graph
 * @param {Object} data Data graph
 */
function addData(chart, data) {
    chart.data = data;
    chart.update();
}