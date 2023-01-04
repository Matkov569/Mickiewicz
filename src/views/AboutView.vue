<template>
  <div class="about">
    <h1>Zbiory miękkie, KNN, NLP (liczenie słów, mapa słów)</h1>
  </div>
</template>

<script>
/*
import getStem from "stemmer_pl";

const calculateThings = () => {
  dataset.forEach((text) => {
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
    ];
    var pols = ["ą", "ę", "ó", "ź", "ż", "ć", "ń", "ł", "ś", "é"];

    //usuwamy polskie znaki żeby policzyć ile usuneliśmy
    let npl = text.toLowerCase() + ".";
    for (let x of pols) {
      npl = npl.replaceAll(x, "");
    }

    //usuwamy znaki specjalne żeby podzielić tekst na słowa i policzyć znaki specjalne
    let nch = text.toLowerCase() + ".";
    for (let x of chs) {
      nch = nch.replaceAll(x, "");
    }
    let wrds = nch.split(" ").filter((word)=>{return word!=""});
    let nch2 = nch.replaceAll(" ", "");

    //liczymy występowanie słów, robimy mape
    wrds.forEach((word, index) => {
      let wrd = getStem(word);
      if (slowa[wrd]) slowa[wrd]++;
      else slowa[wrd] = 1;
      if (!mapaslow[wrd]) mapaslow[wrd] = {};
      if (index < wrds.length - 1) {
        let next = getStem(wrds[index + 1]);
        if (mapaslow[wrd][next]) mapaslow[wrd][next]++;
        else mapaslow[wrd][next] = 1;
      }
    });

    //liczymy staty
    let len = text.length + 1;
    let wrdsCnt = wrds.length;
    let wrdsAvg = len / wrdsCnt;
    let pls = len - npl.length;
    let plA = pls / wrdsCnt;
    let cHs = len - nch2.length;
    let cHA = cHs / wrdsCnt;

    staty.push({
      Length: len,
      WordsCount: wrdsCnt,
      WordsLenAvg: wrdsAvg,
      PlChars: pls,
      PlAvg: plA,
      SpecialChars: cHs,
      SpecialAvg: cHA,
      Autor: author,
    });
  });
  console.log(staty);
  console.log(slowa);
  console.log(mapaslow);
}

var author = "Mickiewicz";
var dataset = [
    "Litwo! Ojczyzno moja! ty jesteś jak zdrowie: Ile cię trzeba cenić, ten tylko się dowie, Kto cię stracił",
    "Dziś piękność twą w całej ozdobie Widzę i opisuję, bo tęsknię po tobie",
    "Panno święta, co Jasnej bronisz Częstochowy I w Ostrej świecisz Bramie! Ty, co gród zamkowy Nowogródzki ochraniasz z jego wiernym ludem! Jak mnie dziecko do zdrowia powróciłaś cudem (Gdy od płaczącej matki, pod Twoją opiekę Ofiarowany, martwą podniosłem powiekę; I zaraz mogłem pieszo, do Twych świątyń progu Iść za wrócone życie podziękować Bogu), Tak nas powrócisz cudem na Ojczyzny łono",
    "Tymczasem przenoś moją duszę utęsknioną Do tych pagórków leśnych, do tych łąk zielonych, Szeroko nad błękitnym Niemnem rozciągnionych; Do tych pól malowanych zbożem rozmaitem, Wyzłacanych pszenicą, posrebrzanych żytem; Gdzie bursztynowy świerzop, gryka jak śnieg biała, Gdzie panieńskim rumieńcem dzięcielina pała, A wszystko przepasane jakby wstęgą, miedzą Zieloną, na niej z rzadka ciche grusze siedzą",
    "Śród takich pól przed laty, nad brzegiem ruczaju, Na pagórku niewielkim, we brzozowym gaju, Stał dwór szlachecki, z drzewa, lecz podmurowany; Świeciły się z daleka pobielane ściany, Tym bielsze, że odbite od ciemnej zieleni Topoli, co go bronią od wiatrów jesieni",
    "Dom mieszkalny niewielki, lecz zewsząd chędogi, I stodołę miał wielką, i przy niej trzy stogi Użątku, co pod strzechą zmieścić się nie może",
    "Widać, że okolica obfita we zboże, I widać z liczby kopic, co wzdłuż i wszerz smugów Świecą gęsto jak gwiazdy, widać z liczby pługów Orzących wcześnie łany ogromne ugoru, Czarnoziemne, zapewne należne do dworu, Uprawne dobrze na kształt ogrodowych grządek: Że w tym domu dostatek mieszka i porządek",
    "Brama na wciąż otwarta przechodniom ogłasza, Że gościnna, i wszystkich w gościnę zaprasza",
    "Właśnie dwukonną bryką wjechał młody panek I obiegłszy dziedziniec zawrócił przed ganek",
    "Wysiadł z powozu; konie porzucone same, Szczypiąc trawę ciągnęły powoli pod bramę",
    "We dworze pusto: bo drzwi od ganku zamknięto Zaszczepkami i kołkiem zaszczepki przetknięto",
    "Podróżny do folwarku nie biegł sług zapytać, Odemknął, wbiegł do domu, pragnął go powitać",
    "Dawno domu nie widział, bo w dalekim mieście Kończył nauki, końca doczekał nareszcie",
    "Wbiega i okiem chciwie ściany starodawne Ogląda czule, jako swe znajome dawne",
    "Też same widzi sprzęty, też same obicia, Z którymi się zabawiać lubił od powicia, Lecz mniej wielkie, mniej piękne niż się dawniej zdały",
    "I też same portrety na ścianach wisiały: Tu Kościuszko w czamarce krakowskiej, z oczyma Podniesionymi w niebo, miecz oburącz trzyma; Takim był, gdy przysięgał na stopniach ołtarzów, Że tym mieczem wypędzi z Polski trzech mocarzów, Albo sam na nim padnie",
    "Dalej w polskiej szacie Siedzi Rejtan, żałośny po wolności stracie; W ręku trzyma nóż ostrzem zwrócony do łona, A przed nim leży Fedon i żywot Katona",
    "Dalej Jasiński, młodzian piękny i posępny; Obok Korsak, towarzysz jego nieodstępny: Stoją na szańcach Pragi, na stosach Moskali, Siekąc wrogów, a Praga już się wkoło pali",
    "Nawet stary stojący zegar kurantowy W drewnianej szafie poznał, u wniścia alkowy; I z dziecinną radością pociągnął za sznurek, By stary Dąbrowskiego usłyszeć mazurek",
    "Biegał po całym domu i szukał komnaty, Gdzie mieszkał dzieckiem będąc, przed dziesięciu laty",
    "Wchodzi, cofnął się, toczył zdumione źrenice Po ścianach: w tej komnacie mieszkanie kobiéce! Któż by tu mieszkał? Stary stryj nie był żonaty; A ciotka w Petersburgu mieszkała przed laty",
    "To nie był ochmistrzyni pokój? Fortepiano? Na nim nuty i książki; wszystko porzucano Niedbale i bezładnie: nieporządek miły! Niestare były rączki, co je tak rzuciły",
    "Tuż i sukienka biała, świeżo z kołka zdjęta Do ubrania, na krzesła poręczu rozpięta; A na oknach donice z pachnącymi ziołki, Geranium, lewkonija, astry i fijołki",
    "Podróżny stanął w jednym z okien — nowe dziwo: W sadzie, na brzegu niegdyś zarosłym pokrzywą, Był maleńki ogródek ścieżkami porznięty, Pełen bukietów trawy angielskiej i mięty",
    "Drewniany, drobny, w cyfrę powiązany płotek Połyskał się wstążkami jaskrawych stokrotek; Grządki, widać, że były świeżo polewane, Tuż stało wody pełne naczynie blaszane, Ale nigdzie nie widać było ogrodniczki; Tylko co wyszła: jeszcze kołyszą się drzwiczki Świeżo trącone, blisko drzwi ślad widać nóżki Na piasku, bez trzewika była i pończoszki; Na piasku drobnym, suchym, białym na kształt śniegu, Ślad wyraźny, lecz lekki, odgadniesz, że w biegu Chybkim był zostawiony nóżkami drobnemi Od kogoś, co zaledwie dotykał się ziemi",
    "Podróżny długo w oknie stał patrząc, dumając, Wonnymi powiewami kwiatów oddychając",
    "Oblicze aż na krzaki fijołkowe skłonił, Oczyma ciekawymi po drożynach gonił I znowu je na drobnych śladach zatrzymywał, Myślał o nich i, czyje były, odgadywał",
    "Przypadkiem oczy podniósł, i tuż na parkanie Stała młoda dziewczyna… Białe jej ubranie Wysmukłą postać tylko aż do piersi kryje, Odsłaniając ramiona i łabędzią szyję",
    "W takim Litwinka tylko chodzić zwykła z rana, W takim nigdy nie bywa od mężczyzn widziana: Więc choć świadka nie miała, założyła ręce Na piersiach, przydawając zasłony sukience",
    "Włos w pukle nierozwity, lecz w węzełki małe Pokręcony, schowany w drobne strączki białe, Dziwnie ozdabiał głowę: bo od słońca blasku Świecił się jak korona na świętych obrazku",
    "Twarzy nie było widać; zwrócona na pole Szukała kogoś okiem, daleko, na dole; Ujrzała, zaśmiała się i klasnęła w dłonie, Jak biały ptak zleciała z parkanu na błonie, I wionęła ogrodem, przez płotki, przez kwiaty, I po desce opartej o ścianę komnaty… Nim spostrzegł się, wleciała przez okno, świecąca, Nagła, cicha i lekka, jak światłość miesiąca",
    "Nucąc chwyciła suknie, biegła do zwierciadła: Wtem ujrzała młodzieńca i z rąk jej wypadła Suknia, a twarz od strachu i dziwu pobladła",
    "Twarz podróżnego barwą spłonęła rumianą, Jak obłok, gdy z jutrzenką napotka się raną",
    "Skromny młodzieniec oczy zmrużył i przysłonił, Chciał coś mówić, przepraszać; tylko się ukłonił I cofnął się",
    "Dziewica krzyknęła boleśnie, Niewyraźnie, jak dziecko przestraszone we śnie; Podróżny zląkł się, spojrzał; lecz już jej nie było",
    "Wyszedł zmieszany i czuł, że mu serce biło Głośno, i sam nie wiedział, czy go miało śmieszyć To dziwaczne spotkanie, czy wstydzić, czy cieszyć",
    "Tymczasem na folwarku nie uszło baczności, Że przed ganek zajechał któryś z nowych gości",
    "Już konie w stajnią wzięto, już im hojnie dano, Jako w porządnym domu, i obrok, i siano: Bo Sędzia nigdy nie chciał, według nowej mody, Odsyłać koni gości Żydom do gospody",
    "Słudzy nie wyszli witać; ale nie myśl wcale, Aby w domu Sędziego służono niedbale: Słudzy czekają, nim się pan Wojski ubierze, Który teraz za domem urządzał wieczerzę",
    "On pana zastępuje i on, w niebytności Pana, zwykł sam przyjmować i zabawiać gości (Daleki krewny pański i przyjaciel domu)",
    "Widząc gościa, na folwark dążył po kryjomu, Bo nie mógł wyjść spotykać w tkackim pudermanie; Wdział więc jak mógł najprędzej niedzielne ubranie Nagotowane z rana, bo od rana wiedział, Że u wieczerzy będzie z mnóstwem gości siedział",
    "Pan Wojski poznał z dala, ręce rozkrzyżował I z krzykiem podróżnego ściskał i całował",
    "Zaczęła się ta prędka, zmieszana rozmowa, W której lat kilku dzieje chciano zamknąć w słowa Krótkie i poplątane, w ciąg powieści, pytań, Wykrzykników i westchnień, i nowych powitań",
    "Gdy się pan Wojski dosyć napytał, nabadał, Na samym końcu dzieje tego dnia powiadał",
    "«Dobrze mój Tadeuszu, (bo tak nazywano Młodzieńca, który nosił Kościuszkowskie miano Na pamiątkę, że w czasie wojny się urodził) Dobrze mój Tadeuszu, żeś się dziś nagodził Do domu, właśnie kiedy mamy panien wiele",
    "Stryjaszek myśli wkrótce sprawić ci wesele; Jest z czego wybrać; u nas towarzystwo liczne Od dni kilku zbiera się na sądy graniczne, Dla skończenia dawnego z panem Hrabią sporu",
    "I pan Hrabia ma jutro sam zjechać do dworu; Podkomorzy już zjechał z żoną i z córkami",
    "Młodzież poszła do lasu bawić się strzelbami, A starzy i kobiety żniwo oglądają Pod lasem i tam pewnie na młodzież czekają",
    "Pójdziemy, jeśli zechcesz, i wkrótce spotkamy Stryjaszka, Podkomorstwo i szanowne damy»",
    "Pan Wojski z Tadeuszem idą pod las drogą, I jeszcze się do woli nagadać nie mogą",
    "Słońce ostatnich kresów nieba dochodziło, Mniej silnie, ale szerzej niż we dnie świeciło, Całe zaczerwienione, jak zdrowe oblicze Gospodarza, gdy prace skończywszy rolnicze Na spoczynek powraca",
    "Już krąg promienisty Spuszcza się na wierzch boru i już pomrok mglisty, Napełniając wierzchołki i gałęzie drzewa, Cały las wiąże w jedno i jakoby zlewa; I bór czernił się na kształt ogromnego gmachu, Słońce nad nim czerwone jak pożar na dachu",
    "Wtem zapadło do głębi; jeszcze przez konary Błysnęło, jako świeca przez okiennic szpary, I zgasło",
    "I wnet sierpy gromadnie dzwoniące We zbożach, i grabliska suwane po łące, Ucichły i stanęły: tak pan Sędzia każe, U niego ze dniem kończą pracę gospodarze",
    "«Pan świata wie, jak długo pracować potrzeba; Słońce, Jego robotnik, kiedy znijdzie z nieba, Czas i ziemianinowi ustępować z pola»",
    "Tak zwykł mawiać pan Sędzia, a Sędziego wola Była Ekonomowi poczciwemu świętą; Bo nawet wozy, w które już składać zaczęto Kopę żyta, niepełne jadą do stodoły: Cieszą się z niezwyczajnej ich lekkości woły",
    "Właśnie z lasu wracało towarzystwo całe, Wesołe, lecz w porządku",
    "Naprzód dzieci małe Z dozorcą, potem Sędzia szedł z Podkomorzyną, Obok pan Podkomorzy otoczon rodziną; Panny tuż za starszymi, a młodzież na boku; Panny szły przed młodzieżą o jakie pół kroku (Tak każe przyzwoitość)",
    "Nikt tam nie rozprawiał O porządku, nikt mężczyzn i dam nie ustawiał: A każdy mimowolnie porządku pilnował; Bo Sędzia w domu dawne obyczaje chował, I nigdy nie dozwalał, by chybiano względu Dla wieku, urodzenia, rozumu, urzędu"
];
var staty = [];
var slowa = {};
var mapaslow = {};
calculateThings();

author = "Słowacki";
dataset = [
    "Żyłem z wami, cierpiałem i płakałem z wami; Nigdy mi, kto szlachetny, nie był obojętny: Dziś was rzucam i dalej idę w cień — z duchami, A jak gdyby tu szczęście było, idę smętny",
    "Nie zostawiłem tutaj żadnego dziedzica  Ani dla mojej lutni, ani dla imienia: Imię moje tak przeszło, jako błyskawica, I będzie, jak dźwięk pusty, trwać przez pokolenia",
    "Lecz wy, coście mnie znali, w podaniach przekażcie, Żem dla ojczyzny sterał moje lata młode; A póki okręt walczył, siedziałem na maszcie, A gdy tonął, z okrętem poszedłem pod wodę… Ale kiedyś, o smętnych losach zadumany Mojej biednej ojczyzny, pozna, kto szlachetny, Że płaszcz na moim duchu był nie wyżebrany, Lecz świetnościami moich dawnych przodków świetny",
    "Niech przyjaciele moi w nocy się zgromadzą I biedne serce moje spalą w aloesie, I tej, która mi dała to serce, oddadzą: Tak się matkom wypłaca świat, gdy proch odniesie…  Niech przyjaciele moi siędą przy pucharze I zapiją mój pogrzeb — oraz własną biedę: Jeżeli będę duchem, to się im pokażę, Jeśli Bóg mnie uwolni od męki, nie przyjdę…  Lecz zaklinam: niech żywi nie tracą nadziei I przed narodem niosą oświaty kaganiec; A kiedy trzeba, na śmierć idą po kolei, Jak kamienie, przez Boga rzucane na szaniec! Co do mnie — ja zostawiam maleńką tu drużbę  Tych, co mogli pokochać serce moje dumne; Znać, że srogą spełniłem, twardą Bożą służbę, I zgodziłem się tu mieć niepłakaną trumnę",
    "Kto drugi tak bez świata oklasków się zgodzi Iść?… taką obojętność, jak ja, mieć dla świata? Być sternikiem duchami napełnionej łodzi I tak cicho odlecieć, jak duch, gdy odlata? Jednak zostanie po mnie ta siła fatalna, Co mi żywemu na nic, tylko czoło zdobi; Lecz po śmierci was będzie gniotła niewidzialna, Aż was, zjadacze chleba — w aniołów przerobi",
    "Patrz! przy zachodzie, jak z Sekwany łona Powstają gmachy połamanym składem, Jak jedne drugim wchodzą na ramiona, Gdzieniegdzie ulic przeświecone śladem",
    "Gmachy skręconym wydają się gadem, Zębatą dachów łuską się najeża",
    "A tam — czy żądło oślinione jadem? Czy słońca promień? czy spisa rycerza? Wysoko — strzela blaskiem ozłocona wieża",
    "Nowa Sodomo! pośród twych kamieni Mnoży się zbrodnia bezwstydna widomie  I kiedyś na cię spadnie deszcz płomieni, Lecz nie deszcz boży, nie zamknięty w gromie, Sto dział go poszle… A na każdym domie  Kula wyryje straszny wyrok Boga; Kula te mury przepali, przełomie, I wielka na cię spadnie kiedyś trwoga, I większa jeszcze rozpacz — bo to kula wroga…  I już nad miastem wisi ta dział chmura, Dlatego ludu zasępione tłumy, Dlatego ciemność ulic tak ponura, Przeczuciem nieszczęść zbłąkane rozumy; Bez echa kona słowo próżnej dumy, O wrogach ciągłe toczą się rozmowy… A straż ich przednia, już północne dżumy Obrońców ludu pozwiewały głowy, I po ulicach ciągły brzmi dzwon pogrzebowy",
    "Czy wrócą czasy tych świętych tajemnic, Kiedy tu ludzie zbytkiem życia wściekli, Jedni pod katem, drudzy w głębi ciemnic, Inni ponurzy, bladzi, krwią ociekli, Co kiedy śmieli pomyśleć — wyrzekli? Lud cały kona, katy i obrońce, Dnia im nie stało, aby się wysiekli; I przeczuwając krwawej zorzy końce, Jak Jozue wołali: Dnia trzeba — stój, słońce! I nie stanęło — pomarli — przedwcześnie, Lecz zostawili pamiątki po sobie: Kraj po rozlewie krwi tonący we śnie I lud, nie po nich ubrany w żałobie, Krwi trójcę w jednej wcieloną osobie",
    "Ten jak rodyjski posąg świecznik trzyma I jedną nogę wsparł na martwych grobie, Drugą na zamku królów… Gdzie oczyma Sięgnął — tam wnet i ręką dostawał olbrzyma",
    "A kiedy posąg walił się z podstawy, Tysiące ludu sławą się dzieliło, Każdy się okrył łachmanem tej sławy, Każdemu było dosyć — nadto było… Marzą o dawnej sławie nad mogiłą I pod kolumną spiżu wszyscy posną; Choć cięcie kata głowę z niej strąciło, Choć na niej może jak na gruzach z wiosną Chwasty i z lilijami Burbonów porosną",
    "Tu dzisiaj Polak błąka się wygnany, W nędzy — i brat już nie pomaga bratu",
    "Wierzby płaczące na brzegach Sekwany Smutne są dla nas jak wierzby Eufratu",
    "I całej nędzy nie wyjawię światu… Twarze z marmuru — serca marmurowe, Drzewo nadziei bez liścia i kwiatu Schnie, gdy wygnaniec złożył pod nim głowę, Jak nad prorokiem Judy schło drzewo figowe",
    "Z dala od miasta szukajmy napisów, Gdzie wielki cmentarz zalega na górze",
    "O! jak tu smutno, kędy wśród cyprysów Pobladłe w cieniu chowają się róże",
    "A pod stopami — dalej — miasto w chmurze Topi się we mgłach gasnących opalu… A dla żałobnych rodzin przy tym murze Przedają wianki z płótna lub z perkalu, Aby dłużej świadczyły o kupionym żalu",
    "Patrz znów w mgłę miejską — oto wież ostatki, Gotyckim kunsztem ukształcona ściana; Rzekłbyś — że zmarła matka twojej matki, W czarne, brabanckie korónki ubrana, Z chmur się wychyla jak duch Ossyjana… Ludzi nie dojrzysz… Lecz nad mgłami fali Stoją posągi (gdzie płynie Sekwana), Jakby się w Styksu łodzi zatrzymali Przed piekła bramami we mgłach stoją biali… Tam gmachy Luwru, gdzie tron Baltazara, A na nim siedział wyrobnik umarły… Przez dnie lipcowe panowała mara, U nóg jej ludzie snuli się jak karły; Bo nad nią cienie śmierci rozpostarły Wielkość olbrzymią — był to król narodu",
    "I aksamity krew mu z czoła starły, Lecz jego dzieci umierały z głodu, Zaczął dynastią trupów, był ostatnim z rodu",
    "Piramidy, czy wy macie Takie trumny, sarkofagi, Aby miecz położyć nagi, Naszą zemstę w tym bułacie Pogrześć i nabalsamować, I na późne czasy schować?  — Wejdź z tym mieczem w nasze bramy, Mamy takie trumny, mamy",
    "Piramidy, czy wy macie Takie trumny, grobowniki, Aby nasze męczenniki W balsamowej złożyć szacie; Tak by każdy na dzień chwały Wrócił w kraj, choć trupem, cały?  — Daj tu ludzi tych bez plamy, Mamy takie trumny, mamy",
    "Piramidy, czy wy macie Takie trumny i łzawice, By łzy nasze i tęsknice Po ojczystych pól utracie Zlać tam razem i ostatek Czary dolać łzami matek?  — Wejdź tu, pochyl blade lice, Mamy na te łzy łzawice",
    "Piramidy, czy wy macie Takie trumny zbawicielki, Aby naród cały, wielki, Tak na krzyżu, w majestacie Wnieść, położyć, uśpić cały I przechować — na dzień chwały?  — Złóż tu naród, nieś balsamy, Mamy takie trumny, mamy",
    "Piramidy, czy została Jeszcze jaka trumna głucha, Gdziebym złożył mego ducha, Ażby Polska zmartwychwstała? — Cierp a pracuj! i bądź dzielny, Bo twój naród nieśmiertelny! My umarłych tylko znamy, A dla ducha trumn nie mamy",
    "KOCHANY POETO RUIN! Pozwól, że pisząc do ciebie zacznę od apologu, który mi opowiedziano nad Salaminy zatoką",
    "Stary i ślepy harfiarz z wyspy Scio przyszedł nad brzegi Morza Egejskiego, a usłyszawszy z wielkim hukiem łamiące się fale; myślał, że szum ów pochodził od zgiełku ludzi, którzy się zbiegli pieśni rycerskich posłuchać",
    "— Oparł się więc na harfie i śpiewał pustemu morza brzegowi: a kiedy skończył, zadziwił się, że żadnego ludzkiego głosu, żadnego westchnienia, żadnego pieśń nie zyskała oklasku",
    "Rzucił więc harfę precz daleko od siebie, a te fale, które śpiewak mniemał tłumem ludzkim, odniosły złote pieśni narzędzie i położyły mu je przy stopach",
    "I odszedł od harfy swojej smutny Greczyn nie wiedząc, że najpiękniejszy rapsod nie w sercach ludzi, ale w głębi fal Egejskiego Morza utonął",
    "Kochany Irydionie! ta powiastka o falach i harfiarzu zastąpi wszelką do Balladyny przemowę",
    "Wychodzi na świat Balladyna z ariostycznym uśmiechem na twarzy, obdarzona wnętrzną siłą urągania się z tłumu ludzkiego, z porządku i z ładu, jakim się wszystko dzieje na świecie, z nieprzewidzianych owoców, które wydają drzewa ręką ludzi szczepione",
    "Niech naprawiacz wszelkiego bezprawia Kirkor pada ofiarą swoich czystych zamiarów; niech Grabieć miłuje kuchnią Kirkora; niechaj powietrzna Goplana kocha się w rumianym chłopie, a sentymentalny Filon szuka umyślnie męczarni miłosnych i umarłej kochanki; niechaj tysiące anachronizmów przerazi śpiących w grobie historyków i kronikarzy: a jeżeli to wszystko ma wnętrzną siłę żywota, jeżeli stworzyło się w głowie poety podług praw boskich, jeżeli natchnienie nie było gorączką, ale skutkiem tej dziwnej władzy, która szepce do ucha nigdy wprzód nie słyszane wyrazy, a oczom pokazuje nigdy, we śnie nawet, nie widziane istoty; jeżeli instynkt poetyczny był lepszym od rozsądku, który nieraz tę lub ową rzecz potępił: to Balladyna wbrew rozwadze i historii zostanie królową polską — a piorun, który spadł na jej chwilowe panowanie, błyśnie i roztworzy mgłę dziejów przeszłości",
    "Uśmiechnij się teraz, Irydionie, bo oto naśladując francuskich poetów: powiem ci, że Balladyna jest tylko epizodem wielkiego poematu w rodzaju Ariosta, który ma się uwiązać z sześciu tragedii, czyli kronik dramatycznych",
    "Cienił już różne ludzi niebyłych wyszły ze mgły przedstworzenia i otaczają mnie ciżbą gwarzącą: potrzeba tylko, aby się zebrały w oddzielne tłumy, ażeby czyny ich ułożyły się w postacie piramidalne wypadków, a jedną po drugiej garstkę na świat wypychać będę; i sprawdzą się może sny mego dzieciństwa",
    "Bo ileż to razy patrząc na stary zamek, koronujący ruinami górę mego rodzinnego miasteczka, marzyłem, że kiedyś w ten wieniec wyszczerbionych murów nasypię widm, duchów, rycerzy; że odbuduję upadłe sale i oświecę je przez okna ogniem piorunowych nocy, a sklepieniom każę powtarzać dawne Sofoklesowskie „niestety!” A za to imię moje słyszane będzie w szumie płynącego pod górą potoku, a jakaś niby tęcza z myśli moich unosić się będzie nad ruinami zamku",
    "— O! nie mów mi, że z dzwonków polnych większa ozdoba ruinom niż z tego wieńca myśli, w który je ubierze poeta: — bo choć róże rosnące na ruinach pałacu Nerona rozwidniały nam pięknie te gruzy: to jednak jaśniej mi je oświecił ów duch Irydiona, któregoś ty pod krzyżem w Kolosseum położył i nakrył złotymi skrzydłami anioła",
    "Tak więc, kiedy ty dawne posągowe Rzymian postacie napełniasz wulkaniczną duszą wieku naszego; ja z Polski dawnej tworzę fantastyczną legendę, z ciszy wiekowej wydobywam chóry prorockie — i na spotkanie twojej czarnej, piorunowej, dantejskiej chmury prowadzę lekkie, tęczowe i ariostyczne obłoki, pewny, że spotkanie się nasze w wyższej krainie nie będzie walką, ale tylko grą kolorów i cieni, z tym smutnym dla mnie końcem, że twoja chmura, większym wichrem gnana i pełniejsza piorunowego ognia, moje wietrzne i różnobarwne obłoki roztrąci i pochłonie",
    "Doniosły mi sylfy, żeś powędrował teraz odwiedzić Etnę czerwoną: posłałem natychmiast Skierkę, aby ci na drodze wszystkie pootwierał kwiaty i wszystkie gwiazdy nad tobą zapalił; za to przez wdzięczność, stanąwszy na szczycie wulkanu, spojrzyj na mórz rozległe błękity i pomyśl, że niedawnymi czasy przez te zwierciadła wędrował okręt mój, jak łabędź żaglami nakryty",
    "Powiedz, czy nie dojrżysz jakiego rysu na fali, jakiego śladu po zniknionym okręcie? Księża wtenczas śpiewali hymn do Najświętszej Panny, a ja stałem z wlepionymi w ogień Etny oczyma, smutny, że mnie fala znów tylko do Europy odnosiła",
    "Słuchaj w ciszy powietrznej, czy echo tego hymnu, który mi serce uciszał, nie drga dotąd w kryształowej atmosferze? Szukaj mojego śladu w powietrzu i na fali, a jeśli o mnie na fali i w powietrzu nie słychać, to znajdź mnie w sercu twoim i niech ja będę jeszcze z tobą przez jedną godzinę",
    "Wszak darem to jest Boga, że my umiemy myślą latać do siebie w odwiedziny",
    "Jak ty mi jesteś wdzięczna, Duszeczko moja mała, Słoneczna i miesięczna, Prawie bez krwi i ciała",
    "Gdyś wysoko siadała Z główką w zorzy pierścieniach, Na Druidów kamieniach, Śród jałowcowych krzaków Ćwieki twoich chodaków Błyskały mi na lice Jako dwa półksiężyce Czerwoną zorzą ranną; I byłaś mi zarazem Chłopeczką i Dyjanną, Zjawieniem i obrazem, Kochanką i dziecięciem, Smutkiem — i niebowzięciem",
    "Włoski twoje jak zboże Złote i przezroczyste Wiatr unosił na morze, A we włoskach ogniste Ranunkuły z doliny, Jak maki Ukrainy, Zdawały się ogniami, Które tobie do lica Przypięła upiorzyca Śpiąca w grobie pod nami",
    "Za tobą — szafir mórz Dzielił kibić na dwoje; Nad głową — jak zawoje Jutrzenki pełne róż I chwasty w dyjamentach Około ciebie skrzyły, A ty na monumentach Stróżka — i duch mogiły, Z niewinnością na licach, Z nóżkami na księżycach",
    "A jednak ja nie wątpię — bo się pora zbliża, Że się to wielkie światło na niebie zapali, I Polski Ty, o Boże, nie odepniesz z krzyża, Aż będziesz wiedział, że się jako trup nie zwali",
    "Dzięki Ci więc, o Boże — że już byłeś blisko, A jeszcześ Twojej złotej nie odsłonił twarzy, Aleś nas, syny Twoje, dał na pośmiewisko, Byśmy rośli jak kłosy pod deszczem potwarzy",
    "Takiej chwały od czasu, jak na wiatrach stoi Glob ziemski — na żadnego nie włożyłeś ducha, Że się cichości naszej cała ziemia boi I sądzi się, że wolna jak dziecko, a słucha",
    "Zaprawdę w ciałach naszych światłość jakaś wielka Balsamująca ciało — formy żywicielka, Uwiecznica… promienie swe dawała złote Przez alabastry ciała",
    "Smutno mi, Boże! Dla mnie na zachodzie Rozlałeś tęczę blasków promienistą; Przede mną gasisz w lazurowej wodzie Gwiazdę ognistą… Choć mi tak niebo Ty złocisz i morze, Smutno mi, Boże! Jak puste kłosy z podniesioną głową, Stoję rozkoszy próżen i dosytu… Dla obcych ludzi mam twarz jednakową, Ciszę błękitu",
    "Ale przed Tobą głąb serca otworzę: Smutno mi, Boże! Jako na matki odejście się żali Mała dziecina, tak ja płaczu bliski, Patrząc na słońce, co mi rzuca z fali Ostatnie błyski, Choć wiem, że jutro błyśnie nowe zorze, Smutno mi, Boże!  Dzisiaj na wielkiem morzu obłąkany, Sto mil od brzegu i sto mil przed brzegiem, Widziałem lotne w powietrzu bociany Długim szeregiem",
    "Żem je znał kiedyś na polskim ugorze, Smutno mi, Boże! Żem często dumał nad mogiłą ludzi, Żem nie znał prawie rodzinnego domu, Żem był jak pielgrzym, co się w drodze trudzi Przy blaskach gromu, Że nie wiem, gdzie się w mogiłę położę, Smutno mi, Boże!  Ty będziesz widział moje białe kości, W straż nieoddane kolumnowym czołom; Alem jest jako człowiek, co zazdrości Mogił… popiołom",
    "Więc, że nieznane gotujesz mi łoże, Smutno mi, Boże!  Kazano w kraju niewinnej dziecinie Modlić się za mnie co dzień; a ja przecie Wiem, że mój okręt nie do kraju płynie, Płynąc po świecie",
    "Więc, że modlitwa dziecka nic nie może, Smutno mi, Boże! Na tęczę blasków, którą tak ogromnie Anieli twoi w niebie rozpostarli, Nowi gdzieś ludzie w sto lat będą po mnie Patrzący — marli",
    "Nim się przed moją nicością ukorzę, Smutno mi, Boże! Przeklęta! Ty wydarłaś ostatnie godziny Szczęścia mego na ziemi, ty żądłem gadziny Wygnałaś na samotność! Bądź wiecznie przeklęta! — Każdy mój jęk — zna ciebie, każda łza — pamięta!  Bo kiedy nieszczęśliwy zaklinałem ciebie, Abyś mi dała nieco przyjaźni i ciszy, Toś ty mi łzy w powszednim podawała chlebie, I jęcząc — z jękiem w sercu mówiłaś: Niech słyszy! Cierpiałem i uległem… Dziś samotny jestem, Lecz wiedz, iż samotności okryty żałobą, Oczy moje obracam za każdym szelestem, Czekam — ale nie ciebie… Tęsknię — nie za tobą",
    "Tej czekam omamiony, tej samotny płaczę, Która mi była siostrą na wygnania ziemi, Myśląc, że kiedyś duszy oczyma zobaczę Tę, co w duszę oczyma patrzy anielskiemi",
    "A nigdy serca mego nie umiała krwawić; A tak się ze mną duszą i myślami dzieli, Że już dziś sami boscy nie wiedzą anieli, Czv ją dla mnie potępić, czy mnie dla niej zbawić",
    "A ty! a ty! co lałaś żółciowe gorycze, Skoro się otwierała serca mego rana, O! gorzej niż przeklęta — widmo tajemnicze Złej przeszłości — przeklęta bądź i zapomniana! "
];
staty = [];
slowa = {};
mapaslow = {};
calculateThings();
*/
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
