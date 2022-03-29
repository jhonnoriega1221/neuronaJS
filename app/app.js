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

            let patronesData = []

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
                //Valores calibrados = peso [1.7896220958930784, 1.9336716392097655, -2.45883480475384]
                //sesgo = 2.809791683002823
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

            while (errorGlobal > errorGlobalPermitido) { //Mientras el error global sea mayor al error permitido
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
                    patronData[8].value = `${nuevoSesgo}`

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
                    epoca++;
                    console.log('\n\n\t\t------------------------------------Epoca', epoca + 1, '-------------------------------------')
                }
            }
        }

        init();

    });