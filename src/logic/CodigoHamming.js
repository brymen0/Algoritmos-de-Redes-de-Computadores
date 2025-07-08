function calcularBitsRedundantes(m) {
  let r = 0;
  while (m + r + 1 > Math.pow(2, r)) {
    r++;
  }
  return r;
}

function generarMultiplos2(r) {
  return Array.from({ length: r }, (_, i) => 2 ** i);
}

function llenarPrimeraFila(matriz, trama, multiplos2, n) {
  let iTrama = 0;
  for (let i = 0; i < n; i++) {
    if (!multiplos2.includes(i + 1)) {
      matriz[0][i] = trama[iTrama++];
    }
  }
}

function positionMultiple2(multiplos2, numero) {
  if (numero >= multiplos2[multiplos2.length - 1]) {
    return [multiplos2.length, multiplos2[multiplos2.length - 1]];
  }
  for (let i = 0; i < multiplos2.length - 1; i++) {
    if (numero >= multiplos2[i] && multiplos2[i + 1] > numero) {
      return [i + 1, multiplos2[i]];
    }
  }
}

function llenarFilas(matriz, multiplos2, n) {
  for (let col = 0; col < n; col++) {
    if (matriz[0][col] !== null) {
      let residuo = col + 1;
      while (residuo !== 0) {
        const [pos, multiplo] = positionMultiple2(multiplos2, residuo);
        matriz[pos][col] = matriz[0][col];
        residuo -= multiplo;
      }
    }
  }
}

function contarUnosPar(row, matriz, n) {
  let unos = 0;
  for (let col = 0; col < n; col++) {
    if (matriz[row][col] === 1) unos++;
  }
  return unos % 2 === 0;
}

function completarBitsParidad(matriz, bitsParidad, n) {
  let row = 1;
  for (let col = 0; col < n; col++) {
    if (matriz[0][col] === null) {
      matriz[row][col] = contarUnosPar(row, matriz, n) ? 0 : 1;
      bitsParidad.push(matriz[row][col]);
      row++;
    }
  }
}

function subirBitsParidad(matriz, trama, n) {
  trama.length = 0;
  trama.push(...matriz[0]);
  let row = 1;
  for (let col = 0; col < n; col++) {
    if (trama[col] === null) {
      trama[col] = matriz[row][col];
      row++;
    }
  }
  matriz[0] = [...trama];
}

function deepCopyMatrix(matrix) {
  return matrix.map(row => [...row]);
}

function construirMatriz(trama, multiplos2, n, r, matriz, bitsParidad, tramaRellena) {
  llenarPrimeraFila(matriz, trama, multiplos2, n);
  //console.log("Llenada priemera fila: ", deepCopyMatrix(matriz))
  llenarFilas(matriz, multiplos2, n);
  //console.log("Llenada las filas: ",deepCopyMatrix(matriz))
  completarBitsParidad(matriz, bitsParidad, n);
  //console.log("Completar los bits de paridad: ",deepCopyMatrix(matriz))
  subirBitsParidad(matriz, tramaRellena, n);
  //console.log("Subir los bits de paridad: ",deepCopyMatrix(matriz))
}

function detectarError(bitsParidadEmisor, bitsParidadReceptor) {
  const errores = bitsParidadEmisor.map((bit, i) => bit === bitsParidadReceptor[i] ? 0 : 1);
  const bitError = errores.reduce((acc, bit, i) => acc + bit * (2 ** i), 0);
  return bitError;
}

function corregirTrama(trama, bitErroneo) {
  const corregida = [...trama];
  corregida[bitErroneo - 1] = corregida[bitErroneo - 1] === 0 ? 1 : 0;
  return corregida;
}

function obtenerDato(trama, multiplos2) {
  return trama.filter((_, i) => !multiplos2.includes(i + 1));
}

function danarTrama(trama, bit) {
  const dañada = [...trama];
  //dañada[bit - 1] = dañada[bit - 1] === 0 ? 1 : 0;
  dañada[bit] = dañada[bit] === 0 ? 1 : 0;
  return dañada;
}

function crearMatriz(filas, columnas) {
  return Array.from({ length: filas }, () => Array.from({ length: columnas }).fill(null));
}

export function codigoHamming(tramaOriginal, bitDañado = null) {
  const m = tramaOriginal.length;
  const r = calcularBitsRedundantes(m);
  const n = m + r;
  const multiplos2 = generarMultiplos2(r);
  //console.log(m,r,n,multiplos2)
  const matrizEmisor = crearMatriz(r + 1, n);
  //console.log("Solo null: ",deepCopyMatrix(matrizEmisor))
  const tramaRellenaEnviar = [];
  const bitsParidadEmisor = [];
  construirMatriz(tramaOriginal, multiplos2, n, r, matrizEmisor, bitsParidadEmisor, tramaRellenaEnviar);

  let tramaDanada = tramaRellenaEnviar;
  if (bitDañado !== null) {
    tramaDanada = danarTrama(tramaRellenaEnviar, bitDañado);
  }

  const matrizReceptor = crearMatriz(r + 1, n);
  const bitsParidadReceptor = [];
  const tramaRellenaReceptor = [];
  construirMatriz(obtenerDato(tramaDanada, multiplos2), multiplos2, n, r, matrizReceptor, bitsParidadReceptor, tramaRellenaReceptor);

  const bitErroneo = detectarError(bitsParidadEmisor, bitsParidadReceptor);
  const tramaCorregida = corregirTrama(tramaRellenaReceptor, bitErroneo);
  const datoFinal = obtenerDato(tramaCorregida, multiplos2);

  return {
    tramaCodificada: tramaRellenaEnviar,
    multiplos2,
    tramaDañada: tramaDanada,
    bitErroneo,
    tramaCorregida,
    datoFinal,
    matrizEmisor,
    matrizReceptor
  };
}