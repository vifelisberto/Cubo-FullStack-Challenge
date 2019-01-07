// var getPromise = getData();

// const getResult = await getPromise();

// async function getData() {
//     //get data

//     return Promise()
// }
let participations = getData();

initTable();
initGraph();

function getData() {
    return [{ "id": 1, "firstName": "Vinicius", "lastName": "Felisberto", "participation": 30 },
    { "id": 2, "firstName": "Vinicius", "lastName": "Felisberto", "participation": 50 }];
}

function initTable() {
    let tbody = document.querySelector('div.table table tbody');

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

function initGraph(){
    let names = participations.map(function (item) { return item.firstName; });
    let percentage = participations.map(function (item) { return item.participation; });
    let colors = [];
    
    for(let i = 0; i < participations.length; i++) {
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

function reload(){
    participations = getData();

    initTable();
    initGraph();
}

/**
 * reference https://stackoverflow.com/questions/1484506/random-color-generator
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  