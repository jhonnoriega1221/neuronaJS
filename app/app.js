angular.module('neuronajs', [])

    .controller('neuronajsController', function($scope) {

        $scope.epocasData = [];

        let init = function() {

            
            /*
             1  1  1 =  1
             1  1 -1 =  1
             1 -1  1 =  1
            -1  1  1 =  1
            -1  1 -1 =  1
            -1 -1  1 = -1
             1 -1 -1 =  1
            -1 -1 -1 =  1
            */

            let epocasLabel = ['Epoca 0'];
            let errorEpocasLabel = ['1000'];
            let patronesData = [];
            $scope.sesgoCalibrado = '';
            $scope.pesosCalibrados = [];

            let entrada = [ //Entradas de la neurona (P)
                [1, 1, 1],
                [1, 1, -1],
                [1, -1, 1],
                [-1, 1, 1],
                [-1, 1, -1],
                [-1, -1, 1],
                [1, -1, -1],
                [-1, -1, -1],
            ];

            let deseado = [ //Valores deseados (Target)
                1,
                1,
                1,
                1,
                1,
                -1,
                1,
                1
            ];

            let neurona = {
                peso: [],
                sesgo: null,
                init: function(numPesos) {
                    for (let i = 0; i < numPesos; i++) {
                        this.peso[i] = Math.random() * (1 - (-1)) + (-1);
                    }
                    this.sesgo = Math.random();
                }
            };

            function hardlim(input) {
                con
                if (input > 0)
                    return 1;
                else
                    return 0;
            }

            function hardlims(input) {
                if (input > 0)
                    return 1;
                else
                    return -1;
            }

            neurona.init(entrada[0].length); //Inicializamos la neurona con la cantidad de valores del primer conjunto de datos
            let errorGlobalPermitido = 0.1; //Error global colocado por uno mismo
            let errorGlobal = 1000; //Inicializamos el error de cada epoca
            let errorPatron = 0; //Inicializamos el error del patron
            let patron = 0; //Inicializamos el contador de patrones
            let epoca = 0; //Inicializamosel contador de épocas
            let calculado = 0; //Inicializamos el valor calculado del patron
            console.log('\n\n\t---------------------------------Epoca', epoca + 1, '------------------------------------')

            while (errorGlobal >= errorGlobalPermitido) { //Mientras el error global sea mayor o igual al error permitido
                console.log(`\n\n%c------Patrón ${patron+1}-----`, 'color: grey')
                console.log('Entradas P', patron + 1, ':', entrada[patron]);
                console.log('Pesos:', neurona.peso)
                console.log('Sesgo:', neurona.sesgo)
                //Calculamos la salida de la red
                calculado = 0;
                for (let i = 0; i < 3; i++) {
                    calculado += entrada[patron][i] * neurona.peso[i];
                }
                calculado += neurona.sesgo;

                //Aplicamos hardlims
                calculado = (hardlims(calculado));

                //Comparamos valores deseado y calculado
                console.log(`%cSalida deseada (T): ${deseado[patron]}`, 'color:lightblue');
                console.log(`%cSalida calculada (Y): ${calculado}`, 'color:lightblue');
                let patronData = [
                    { title: 'Entradas', value: "" },
                    { title: 'Pesos', value: [] },
                    { title: 'Sesgo', value: '' },
                    { title: 'Salida deseada', value: '' },
                    { title: 'Salida calculada', value: '' },
                    { isEating: true },
                    { title: 'Error', value: '' },
                    { title: 'Nuevo peso', value: [] },
                    { title: 'Nuevo sesgo', value: '' }
                ];

                //Nombre
                patronData[0].value = `${entrada[patron][0]} ${entrada[patron][1]} ${entrada[patron][2]}`;
                //Peso
                patronData[1].value = [];
                for (let i = 0; i < 3; i++) {
                    patronData[1].value.push(`${neurona.peso[i]}`);
                }
                //Sesgo
                patronData[2].value = `${neurona.sesgo}`;
                //Salida deseada
                patronData[3].value = `${deseado[patron]}`;
                //Salida calculada
                patronData[4].value = `${calculado}`;


                //Si la salida calculada no es la correcta
                if (calculado != deseado[patron]) {
                    //Salida calculada
                    patronData[5].isEating = false;
                    //Se ajustan los pesos y el bias, y se calcula el error
                    console.log('%c*Requiere entrenamiento*', 'color:red')
                    let nuevoPeso = [];
                    let nuevoSesgo = null;
                    errorPatron = deseado[patron] - calculado;
                    patronData[6].value = `${errorPatron}`;
                    //Calculamos los nuevos pesos
                    patronData[7].value = [];
                    for (let i = 0; i < 3; i++) {
                        nuevoPeso[i] = neurona.peso[i] + errorPatron * entrada[patron][i];
                        patronData[7].value.push(`${nuevoPeso[i]}`);
                    }
                    nuevoSesgo = neurona.sesgo + errorPatron;
                    patronData[8].value = `${nuevoSesgo}`;

                    $scope.sesgoCalibrado = nuevoSesgo;
                    $scope.pesosCalibrados = nuevoPeso;

                    //Reemplazamos
                    neurona.peso = nuevoPeso;
                    neurona.sesgo = nuevoSesgo;

                    console.log('Error (e):', errorPatron)
                    console.log('Nuevo peso (Wn):', nuevoPeso);
                    console.log('Nuevo sesgo (biasn)', nuevoSesgo)
                } else {
                    console.log('%c*No requiere entrenamiento*', 'color:green')
                    patronData[5].isEating = true;
                }

                patronesData.push(patronData);

                patron++;
                //Cuando termine la época
                if (patron == 8) {
                    patron = 0;
                    errorGlobal = errorGlobal / entrada.length;
                    let newPatronesData = patronesData;

                    let epocaData = {
                        errorGlobal: '',
                        patrones: []
                    };
                    epocaData.errorGlobal = errorGlobal;
                    epocaData.patrones = newPatronesData;

                    $scope.epocasData.push(epocaData);
                    console.warn($scope.epocasData)
                    patronesData = [];

                    

                    console.log(`\n%cError global: ${errorGlobal}`, 'color: yellow');
                    epocasLabel.push(`Época ${epoca+1}`);
                    errorEpocasLabel.push(errorGlobal)
                    
                    epoca++;
                    console.log('\n\n\t\t------------------------------------Epoca', epoca + 1, '-------------------------------------')
                }
            }

            //Se crea la grafica del error
            var data = {
                // A labels array that can contain any sort of values
                labels: epocasLabel,
                // Our series array that contains series objects or in this case series data arrays
                series: [
                  errorEpocasLabel
                ]
              };
              
              // As options we currently only set a static size of 300x200 px. We can also omit this and use aspect ratio containers
              // as you saw in the previous example
              var options = {
                width: 450,
                height: 360
              };
              
              // Create a new line chart object where as first parameter we pass in a selector
              // that is resolving to our chart container element. The Second parameter
              // is the actual data object. As a third parameter we pass in our custom options.
              new Chartist.Line('.ct-chart', data, options);

              //----------------------------

              const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: epocasLabel,
        datasets: [{
            label: 'Error',
            data: errorEpocasLabel,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
        }

        init();

    });