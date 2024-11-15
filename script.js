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

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referências do Realtime Database
const airTempRef = database.ref('sensors/airTemperature');
const airHumRef = database.ref('sensors/airHumidity');
const soilMoistRef = database.ref('sensors/soilMoisture');
const pumpStatusRef = database.ref('control/pumpStatus');
const ledStatusRef = database.ref('control/ledStatus');
const soilMoistThresholdOnRef = database.ref('control/soilMoistThresholdOn');
const soilMoistThresholdOffRef = database.ref('control/soilMoistThresholdOff');
const lastTimestampRef = database.ref('/status/lastTimestamp');
const autoModeRef = database.ref('control/autoMode');
// Referências aos dados de sensores no Firebase
const airTempGraphRef = firebase.database().ref('/sensordatabase/airTemperature');
const airHumidityGraphRef = firebase.database().ref('/sensordatabase/airHumidity');
const soilMoistureGraphRef = firebase.database().ref('/sensordatabase/soilMoisture');


// Atualizar os valores na página
airTempRef.on('value', (snapshot) => {
    document.getElementById('airTemperature').textContent = snapshot.val();
});

airHumRef.on('value', (snapshot) => {
    document.getElementById('airHumidity').textContent = snapshot.val();
});

soilMoistRef.on('value', (snapshot) => {
    document.getElementById('soilMoisture').textContent = snapshot.val();
});

pumpStatusRef.on('value', (snapshot) => {
    const status = snapshot.val() ? "Ligada" : "Desligada";
    document.getElementById('pumpStatusValue').textContent = status;
});

ledStatusRef.on('value', (snapshot) => {
    const status = snapshot.val() ? "Ligado" : "Desligado";
    document.getElementById('ledStatusValue').textContent = status;
});



// Controle Manual do LED
document.getElementById('toggleLED').addEventListener('click', () => {
    lastTimestampRef.once('value').then(snapshot => {
        const lastTimestamp = snapshot.val() * 1000; // Convertendo segundos para milissegundos
        const currentTime = Date.now();

        if (currentTime - lastTimestamp <= 10000) { // Se o ESP32 estiver online
            ledStatusRef.once('value').then(snapshot => {
                const newStatus = !snapshot.val();
                ledStatusRef.set(newStatus);
            });
        } else {
            alert("O ESP32 está desconectado, não é possível mudar o status do LED.");
        }
    });
});

// Controle Manual da Bomba
document.getElementById('togglePump').addEventListener('click', () => {
    lastTimestampRef.once('value').then(snapshot => {
        const lastTimestamp = snapshot.val() * 1000; // Convertendo segundos para milissegundos
        const currentTime = Date.now();

        if (currentTime - lastTimestamp <= 10000) { // Se o ESP32 estiver online
            pumpStatusRef.once('value').then(snapshot => {
                const newStatus = !snapshot.val();
                pumpStatusRef.set(newStatus);
            });
        } else {
            alert("O ESP32 está desconectado, não é possível mudar o status da bomba.");
        }
    });
});

// Atualizar os limiares na página
soilMoistThresholdOnRef.on('value', (snapshot) => {
    document.getElementById('thresholdOn').value = snapshot.val();
    document.getElementById('thresholdOnDisplay').textContent = snapshot.val();
});

soilMoistThresholdOffRef.on('value', (snapshot) => {
    document.getElementById('thresholdOff').value = snapshot.val();
    document.getElementById('thresholdOffDisplay').textContent = snapshot.val();
});

// Atualizar o display e enviar para o Firebase automaticamente enquanto arrasta os sliders
document.getElementById('thresholdOn').addEventListener('input', function() {
    const thresholdOnValue = parseFloat(this.value);
    const thresholdOffValue = parseFloat(document.getElementById('thresholdOff').value);

    if (thresholdOnValue >= thresholdOffValue - 6) {
        const newThresholdOff = thresholdOnValue + 6;
        document.getElementById('thresholdOff').value = newThresholdOff;
        document.getElementById('thresholdOffDisplay').textContent = newThresholdOff;
        soilMoistThresholdOffRef.set(newThresholdOff);
    }

    document.getElementById('thresholdOnDisplay').textContent = thresholdOnValue;
    soilMoistThresholdOnRef.set(thresholdOnValue);
});

document.getElementById('thresholdOff').addEventListener('input', function() {
    const thresholdOffValue = parseFloat(this.value);
    const thresholdOnValue = parseFloat(document.getElementById('thresholdOn').value);

    if (thresholdOffValue <= thresholdOnValue + 6) {
        const newThresholdOff = thresholdOnValue + 6;
        document.getElementById('thresholdOff').value = newThresholdOff;
        document.getElementById('thresholdOffDisplay').textContent = newThresholdOff;
        soilMoistThresholdOffRef.set(newThresholdOff);
    } else {
        document.getElementById('thresholdOffDisplay').textContent = thresholdOffValue;
        soilMoistThresholdOffRef.set(thresholdOffValue);
    }
});

// Atualizar o timestamp de última verificação
lastTimestampRef.on('value', (snapshot) => {
    const timestamp = snapshot.val();
    const date = new Date(timestamp * 1000); // Multiplica por 1000 para converter de segundos para milissegundos
    const formattedDate = date.toLocaleString(); // Formata para uma string legível
    document.getElementById('lastCheckTime').textContent = formattedDate;
});


// Abrir e fechar o menu de personalização
document.getElementById('openMenu').addEventListener('click', () => {
    document.getElementById('customizationMenu').classList.add('open');
});

document.getElementById('closeMenu').addEventListener('click', () => {
    document.getElementById('customizationMenu').classList.remove('open');
});

// Controlar o tamanho da fonte
document.getElementById('fontSize').addEventListener('input', (event) => {
    document.body.style.fontSize = event.target.value + 'px';
});

// Controlar a cor da fonte
document.getElementById('fontColor').addEventListener('input', (event) => {
    document.body.style.color = event.target.value;
});

// Controlar a cor dos cards
document.getElementById('cardColor').addEventListener('input', (event) => {
    document.querySelectorAll('.card').forEach(card => {
        card.style.backgroundColor = event.target.value;
    });
});

// Controlar o tamanho dos cards
document.getElementById('cardSize').addEventListener('input', (event) => {
    document.querySelectorAll('.card').forEach(card => {
        card.style.width = event.target.value + 'px';
    });
});

// Aplicar estilos predefinidos
document.getElementById('applyPreset1').addEventListener('click', () => {
    document.body.style.fontSize = '18px';
    document.body.style.color = '#333';
    document.querySelectorAll('.card').forEach(card => {
        card.style.backgroundColor = '#f0f8ff';
        card.style.width = '300px';
    });
});

document.getElementById('applyPreset2').addEventListener('click', () => {
    document.body.style.fontSize = '20px';
    document.body.style.color = '#555';
    document.querySelectorAll('.card').forEach(card => {
        card.style.backgroundColor = '#e0e0e0';
        card.style.width = '350px';
    });
});


// Adiciona um evento de clique ao botão
document.getElementById("applyPreset3").addEventListener("click", function() {
    // Redireciona para a página dados_sensores.html
    window.location.href = "dados_sensores.html";
});