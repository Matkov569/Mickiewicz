import getStem from "stemmer_pl";

export class AI {
  #messages;
  #micek;
  #slowak;
  #micekMap;
  #slowakMap;
  textInput;
  #normalized;
  #result;
  #txtdata;
  #sample;
  #resultSoft;
  #author;

  constructor(input) {
    this.textInput = input.toLowerCase();
  }

  //funkcja rozpoczynająca
  start() {
    return ["Normalizuję zbiór danych...", this.normalize.name];
  }

  //soft - normalizacja datasetu
  async normalize() {
    await this.#getJSONs();
    this.#normalized = this.#normalizeData(this.#messages);
    return ["Próbkuję zbiór danych...", this.beReady.name];
  }

  async beReady() {
    this.#result = this.#readySoft(this.#normalized, [
      "Mickiewicz",
      "Słowacki",
    ]);
    return ["Przetwarzam podane zdanie...", this.beSteady.name];
  }

  async beSteady() {
    this.#txtdata = this.#textToData(this.textInput);
    return ["Próbkuję podane zdanie...", this.doSample.name];
  }

  async doSample() {
    this.#sample = this.#dataToSample(this.#txtdata[0]);
    return ["Porównuję próbki...", this.decide.name];
  }

  async decide() {
    this.#resultSoft = this.#simplify(
      this.#sample,
      ["Mickiewicz", "Słowacki"],
      this.#result
    );
    return ["Przeprowadzam głosowanie...", this.vote.name];
  }

  async vote() {
    this.#author = this.#voting(
      this.#resultSoft[1],
      this.#txtdata[1],
      this.#txtdata[2],
      [0, 0]
    ); //podmienić na knn
    return ["STOP", this.getResults];
  }

  //zwracanie wyników
  getResults() {
    //[kto, [punkty soft], [punkty dict], [punkty map], [punkty knn], [szczegóły soft]]
    return [
      this.#author[0], //kto
      this.#author[1], //głosowanie
      this.#resultSoft[1], //soft
      this.#txtdata[1], //słowa
      this.#txtdata[2], //mapy
      [0, 0], //knn
      this.#resultSoft[2], //szczegóły soft
    ];
  }

  //funkcje wewnętrzne
  //pobieranie datasetów
  async #getJSONs() {
    await fetch("./AI/dataset.json")
      .then((response) => response.json())
      .then((json) => (this.#messages = json));

    await fetch("./AI/mickiewicz_slowa.json")
      .then((response) => response.json())
      .then((json) => (this.#micek = json));

    await fetch("./AI/slowacki_slowa.json")
      .then((response) => response.json())
      .then((json) => (this.#slowak = json));

    await fetch("./AI/mickiewicz_mapa.json")
      .then((response) => response.json())
      .then((json) => (this.#micekMap = json));

    await fetch("./AI/slowacki_mapa.json")
      .then((response) => response.json())
      .then((json) => (this.#slowakMap = json));
  }

  //soft oznaczanie przedziałów
  #givePoints = (value, point0, point1) => {
    if (value < point1 + 0.01 && value >= point0) return 1;
    else if (
      Math.abs(point0 - value) <= 0.05 ||
      Math.abs(point1 - value) <= 0.05
    )
      return 0.25;
    else return 0;
  };

  //przygotówka do zbiorów miękkich
  #readySoft = (messages, messX) => {
    var messY = [];

    for (let i of messX) {
      // i to kolejne wartości tablicy - autorzy
      messY.push({
        len0: 0,
        len025: 0,
        len05: 0,
        len075: 0,
        w0: 0,
        w025: 0,
        w05: 0,
        w075: 0,
        wA0: 0,
        wA025: 0,
        wA05: 0,
        wA075: 0,
        pl0: 0,
        pl025: 0,
        pl05: 0,
        pl075: 0,
        plA0: 0,
        plA025: 0,
        plA05: 0,
        plA075: 0,
        s0: 0,
        s025: 0,
        s05: 0,
        s075: 0,
        sA0: 0,
        sA025: 0,
        sA05: 0,
        sA075: 0,
      });

      //wybranie obiektów z autorem i
      let data = messages.filter((object) => object.Autor === i);

      let sLen = 0;
      let sW = 0;
      let sWa = 0;
      let sPl = 0;
      let sPlA = 0;
      let sS = 0;
      let sSa = 0;

      for (let v of data) {
        sLen += v["Length"];
        sW += v["WordsCount"];
        sWa += v["WordsLenAvg"];
        sPl += v["PlChars"];
        sPlA += v["PlAvg"];
        sS += v["SpecialChars"];
        sSa += v["SpecialAvg"];
      }

      sLen /= data.length;
      sW /= data.length;
      sWa /= data.length;
      sPl /= data.length;
      sPlA /= data.length;
      sS /= data.length;
      sSa /= data.length;

      let iter = messX.indexOf(i);

      messY[iter]["len0"] = this.#givePoints(sLen, 0, 0.25);
      messY[iter]["len025"] = this.#givePoints(sLen, 0.25, 0.5);
      messY[iter]["len05"] = this.#givePoints(sLen, 0.5, 0.75);
      messY[iter]["len075"] = this.#givePoints(sLen, 0.75, 1);

      messY[iter]["w0"] = this.#givePoints(sW, 0, 0.25);
      messY[iter]["w025"] = this.#givePoints(sW, 0.25, 0.5);
      messY[iter]["w05"] = this.#givePoints(sW, 0.5, 0.75);
      messY[iter]["w075"] = this.#givePoints(sW, 0.75, 1);

      messY[iter]["wA0"] = this.#givePoints(sWa, 0, 0.25);
      messY[iter]["wA025"] = this.#givePoints(sWa, 0.25, 0.5);
      messY[iter]["wA05"] = this.#givePoints(sWa, 0.5, 0.75);
      messY[iter]["wA075"] = this.#givePoints(sWa, 0.75, 1);

      messY[iter]["pl0"] = this.#givePoints(sPl, 0, 0.25);
      messY[iter]["pl025"] = this.#givePoints(sPl, 0.25, 0.5);
      messY[iter]["pl05"] = this.#givePoints(sPl, 0.5, 0.75);
      messY[iter]["pl075"] = this.#givePoints(sPl, 0.75, 1);

      messY[iter]["plA0"] = this.#givePoints(sPlA, 0, 0.25);
      messY[iter]["plA025"] = this.#givePoints(sPlA, 0.25, 0.5);
      messY[iter]["plA05"] = this.#givePoints(sPlA, 0.5, 0.75);
      messY[iter]["plA075"] = this.#givePoints(sPlA, 0.75, 1);

      messY[iter]["s0"] = this.#givePoints(sS, 0, 0.25);
      messY[iter]["s025"] = this.#givePoints(sS, 0.25, 0.5);
      messY[iter]["s05"] = this.#givePoints(sS, 0.5, 0.75);
      messY[iter]["s075"] = this.#givePoints(sS, 0.75, 1);

      messY[iter]["sA0"] = this.#givePoints(sSa, 0, 0.25);
      messY[iter]["sA025"] = this.#givePoints(sSa, 0.25, 0.5);
      messY[iter]["sA05"] = this.#givePoints(sSa, 0.5, 0.75);
      messY[iter]["sA075"] = this.#givePoints(sSa, 0.75, 1);
    }
    return messY;
  };

  //normalizacja datasetu
  #normalizeData = (dataset) => {
    var toReturn = JSON.parse(JSON.stringify(dataset));
    var columns = [
      "Length",
      "WordsCount",
      "WordsLenAvg",
      "PlChars",
      "PlAvg",
      "SpecialChars",
      "SpecialAvg",
    ];

    columns.forEach((column) => {
      let xmax = Math.max.apply(
        Math,
        toReturn.map((object) => {
          return object[column];
        })
      );
      let xmin = Math.min.apply(
        Math,
        toReturn.map((object) => {
          return object[column];
        })
      );

      let mnx = xmax - xmin;
      toReturn.forEach((object) => {
        object[column] = (object[column] - xmin) / mnx;
      });
    });

    return toReturn;
  };

  //normalizacja tekstu wejściowego + liczenie słów + mapa słów
  // => [znormalizowane dane, punkty słowa, punkty mapa]
  #textToData = (text) => {
    var pols = ["ą", "ę", "ó", "ź", "ż", "ć", "ń", "ł", "ś", "é"];
    var chs = [
      '"',
      "'",
      ".",
      ",",
      ":",
      ";",
      "(",
      ")",
      "/",
      "-",
      "!",
      "?",
      "«",
      "»",
      "—",
      "…",
      "„",
      "”",
      "«",
      "»",
      "<",
      ">",
      "`",
      "{",
      "}",
      "[",
      "]",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "|",
      "~",
      "/",
      "\\",
      "+",
      "=",
    ];

    //obróbka polskich znaków
    let npl = text + ".";
    for (let x of pols) {
      npl = npl.replaceAll(x, "");
    }

    //obróbka znaków specjalnych
    let nch = text + ".";
    for (let x of chs) {
      nch = nch.replaceAll(x, "");
    }

    //liczenie próbki
    let len = text.length + 1; //kropka usunięta przy obróbce
    let wrds = nch.split(" ").filter((word) => {
      return word != "";
    });
    let wrdsCnt = wrds.length;
    let wrdsAvg = len / wrdsCnt;
    let pls = len - npl.length;
    let plA = pls / wrdsCnt;
    let cHs = len - nch.length;
    let cHA = cHs / wrdsCnt;

    var columns = [
      "Length",
      "WordsCount",
      "WordsLenAvg",
      "PlChars",
      "PlAvg",
      "SpecialChars",
      "SpecialAvg",
    ];

    var toReturn = {
      Length: len,
      WordsCount: wrdsCnt,
      WordsLenAvg: wrdsAvg,
      PlChars: pls,
      PlAvg: plA,
      SpecialChars: cHs,
      SpecialAvg: cHA,
    };

    let dict = [0, 0];
    let dictMap = [0, 0];

    //liczenie słów i mapy
    wrds.forEach((word, index) => {
      let wrd = getStem(word);
      if (this.#micek[wrd]) dict[0] += 1 / this.#micek[wrd];
      if (this.#slowak[wrd]) dict[1] += 1 / this.#slowak[wrd];

      if (index < wrds.length - 1) {
        let next = getStem(wrds[index + 1]);
        if (this.#micekMap[wrd])
          if (this.#micekMap[wrd][next])
            dictMap[0] += this.#micekMap[wrd][next];
        if (this.#slowakMap[wrd])
          if (this.#slowakMap[wrd][next])
            dictMap[1] += this.#slowakMap[wrd][next];
      }
    });

    //normalizacja danych
    columns.forEach((column) => {
      let xmax = Math.max.apply(
        Math,
        this.#messages.map((object) => {
          return object[column];
        })
      );
      let xmin = Math.min.apply(
        Math,
        this.#messages.map((object) => {
          return object[column];
        })
      );

      xmin = Math.min(xmin, toReturn[column]);
      xmax = Math.max(xmax, toReturn[column]);

      let mnx = xmax - xmin;
      toReturn[column] = (toReturn[column] - xmin) / mnx;
    });

    return [toReturn, dict, dictMap];
  };

  //tworzenie próbki soft
  #dataToSample = (data) => {
    var sample = {};
    var sLen = data["Length"];
    var sW = data["WordsCount"];
    var sWa = data["WordsLenAvg"];
    var sPl = data["PlChars"];
    var sPlA = data["PlAvg"];
    var sS = data["SpecialChars"];
    var sSa = data["SpecialAvg"];

    sample["len0"] = this.#givePoints(sLen, 0, 0.25);
    sample["len025"] = this.#givePoints(sLen, 0.25, 0.5);
    sample["len05"] = this.#givePoints(sLen, 0.5, 0.75);
    sample["len075"] = this.#givePoints(sLen, 0.75, 1);

    sample["w0"] = this.#givePoints(sW, 0, 0.25);
    sample["w025"] = this.#givePoints(sW, 0.25, 0.5);
    sample["w05"] = this.#givePoints(sW, 0.5, 0.75);
    sample["w075"] = this.#givePoints(sW, 0.75, 1);

    sample["wA0"] = this.#givePoints(sWa, 0, 0.25);
    sample["wA025"] = this.#givePoints(sWa, 0.25, 0.5);
    sample["wA05"] = this.#givePoints(sWa, 0.5, 0.75);
    sample["wA075"] = this.#givePoints(sWa, 0.75, 1);

    sample["pl0"] = this.#givePoints(sPl, 0, 0.25);
    sample["pl025"] = this.#givePoints(sPl, 0.25, 0.5);
    sample["pl05"] = this.#givePoints(sPl, 0.5, 0.75);
    sample["pl075"] = this.#givePoints(sPl, 0.75, 1);

    sample["plA0"] = this.#givePoints(sPlA, 0, 0.25);
    sample["plA025"] = this.#givePoints(sPlA, 0.25, 0.5);
    sample["plA05"] = this.#givePoints(sPlA, 0.5, 0.75);
    sample["plA075"] = this.#givePoints(sPlA, 0.75, 1);

    sample["s0"] = this.#givePoints(sS, 0, 0.25);
    sample["s025"] = this.#givePoints(sS, 0.25, 0.5);
    sample["s05"] = this.#givePoints(sS, 0.5, 0.75);
    sample["s075"] = this.#givePoints(sS, 0.75, 1);

    sample["sA0"] = this.#givePoints(sSa, 0, 0.25);
    sample["sA025"] = this.#givePoints(sSa, 0.25, 0.5);
    sample["sA05"] = this.#givePoints(sSa, 0.5, 0.75);
    sample["sA075"] = this.#givePoints(sSa, 0.75, 1);

    return sample;
  };

  //liczenie soft => ["wynik", punkty wyników, szczegółowe wyniki]
  #simplify = (sample, x, y) => {
    //#obliczenie składowych

    var values = [0, 0]; //*len(x)
    var results = [[0,0,0,0,0,0,0], [0,0,0,0,0,0,0]];
    var columns = Object.keys(sample);
    var columnDict = {
      len0: 0,
      len025: 0,
      len05: 0,
      len075: 0,
      w0: 1,
      w025: 1,
      w05: 1,
      w075: 1,
      wA0: 2,
      wA025: 2,
      wA05: 2,
      wA075: 2,
      pl0: 3,
      pl025: 3,
      pl05: 3,
      pl075: 3,
      plA0: 4,
      plA025: 4,
      plA05: 4,
      plA075: 4,
      s0: 5,
      s025: 5,
      s05: 5,
      s075: 5,
      sA0: 6,
      sA025: 6,
      sA05: 6,
      sA075: 6,
    };

    for (let i = 0; i < x.length; i++) {
      let sumV = 0;
      columns.forEach((v) => {
        sumV += y[i][v] * sample[v];
        results[i][columnDict[v]] += y[i][v] * sample[v];
      });
      values[i] = sumV;
    }

    //#znalezienie max

    let maxV = Math.max(values[0], values[1]);
    return [x[values.indexOf(maxV)], values, results];
  };

  //głosowanie => "wynik"
  #voting = (soft, dict, dictMap, knn) => {
    let M = 0;
    let S = 0;

    //głosowanie
    //if (endgame[0] > endgame[1]) M++;
    //else if (endgame[1] > endgame[0]) S++;

    if (soft[0] > soft[1]) M++;
    else if (soft[1] > soft[0]) S++;

    if (dict[0] > dict[1]) M++;
    else if (dict[1] > dict[0]) S++;

    if (dictMap[0] > dictMap[1]) M += 2;
    else if (dictMap[1] > dictMap[0]) S += 2;

    if (knn[0] > knn[1]) M++;
    else if (knn[1] > knn[0]) S++;

    //wynik
    if (M > S) return ["Mickiewicz", [M, S]];
    else if (S > M) return ["Słowacki", [M, S]];
    else return ["REMIS!", [M, S]];
  };
}
