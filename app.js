// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA2oGyVEpGTovNyJF-dsfWT5HYVrjMzy1U",
    authDomain: "esp32irrigacao.firebaseapp.com",
    databaseURL: "https://esp32irrigacao-default-rtdb.firebaseio.com",
    projectId: "esp32irrigacao",
    storageBucket: "esp32irrigacao.appspot.com",
    messagingSenderId: "199685322939",
    appId: "1:199685322939:web:b0a7ee3aeb2c420683519e"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const airTempRef = database.ref('/sensordatabase/airTemperature');
const airHumidityRef = database.ref('/sensordatabase/airHumidity');
const soilMoistureRef = database.ref('/sensordatabase/soilMoisture');

// Função para buscar dados e atualizar o gráfico
function updateChart(ref, chart, label) {
    ref.once('value', (snapshot) => {
        const data = snapshot.val();
        const labels = [];
        const chartData = [];

        if (data) {
            for (let key in data) {
                const entry = data[key].split(",");
                const value = parseFloat(entry[0]);
                const timestamp = new Date(parseInt(entry[1]) * 1000); // Converte o timestamp

                labels.push(timestamp);
                chartData.push(value);
            }
        }

        // Atualiza os dados do gráfico
        chart.data.labels = labels;
        chart.data.datasets[0].data = chartData;
        chart.update();
    });
}

// Criação dos gráficos com Chart.js
const tempCtx = document.getElementById('tempChart').getContext('2d');
const tempChart = new Chart(tempCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperatura do Ar (°C)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'yyyy-MM-dd HH:mm',
                    displayFormats: {
                        minute: 'HH:mm',
                        hour: 'HH:mm',
                        day: 'yyyy-MM-dd'
                    }
                },
                title: {
                    display: true,
                    text: 'Data e Hora'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Temperatura do Ar (°C)'
                }
            }
        }
    }
});

const humidityCtx = document.getElementById('humidityChart').getContext('2d');
const humidityChart = new Chart(humidityCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Umidade do Ar (%)',
            data: [],
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'yyyy-MM-dd HH:mm',
                    displayFormats: {
                        minute: 'HH:mm',
                        hour: 'HH:mm',
                        day: 'yyyy-MM-dd'
                    }
                },
                title: {
                    display: true,
                    text: 'Data e Hora'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Umidade do Ar (%)'
                }
            }
        }
    }
});

const soilMoistureCtx = document.getElementById('soilMoistureChart').getContext('2d');
const soilMoistureChart = new Chart(soilMoistureCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Umidade do Solo (%)',
            data: [],
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'yyyy-MM-dd HH:mm',
                    displayFormats: {
                        minute: 'HH:mm',
                        hour: 'HH:mm',
                        day: 'yyyy-MM-dd'
                    }
                },
                title: {
                    display: true,
                    text: 'Data e Hora'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Umidade do Solo (%)'
                }
            }
        }
    }
});

// Mapeia o intervalo do slider para as opções de tempo
function getTimeRange(days) {
    const now = new Date().getTime();
    let startTime;

    switch (days) {
        case 0: // 1h
            startTime = now - (1 * 60 * 60 * 1000); break;
        case 1: // 2h
            startTime = now - (2 * 60 * 60 * 1000); break;
        case 2: // 4h
            startTime = now - (4 * 60 * 60 * 1000); break;
        case 3: // 8h
            startTime = now - (8 * 60 * 60 * 1000); break;
        case 4: // 12h
            startTime = now - (12 * 60 * 60 * 1000); break;
        case 5: // 1d
            startTime = now - (1 * 24 * 60 * 60 * 1000); break;
        case 6: // 2d
            startTime = now - (2 * 24 * 60 * 60 * 1000); break;
        case 7: // 4d
            startTime = now - (4 * 24 * 60 * 60 * 1000); break;
        case 8: // 8d
            startTime = now - (8 * 24 * 60 * 60 * 1000); break;
        case 9: // 12d
            startTime = now - (12 * 24 * 60 * 60 * 1000); break;
        case 10: // 1m
            startTime = now - (1 * 30 * 24 * 60 * 60 * 1000); break;
        case 11: // 2m
            startTime = now - (2 * 30 * 24 * 60 * 60 * 1000); break;
        case 12: // 4m
            startTime = now - (4 * 30 * 24 * 60 * 60 * 1000); break;
        case 13: // 8m
            startTime = now - (8 * 30 * 24 * 60 * 60 * 1000); break;
        case 14: // 1a
            startTime = now - (1 * 365 * 24 * 60 * 60 * 1000); break;
        case 15: // 2a
            startTime = now - (2 * 365 * 24 * 60 * 60 * 1000); break;
        case 16: // 3a
            startTime = now - (3 * 365 * 24 * 60 * 60 * 1000); break;
        case 17: // 5a
            startTime = now - (5 * 365 * 24 * 60 * 60 * 1000); break;
        default:
            startTime = now - (1 * 24 * 60 * 60 * 1000); // Default to 1d
    }

    return startTime;
}

// Função para atualizar gráficos com base no slider
function filterDataByTimeRange(days) {
    const startTime = getTimeRange(days);

    const timeFilter = (timestamp) => new Date(timestamp).getTime() >= startTime;

    function filterAndUpdateChart(ref, chart) {
        ref.once('value', (snapshot) => {
            const data = snapshot.val();
            const labels = [];
            const chartData = [];

            if (data) {
                for (let key in data) {
                    const entry = data[key].split(",");
                    const value = parseFloat(entry[0]);
                    const timestamp = new Date(parseInt(entry[1]) * 1000);

                    if (timeFilter(timestamp)) {
                        labels.push(timestamp);
                        chartData.push(value);
                    }
                }
            }

            chart.data.labels = labels;
            chart.data.datasets[0].data = chartData;
            chart.update();
        });
    }

    filterAndUpdateChart(airTempRef, tempChart);
    filterAndUpdateChart(airHumidityRef, humidityChart);
    filterAndUpdateChart(soilMoistureRef, soilMoistureChart);
}

// Inicializa gráficos com intervalo de 1h
filterDataByTimeRange(0);

// Atualiza gráficos quando o slider é movido
document.getElementById('timeRange').addEventListener('input', (event) => {
    const days = parseInt(event.target.value);
    const labels = ["1h", "2h", "4h", "8h", "12h", "1d", "2d", "4d", "8d", "12d", "1m", "2m", "4m", "8m", "1a", "2a", "3a", "5a"];
    document.getElementById('timeRangeValue').textContent = labels[days];
    filterDataByTimeRange(days);
});
window.addEventListener('resize', function() {
    tempChart.resize();
    humidityChart.resize();
    soilMoistureChart.resize();
});
