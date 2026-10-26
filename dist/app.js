(function(){
"use strict";
var D = window.ETERNA;
var WA = "355698772605";
var PHONE = "+355 69 877 2605", INFO = "info@eternadesign.com", SALES = "sales@eternadesign.com", IG = "eternadesign.al";
var lang = "en";
try { var s = localStorage.getItem("eterna-lang"); if (s === "sq" || s === "en") lang = s; } catch(e) {}

/* ---------- copy ---------- */
var T = {
  en: {
    collection:"Collection", brands:"Brands",
    philosophy:"Philosophy", phH:"Eterna means timeless.",
    phLead:"We bring the great icons of furniture design to Albania because we believe they deserve to be kept, understood and lived with, not only owned.",
    phOpen:"Every piece we present began as an idea that changed how people sit, gather and live. A chair shaped by hand in wire and plaster. A steel frame bent without a single break. A woven seat that holds the memory of embroidery. These are not products of a season. They are answers to questions that still matter, and they have outlived the people who first asked them.",
    phWhyH:"Why we do this",
    phWhy:"Eterna was born from a simple conviction: great design is cultural heritage, and heritage needs people who care for it. In a time of furniture made to be replaced, we choose pieces made to be kept. Preserving them is not nostalgia. It keeps a conversation alive between the designers who changed the twentieth century and the homes, offices and interiors of today.",
    phMeanH:"What these pieces mean to us",
    phMean:"For us these icons carry sentimental value. They hold the hands of the craftsmen who make them, the vision of the architects who drew them and the lives of everyone who has sat in them since. We celebrate them today because their revolution is not over: the Egg still creates privacy in a busy room, and the Series 7 still shows how much a single sheet of wood can do.",
    phPillarsH:"What we hold sacred",
    phPillars:[["Design","We study the idea before the object: the problem a designer set out to solve, and the drawing that solved it."],["Materials","Leather, steel, veneer, stone and fibre each have a character. We learn how they age, so we can tell you how a piece will live with you."],["Heritage","Every icon belongs to a history of people, places and decisions. We keep that history with the piece and share it with every client."],["Soul","A piece of furniture is more than something to use. It is a purposeful form, with function and with soul."]],
    phQuote:"Not functional objects, but purposeful forms with function and soul.",
    phSacredH:"Understanding is how we honour them",
    phSacred:"Design, materials and heritage are sacred to us. The perseverance of great design is cultural, because it carries the memory of a society. It is impactful, because it shapes how people live every day. And it is purposeful, because a piece made well is made to last. Our soul feeds on the desire to understand these pieces, to acknowledge them, and to give them the place they deserve.",
    phPromiseH:"What we promise",
    phPromise:[["Only originals","Authorised pieces from the makers who hold the designers' rights. Never copies."],["The story with every piece","Each piece comes with its designer, its year and the reason it exists."],["An architect's eye","We help you choose scale, material and finish for your space."],["Time","Our showroom opens by appointment, so every conversation is unhurried."]],
    phSign:"Every piece we place is a small act of preservation.",
    works:"Works", designed:"Designed", producedBy:"Produced by", dIntro:"The architects and designers behind the pieces we present, from the Bauhaus and Danish modernism to Milan today. Their ideas changed how we live; their names stay with every piece.",
    readMore:"Read the story", newArr:"New arrivals", show:"Show", allPieces:"All pieces", viewAllB:"View all", aboutBrand:"About the brand", byType:"By type", newTag:"New", collOf:"Collection", designers:"Designers", journal:"Journal", showroom:"Showroom", contact:"Contact", about:"About", trade:"Trade program",
    tag:"Tirana · By appointment",
    heroH:"Furniture that holds history.",
    heroP:"Iconic pieces by the world's great designers, presented in Tirana by appointment.",
    explore:"Explore the collection", book:"Book a private visit",
    stmtH:"Where culture, art and design meet.",
    stmtP:"Eterna presents furniture as art: pieces with decades of history behind them, chosen for homes, offices and interiors that want to be remembered. We are the authorised partner in Albania for Fritz Hansen and Exteta.",
    ourBrands:"The houses we represent", discover:"Discover",
    icons:"Icons", iconsH:"Pieces people talk about", viewAll:"View the full collection",
    eggEy:"The story behind the piece", eggH:"A quiet place of your own",
    eggP:"In 1958 Arne Jacobsen drew the Egg™ for the lobby of the SAS Royal Hotel in Copenhagen, shaping it first by hand in wire and plaster. More than sixty years later, it still makes a busy room feel private.",
    designer:"Designer", year:"Year", maker:"Maker", seePiece:"See the piece",
    byRoom:"By room", byRoomH:"Find the right piece for the room",
    locusEy:"Archive re-edition", locusH:"Gae Aulenti, by the pool",
    locusP:"Locus Solus was designed in 1964 and became famous in the 1969 film La Piscine. Exteta has brought it back with the Archivio Aulenti, now in a Jacquemus edition.",
    readStory:"Read the story",
    jH:"From the journal", allArticles:"All articles",
    visitH:"See the pieces in person",
    visitP:"Our showroom in Tirana opens by appointment, so every visit is private and unhurried. Tell us which pieces interest you and we will have them ready.",
    whatsapp:"Message on WhatsApp", reply:"We reply within the hour.",
    footVision:"Iconic, timeless furniture for homes, offices and interiors in Albania.",
    follow:"Follow", visit:"Visit", byAppt:"Tirana, by appointment", rights:"Eterna · Timeless Design",
    all:"All", brand:"Brand", type:"Type", room:"Room", pieces:"pieces", piece:"piece", noMatch:"No pieces match these filters.", clear:"Clear filters",
    collH:"The collection", collP:"Lounge chairs, dining chairs, sofas, tables and lighting from Fritz Hansen and Exteta. Every piece can be ordered in its full range of finishes.",
    priceReq:"Price", onReq:"On request",
    askWA:"Ask about this piece on WhatsApp", reqDetails:"Request details and price", seeShowroom:"Book a visit to see it",
    story:"Story", materials:"Materials and finishes", dims:"Dimensions", dimsReq:"Full dimensions and the spec sheet are available on request.",
    delivery:"Ordering", deliveryT:"Made to order by the maker in your chosen finish. We confirm the lead time and delivery to your door when you order.",
    film:"Film", related:"You may also like", moreBy:"More by",
    formName:"Name", formContact:"Email or phone", formType:"I am", fPrivate:"A private client", fArch:"An architect or interior designer", fCompany:"A company", formMsg:"Message", formSend:"Prepare my request",
    formReq:"Please add your name and an email or phone number.",
    sentH:"Thank you, we have your request", sentP:"We will reply within the hour. For anything urgent, message us on WhatsApp.",
    doneH:"Your request is ready", doneP:"Send it on WhatsApp, or copy it and email it to us.", sendWA:"Send on WhatsApp", copy:"Copy request", copied:"Copied", copyFail:"Select the text above to copy it",
    waVisit:"Hello Eterna, I would like to book a private visit to the showroom.",
    waProduct:function(p){return "Hello Eterna, I'm interested in the "+p+". Could you send me details and the price?";},
    dH:"Designers", dP:"The architects and designers behind the pieces we present, from 1938 to today.",
    piecesBy:"Pieces by",
    jP:"Stories behind the pieces: the buildings, homes and films they were made for.",
    showH:"The showroom", showP:"A private showroom in Tirana, open by appointment only. We share the address when we confirm your visit.",
    showList:[["Visits","By appointment, usually confirmed the same day"],["Where","Tirana. The exact address is sent with your confirmation"],["Bring","Floor plans or photos of your space if you have them; we can advise on scale and finishes"]],
    bookH:"Book a visit", fDate:"Preferred date", fTime:"Preferred time", fMorning:"Morning", fAfternoon:"Afternoon", fEvening:"Evening", fInterest:"Pieces or brands of interest",
    tradeH:"For architects and interior designers", tradeP:"Eterna works alongside architects on residential, hospitality and office projects. We help you specify the right piece and supply it with the maker's full documentation.",
    tradeList:[["Specification","Spec sheets, finishes and dimensions for every piece"],["Catalogues","Brand catalogues and material samples where the maker allows"],["Project support","Help choosing pieces for your renders and client presentations"],["Terms","Trade terms for registered professionals, on request"]],
    applyH:"Apply to the trade program", fStudio:"Studio or company",
    aboutH:"About Eterna", aboutP:"Eterna brings the world's great furniture to Albania and presents it as it deserves: as design history you can live with.",
    aboutA:"We see a chair or a lamp as more than a functional object. The pieces we present were drawn by architects and designers who changed how we live, and many have been in production for decades. A piece like this, standing in a room, becomes something people talk about.",
    aboutB:"Eterna was founded in Tirana by Arch. Erik Premti. We are the authorised partner for Fritz Hansen and Exteta in Albania, and we work closely with architects to place each piece in the right space.",
    contactH:"Contact", contactP:"The quickest way to reach us is WhatsApp. We reply within the hour.",
    general:"General", quotes:"Quotes and orders", phoneL:"Phone and WhatsApp", instagram:"Instagram",
    writeH:"Write to us",
    back:"Back", close:"Close", prev:"Previous", next:"Next", view:"View", menu:"Menu", zoom:"Enlarge",
    notFound:"This page could not be found.", home:"Home"
  },
  sq: {
    collection:"Koleksioni", brands:"Markat",
    philosophy:"Filozofia", phH:"Eterna do të thotë e përjetshme.",
    phLead:"I sjellim në Shqipëri ikonat e mëdha të dizajnit të mobilieve sepse besojmë se meritojnë të ruhen, të kuptohen dhe të jetohen, jo vetëm të zotërohen.",
    phOpen:"Çdo pjesë që prezantojmë nisi si një ide që ndryshoi mënyrën si njerëzit ulen, mblidhen dhe jetojnë. Një karrige e modeluar me dorë me tel dhe allçi. Një kornizë çeliku e përkulur pa asnjë këputje. Një ndenjëse e thurur që ruan kujtesën e qëndisjes. Këto nuk janë produkte të një stine. Janë përgjigje ndaj pyetjeve që ende kanë rëndësi, dhe kanë jetuar më gjatë se njerëzit që i shtruan për herë të parë.",
    phWhyH:"Pse e bëjmë këtë",
    phWhy:"Eterna lindi nga një bindje e thjeshtë: dizajni i madh është trashëgimi kulturore, dhe trashëgimia ka nevojë për njerëz që kujdesen për të. Në një kohë mobiliesh të bëra për t'u zëvendësuar, ne zgjedhim pjesë të bëra për t'u ruajtur. Ruajtja e tyre nuk është nostalgji. Mban gjallë një bisedë mes projektuesve që ndryshuan shekullin XX dhe shtëpive, zyrave e interierëve të sotëm.",
    phMeanH:"Çfarë do të thonë këto pjesë për ne",
    phMean:"Për ne këto ikona kanë vlerë sentimentale. Mbartin duart e mjeshtrave që i bëjnë, vizionin e arkitektëve që i vizatuan dhe jetët e të gjithë atyre që janë ulur në to që atëherë. I festojmë sot sepse revolucioni i tyre nuk ka mbaruar: Egg ende krijon privatësi në një dhomë të zënë, dhe Series 7 ende tregon sa shumë mund të bëjë një fletë e vetme druri.",
    phPillarsH:"Çfarë mbajmë të shenjtë",
    phPillars:[["Dizajni","Studiojmë idenë para objektit: problemin që projektuesi donte të zgjidhte dhe vizatimin që e zgjidhi."],["Materialet","Lëkura, çeliku, rimeso, guri dhe fibra kanë secili karakterin e vet. Mësojmë si plaken, që t'ju tregojmë si do të jetojë një pjesë me ju."],["Trashëgimia","Çdo ikonë i përket një historie njerëzish, vendesh dhe vendimesh. E ruajmë atë histori me pjesën dhe e ndajmë me çdo klient."],["Shpirti","Një mobilie është më shumë se diçka për t'u përdorur. Është një formë me qëllim, me funksion dhe me shpirt."]],
    phQuote:"Jo objekte funksionale, por forma me qëllim, me funksion dhe shpirt.",
    phSacredH:"Të kuptuarit është mënyra si i nderojmë",
    phSacred:"Dizajni, materialet dhe trashëgimia janë të shenjta për ne. Vazhdimësia e dizajnit të madh është kulturore, sepse mbart kujtesën e një shoqërie. Ka ndikim, sepse formëson mënyrën si njerëzit jetojnë çdo ditë. Dhe ka qëllim, sepse një pjesë e bërë mirë bëhet për të zgjatur. Shpirti ynë ushqehet nga dëshira për t'i kuptuar këto pjesë, për t'i njohur dhe për t'u dhënë vendin që meritojnë.",
    phPromiseH:"Çfarë premtojmë",
    phPromise:[["Vetëm origjinale","Pjesë të autorizuara nga prodhuesit që mbajnë të drejtat e projektuesve. Kurrë kopje."],["Historia me çdo pjesë","Çdo pjesë vjen me projektuesin, vitin dhe arsyen pse ekziston."],["Syri i arkitektit","Ju ndihmojmë të zgjidhni përmasën, materialin dhe përfundimin për hapësirën tuaj."],["Koha","Showroom-i ynë hapet me takim, që çdo bisedë të jetë pa nxitim."]],
    phSign:"Çdo pjesë që vendosim është një akt i vogël ruajtjeje.",
    works:"Veprat", designed:"Projektuar", producedBy:"Prodhuar nga", dIntro:"Arkitektët dhe projektuesit pas pjesëve që prezantojmë, nga Bauhaus dhe modernizmi danez te Milano e sotme. Idetë e tyre ndryshuan mënyrën si jetojmë; emrat e tyre qëndrojnë me çdo pjesë.",
    readMore:"Lexo historinë", newArr:"Të reja", show:"Shfaq", allPieces:"Të gjitha pjesët", viewAllB:"Shiko të gjitha", aboutBrand:"Rreth markës", byType:"Sipas llojit", newTag:"E re", collOf:"Koleksioni", designers:"Projektuesit", journal:"Revista", showroom:"Showroom", contact:"Kontakt", about:"Rreth nesh", trade:"Programi profesional",
    tag:"Tiranë · Me takim",
    heroH:"Mobilie që mbartin histori.",
    heroP:"Pjesë ikonike nga projektuesit më të mëdhenj të botës, të prezantuara në Tiranë me takim.",
    explore:"Shiko koleksionin", book:"Rezervo një vizitë private",
    stmtH:"Aty ku takohen kultura, arti dhe dizajni.",
    stmtP:"Eterna i prezanton mobiliet si art: pjesë me dekada histori pas tyre, të zgjedhura për shtëpi, zyra dhe interierë që duan të mbahen mend. Jemi partneri i autorizuar në Shqipëri për Fritz Hansen dhe Exteta.",
    ourBrands:"Shtëpitë që përfaqësojmë", discover:"Zbulo",
    icons:"Ikona", iconsH:"Pjesë për të cilat flitet", viewAll:"Shiko gjithë koleksionin",
    eggEy:"Historia pas pjesës", eggH:"Një vend i qetë vetëm për ty",
    eggP:"Në 1958 Arne Jacobsen vizatoi Egg™ për hollin e SAS Royal Hotel në Kopenhagë, duke e modeluar fillimisht me dorë me tel dhe allçi. Më shumë se gjashtëdhjetë vjet më vonë, ende e bën një dhomë të zënë të ndihet private.",
    designer:"Projektuesi", year:"Viti", maker:"Prodhuesi", seePiece:"Shiko pjesën",
    byRoom:"Sipas hapësirës", byRoomH:"Gjej pjesën e duhur për çdo hapësirë",
    locusEy:"Ribotim arkivor", locusH:"Gae Aulenti, pranë pishinës",
    locusP:"Locus Solus u projektua në 1964 dhe u bë i famshëm në filmin La Piscine të 1969-ës. Exteta e ka rikthyer me Archivio Aulenti, tani në një botim Jacquemus.",
    readStory:"Lexo historinë",
    jH:"Nga revista", allArticles:"Të gjithë artikujt",
    visitH:"Shikojini pjesët nga afër",
    visitP:"Showroom-i ynë në Tiranë hapet me takim, që çdo vizitë të jetë private dhe pa nxitim. Na tregoni cilat pjesë ju interesojnë dhe do t'i kemi gati.",
    whatsapp:"Na shkruani në WhatsApp", reply:"Përgjigjemi brenda orës.",
    footVision:"Mobilie ikonike dhe të përjetshme për shtëpi, zyra dhe interierë në Shqipëri.",
    follow:"Na ndiqni", visit:"Vizitë", byAppt:"Tiranë, me takim", rights:"Eterna · Timeless Design",
    all:"Të gjitha", brand:"Marka", type:"Lloji", room:"Hapësira", pieces:"pjesë", piece:"pjesë", noMatch:"Asnjë pjesë nuk përputhet me këto filtra.", clear:"Pastro filtrat",
    collH:"Koleksioni", collP:"Kolltukë, karrige, divanë, tavolina dhe ndriçim nga Fritz Hansen dhe Exteta. Çdo pjesë mund të porositet në gamën e plotë të përfundimeve.",
    priceReq:"Çmimi", onReq:"Sipas kërkesës",
    askWA:"Pyetni për këtë pjesë në WhatsApp", reqDetails:"Kërkoni detaje dhe çmimin", seeShowroom:"Rezervoni një vizitë për ta parë",
    story:"Historia", materials:"Materialet dhe përfundimet", dims:"Përmasat", dimsReq:"Përmasat e plota dhe fleta teknike jepen sipas kërkesës.",
    delivery:"Porosia", deliveryT:"Prodhohet me porosi nga prodhuesi në përfundimin që zgjidhni. Afatin dhe dorëzimin deri në derë jua konfirmojmë kur porosisni.",
    film:"Film", related:"Mund t'ju pëlqejnë edhe", moreBy:"Më shumë nga",
    formName:"Emri", formContact:"Email ose telefon", formType:"Jam", fPrivate:"Klient privat", fArch:"Arkitekt ose projektues interieri", fCompany:"Kompani", formMsg:"Mesazhi", formSend:"Përgatit kërkesën",
    formReq:"Ju lutem shtoni emrin dhe një email ose numër telefoni.",
    sentH:"Faleminderit, e morëm kërkesën tuaj", sentP:"Do t'ju përgjigjemi brenda orës. Për diçka urgjente, na shkruani në WhatsApp.",
    doneH:"Kërkesa juaj është gati", doneP:"Dërgojeni në WhatsApp, ose kopjojeni dhe na e dërgoni me email.", sendWA:"Dërgo në WhatsApp", copy:"Kopjo kërkesën", copied:"U kopjua", copyFail:"Përzgjidhni tekstin më sipër për ta kopjuar",
    waVisit:"Përshëndetje Eterna, dëshiroj të rezervoj një vizitë private në showroom.",
    waProduct:function(p){return "Përshëndetje Eterna, më intereson "+p+". Mund të më dërgoni detaje dhe çmimin?";},
    dH:"Projektuesit", dP:"Arkitektët dhe projektuesit pas pjesëve që prezantojmë, nga 1938 deri sot.",
    piecesBy:"Pjesë nga",
    jP:"Historitë pas pjesëve: ndërtesat, shtëpitë dhe filmat për të cilët u krijuan.",
    showH:"Showroom-i", showP:"Një showroom privat në Tiranë, i hapur vetëm me takim. Adresën jua dërgojmë kur konfirmojmë vizitën.",
    showList:[["Vizitat","Me takim, zakonisht të konfirmuara të njëjtën ditë"],["Ku","Tiranë. Adresa e saktë dërgohet me konfirmimin"],["Sillni","Planimetri ose foto të hapësirës nëse i keni; ju këshillojmë për përmasat dhe përfundimet"]],
    bookH:"Rezervo një vizitë", fDate:"Data e preferuar", fTime:"Ora e preferuar", fMorning:"Mëngjes", fAfternoon:"Pasdite", fEvening:"Mbrëmje", fInterest:"Pjesët ose markat që ju interesojnë",
    tradeH:"Për arkitektë dhe projektues interieri", tradeP:"Eterna punon krah arkitektëve në projekte banimi, hoteliere dhe zyrash. Ju ndihmojmë të specifikoni pjesën e duhur dhe e furnizojmë me dokumentacionin e plotë të prodhuesit.",
    tradeList:[["Specifikimi","Fleta teknike, përfundime dhe përmasa për çdo pjesë"],["Katalogët","Katalogë të markave dhe mostra materialesh kur prodhuesi e lejon"],["Mbështetje projekti","Ndihmë në zgjedhjen e pjesëve për renderat dhe prezantimet tuaja"],["Kushtet","Kushte profesionale për profesionistët e regjistruar, sipas kërkesës"]],
    applyH:"Apliko në programin profesional", fStudio:"Studio ose kompania",
    aboutH:"Rreth Eterna", aboutP:"Eterna sjell në Shqipëri mobiliet më të mira të botës dhe i prezanton siç e meritojnë: si histori dizajni me të cilën mund të jetosh.",
    aboutA:"Një karrige apo një llambë për ne është më shumë se një objekt funksional. Pjesët që prezantojmë u vizatuan nga arkitektë dhe projektues që ndryshuan mënyrën si jetojmë, dhe shumë prej tyre prodhohen prej dekadash. Një pjesë e tillë, e vendosur në një dhomë, bëhet diçka për të cilën flasin njerëzit.",
    aboutB:"Eterna u themelua në Tiranë nga Ark. Erik Premti. Jemi partneri i autorizuar për Fritz Hansen dhe Exteta në Shqipëri dhe punojmë ngushtë me arkitektët për të vendosur çdo pjesë në hapësirën e duhur.",
    contactH:"Kontakt", contactP:"Mënyra më e shpejtë për të na gjetur është WhatsApp. Përgjigjemi brenda orës.",
    general:"Të përgjithshme", quotes:"Oferta dhe porosi", phoneL:"Telefon dhe WhatsApp", instagram:"Instagram",
    writeH:"Na shkruani",
    back:"Kthehu", close:"Mbyll", prev:"Para", next:"Pas", view:"Shiko", menu:"Menu", zoom:"Zmadho",
    notFound:"Kjo faqe nuk u gjet.", home:"Kreu"
  }
};
function t(k){ return T[lang][k]; }
window.ETERNA_T = T; // exposed for db-loader overrides
function L(o){ return o ? (o[lang] || o.en) : ""; }
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); }
function img(n){ return "img/" + n + ".webp"; }
function byId(id){ for (var i=0;i<D.products.length;i++) if (D.products[i].id===id) return D.products[i]; return null; }
function waLink(text){ return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text); }
var WAICO = '<svg class="wa-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3Z"/></svg>';

function wl(p){
  var d = D.designers[p.designer];
  return '<div class="wl"><span class="n">'+esc(p.name)+'</span><span class="d">'+esc(d.name)+(p.year?', '+p.year:'')+'</span><span class="b">'+esc(D.brands[p.brand].name)+'</span></div>';
}
function card(p, i){
  var alt = p.imgs[1] ? '<img class="alt" src="'+img(p.imgs[1])+'" alt="" loading="lazy">' : '';
  return '<a class="card" href="#p.'+p.id+'"><div class="pic">'+(p.isNew?'<span class="nb">'+t("newTag")+'</span>':'')+'<img src="'+img(p.imgs[0])+'" alt="'+esc(p.name)+'" loading="'+(i<4?'eager':'lazy')+'">'+alt+'</div>'+wl(p)+'</a>';
}

/* ---------- shell ---------- */
var app = document.getElementById("app");
function header(over){
  var r = route().name;
  function a(h,k){ return '<a href="#'+h+'"'+(r===h?' class="on"':'')+'>'+t(k)+'</a>'; }
  return '<header class="hdr'+(over?' over':'')+'" id="hdr"><div class="wrap in">'+
    '<nav class="l" aria-label="Main"><button class="ddt'+((r==="collection"||r==="c"||r==="room"||r==="cat")?' on':'')+'" id="ddt" aria-expanded="false" aria-controls="ddp">'+t("collection")+'<span class="car" aria-hidden="true"></span></button>'+a("designers","designers")+a("journal","journal")+'</nav>'+
    '<button class="burger" id="burger" aria-label="'+t("menu")+'"><span></span></button>'+
    '<a href="#home" class="logo mark" aria-label="Eterna home">ETERNA</a>'+
    '<nav class="r" aria-label="Secondary">'+'<span class="hide-m">'+a("about","philosophy")+a("showroom","showroom")+a("contact","contact")+'</span>'+
    '<span class="lang" role="group" aria-label="Language"><button data-lang="sq" class="'+(lang==="sq"?"on":"")+'">AL</button><span aria-hidden="true">/</span><button data-lang="en" class="'+(lang==="en"?"on":"")+'">EN</button></span></nav>'+
  '</div>'+megaPanel()+'</header>';
}
function brandCats(k){ return Object.keys(D.cats).filter(function(c){ return D.products.some(function(p){return p.brand===k&&p.cat===c;}); }); }
function megaPanel(){
  function col(k){
    var b = D.brands[k], n = D.products.filter(function(p){return p.brand===k;}).length;
    return '<div class="mcol"><a class="mh" href="#c.'+k+'">'+b.name+'<span>'+n+'</span></a><ul>'+
      brandCats(k).map(function(c){return '<li><a href="#c.'+k+'.'+c+'">'+L(D.cats[c])+'</a></li>';}).join("")+
      '</ul><div class="mfoot"><a href="#c.'+k+'">'+t("viewAllB")+'</a><a href="#brand.'+k+'">'+t("aboutBrand")+'</a></div></div>';
  }
  var nw = D.products.filter(function(p){return p.isNew;});
  var feat = byId("after-series") || nw[0];
  return '<div class="mega" id="ddp" role="region" aria-label="'+t("collection")+'"><div class="wrap mgrid">'+
    '<div class="mcol"><a class="mh" href="#collection">'+t("allPieces")+'<span>'+D.products.length+'</span></a><ul><li><a href="#c.new">'+t("newArr")+' ('+nw.length+')</a></li>'+
      Object.keys(D.cats).map(function(c){return '<li><a href="#cat.'+c+'">'+L(D.cats[c])+'</a></li>';}).join("")+'</ul></div>'+
    col("fritz-hansen")+col("exteta")+
    '<a class="mfeat" href="#p.'+feat.id+'"><div class="pic"><img src="'+img(feat.imgs[0])+'" alt="" loading="lazy"></div><span class="label">'+t("newArr")+'</span><span class="n">'+esc(feat.name)+'</span><span class="d">'+esc(D.designers[feat.designer].name)+'</span></a>'+
  '</div></div>';
}
function footer(){
  return '<footer><div class="wrap"><div class="in">'+
    '<div><a href="#home" class="logo mark">ETERNA</a><p style="margin-top:16px;max-width:36ch;opacity:.8;font-size:var(--fs-s)">'+t("footVision")+'</p></div>'+
    '<div><h4>'+t("collection")+'</h4><ul><li><a href="#collection">'+t("collection")+'</a></li><li><a href="#brand.fritz-hansen">Fritz Hansen</a></li><li><a href="#brand.exteta">Exteta</a></li><li><a href="#designers">'+t("designers")+'</a></li><li><a href="#journal">'+t("journal")+'</a></li></ul></div>'+
    '<div><h4>'+t("visit")+'</h4><ul><li><a href="#showroom">'+t("showroom")+'</a></li><li><a href="#trade">'+t("trade")+'</a></li><li><a href="#about">'+t("philosophy")+'</a></li><li><a href="#contact">'+t("contact")+'</a></li></ul></div>'+
    '<div><h4>'+t("contact")+'</h4><ul><li><a href="'+waLink("Hello Eterna")+'" target="_blank" rel="noopener">WhatsApp '+PHONE+'</a></li><li><span style="user-select:all">'+INFO+'</span></li><li><span style="user-select:all">'+SALES+'</span></li><li><a href="https://instagram.com/'+IG+'" target="_blank" rel="noopener">@'+IG+'</a></li><li>'+t("byAppt")+'</li></ul></div>'+
  '</div><div class="base"><span>© 2026 '+t("rights")+'</span><span>Tirana, Albania</span></div></div></footer>';
}
function fab(text){ return '<a class="fab" href="'+waLink(text||"Hello Eterna")+'" target="_blank" rel="noopener" aria-label="WhatsApp">'+WAICO+'<span class="t">WhatsApp</span></a>'; }

/* ---------- pages ---------- */
function pHome(){
  var f = D.products.filter(function(p){return p.featured;});
  var egg = byId("egg-chair"), locus = byId("locus-solus");
  var roomsImg = {living:"lissoni-1", dining:"oscar-1", work:"oxford-1", outdoor:"rivasofa-1"};
  return '<section class="hero"><img class="poster" src="img/hero-poster.webp" alt=""><video id="herov" autoplay muted loop playsinline preload="auto" poster="img/hero-poster.webp"><source src="video/hero.mp4" type="video/mp4"></video>'+
    '<div class="wrap in fade"><span class="label">'+t("tag")+'</span><h1 style="margin-top:18px">'+t("heroH")+'</h1><div class="row"><p class="lead">'+t("heroP")+'</p><div class="btns"><a class="btn solid" href="#collection">'+t("explore")+'</a><a class="btn line" href="#showroom">'+t("book")+'</a></div></div></div></section>'+
  '<section class="sec"><div class="wrap statement"><h2>'+t("stmtH")+'</h2><div><p>'+t("stmtP")+'</p><a class="more" style="display:inline-block;margin-top:20px" href="#about">'+t("philosophy")+'</a></div></div></section>'+
  '<section class="sec tight" style="padding-top:0"><div class="wrap"><div class="sec-h"><span class="label muted">'+t("ourBrands")+'</span></div><div class="split">'+
    ["fritz-hansen","exteta"].map(function(k){var b=D.brands[k];return '<a class="bcard" href="#brand.'+k+'"><img src="'+img(b.hero)+'" alt="'+b.name+'" loading="lazy"><div class="t"><span class="label">'+L(b.origin)+'</span><h3>'+b.name+'</h3><p>'+L(b.intro)+'</p><span class="more" style="align-self:flex-start;margin-top:6px">'+t("discover")+'</span></div></a>';}).join("")+
  '</div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="sec-h"><div><span class="label muted">'+t("icons")+'</span><h2 style="margin-top:12px">'+t("iconsH")+'</h2></div><a class="more" href="#collection">'+t("viewAll")+'</a></div><div class="rail">'+f.map(card).join("")+'</div></div></section>'+
  '<section class="sec" style="background:var(--stone)"><div class="wrap feat"><div class="media" style="aspect-ratio:1"><video autoplay muted loop playsinline preload="metadata" poster="img/egg-poster.webp"><source src="video/egg.mp4" type="video/mp4"></video></div>'+
    '<div class="txt"><span class="label muted">'+t("eggEy")+'</span><h2>'+t("eggH")+'</h2><p>'+t("eggP")+'</p><dl class="meta"><dt>'+t("designer")+'</dt><dd>Arne Jacobsen</dd><dt>'+t("year")+'</dt><dd>1958</dd><dt>'+t("maker")+'</dt><dd>Fritz Hansen</dd></dl><div class="btns"><a class="btn dark" href="#p.egg-chair">'+t("seePiece")+'</a><a class="btn line" href="#j.royal-hotel">'+t("readStory")+'</a></div></div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="sec-h"><div><span class="label muted">'+t("byRoom")+'</span><h2 style="margin-top:12px">'+t("byRoomH")+'</h2></div></div><div class="rooms">'+
    Object.keys(D.rooms).map(function(k){return '<a class="room" href="#room.'+k+'"><img src="'+img(roomsImg[k])+'" alt="" loading="lazy"><span>'+L(D.rooms[k])+'</span></a>';}).join("")+'</div></div></section>'+
  '<section class="sec" style="padding-top:0"><div class="wrap feat rev"><div class="media" style="aspect-ratio:4/5;max-height:820px"><video autoplay muted loop playsinline preload="metadata" poster="img/locus-poster.webp"><source src="video/locus.mp4" type="video/mp4"></video></div>'+
    '<div class="txt"><span class="label muted">'+t("locusEy")+'</span><h2>'+t("locusH")+'</h2><p>'+t("locusP")+'</p><dl class="meta"><dt>'+t("designer")+'</dt><dd>Gae Aulenti</dd><dt>'+t("year")+'</dt><dd>1964</dd><dt>'+t("maker")+'</dt><dd>Exteta × Jacquemus</dd></dl><div class="btns"><a class="btn dark" href="#p.locus-solus">'+t("seePiece")+'</a><a class="btn line" href="#j.la-piscine">'+t("readStory")+'</a></div></div></div></section>'+
  '<section class="sec" style="padding-top:0"><div class="wrap"><div class="sec-h"><h2>'+t("jH")+'</h2><a class="more" href="#journal">'+t("allArticles")+'</a></div>'+journalGrid()+'</div></section>'+
  visitBand();
}
function visitBand(){
  return '<section class="band sec tight"><div class="wrap in"><div><h2>'+t("visitH")+'</h2><p class="muted" style="margin-top:18px">'+t("visitP")+'</p><div class="copyrow"><span>WhatsApp <b>'+PHONE+'</b></span><span><b>'+SALES+'</b></span></div></div>'+
    '<div class="btns" style="justify-content:flex-start"><a class="btn solid" href="'+waLink(t("waVisit"))+'" target="_blank" rel="noopener">'+WAICO+t("whatsapp")+'</a><a class="btn line" href="#showroom">'+t("book")+'</a></div></div></section>';
}
function journalGrid(){
  return '<div class="jgrid">'+D.journal.map(function(j){return '<a class="jcard" href="#j.'+j.id+'"><div class="pic"><img src="'+img(j.img)+'" alt="" loading="lazy"></div><h3>'+L(j.title)+'</h3><p>'+L(j.dek)+'</p></a>';}).join("")+'</div>';
}

var F = {brand:"", cat:"", room:"", isNew:""};
function pCollection(preset){
  if (preset) { F = {brand:"",cat:"",room:"",isNew:""}; for (var k in preset) F[k] = preset[k]; }
  var b = F.brand && D.brands[F.brand];
  var h1 = F.isNew ? t("newArr") : b ? b.name : t("collH");
  var lead = b ? L(b.intro) : t("collP");
  return '<div class="wrap"><div class="phead"><div class="crumbs"><a href="#home">'+t("home")+'</a><span>/</span><a href="#collection">'+t("collection")+'</a>'+(b?'<span>/</span><span>'+b.name+'</span>':'')+'</div><h1>'+h1+'</h1><p>'+lead+'</p>'+(b?'<p style="margin-top:14px"><a class="more" href="#brand.'+F.brand+'">'+t("aboutBrand")+'</a></p>':'')+'</div>'+
    '<div class="filters" id="filters"></div><div class="count" id="count"></div><div class="grid" id="grid"></div></div>';
}
function renderFilters(){
  var el = document.getElementById("filters"); if (!el) return;
  function row(key, label, opts){
    return '<div class="frow"><span class="label">'+label+'</span><button class="chip'+(!F[key]?' on':'')+'" data-f="'+key+'" data-v="">'+t("all")+'</button>'+
      opts.map(function(o){return '<button class="chip'+(F[key]===o[0]?' on':'')+'" data-f="'+key+'" data-v="'+o[0]+'">'+esc(o[1])+'</button>';}).join("")+'</div>';
  }
  el.innerHTML = row("brand", t("brand"), [["fritz-hansen","Fritz Hansen"],["exteta","Exteta"]]) +
    row("cat", t("type"), Object.keys(D.cats).map(function(k){return [k,L(D.cats[k])];})) +
    row("room", t("room"), Object.keys(D.rooms).map(function(k){return [k,L(D.rooms[k])];})) +
    row("isNew", t("show"), [["1",t("newArr")]]);
  var list = D.products.filter(function(p){ return (!F.brand||p.brand===F.brand)&&(!F.cat||p.cat===F.cat)&&(!F.room||p.rooms.indexOf(F.room)>-1)&&(!F.isNew||p.isNew); });
  document.getElementById("count").textContent = list.length + " " + (list.length===1?t("piece"):t("pieces"));
  document.getElementById("grid").innerHTML = list.length ? list.map(card).join("") : '<div class="empty">'+t("noMatch")+' <button class="more" data-clear="1">'+t("clear")+'</button></div>';
}

function pBrand(k){
  var b = D.brands[k]; if (!b) return null;
  var list = D.products.filter(function(p){return p.brand===k;});
  var vid = b.video ? '<div class="feat" style="margin-bottom:clamp(48px,7vw,96px)"><div class="media" style="aspect-ratio:1"><video autoplay muted loop playsinline preload="metadata" poster="img/'+b.video+'-poster.webp"><source src="video/'+b.video+'.mp4" type="video/mp4"></video></div><div class="txt"><span class="label muted">Egg™ Chair · 1958</span><h2>'+t("eggH")+'</h2><p>'+t("eggP")+'</p><a class="btn dark" style="align-self:flex-start" href="#p.egg-chair">'+t("seePiece")+'</a></div></div>' : '';
  return '<section class="hero" style="height:min(72vh,760px)"><img class="poster" src="'+img(b.hero)+'" alt="'+b.name+'"><div class="wrap in fade"><span class="label">'+L(b.origin)+'</span><h1 style="margin-top:16px">'+b.name+'</h1><p class="lead" style="margin-top:20px;max-width:56ch">'+L(b.intro)+'</p></div></section>'+
    '<div class="wrap sec">'+vid+'<div class="sec-h"><h2>'+b.name+' · '+list.length+' '+t("pieces")+'</h2></div><div class="grid">'+list.map(card).join("")+'</div></div>'+visitBand();
}

function pProduct(id){
  var p = byId(id); if (!p) return null;
  var d = D.designers[p.designer], b = D.brands[p.brand];
  var thumbs = p.imgs.length>1 ? '<div class="thumbs">'+p.imgs.map(function(n,i){return '<button data-i="'+i+'" class="'+(i?'':'on')+'" aria-label="'+t("view")+' '+(i+1)+'"><img src="'+img(n)+'" alt="" loading="lazy"></button>';}).join("")+'</div>' : '';
  var rel = D.products.filter(function(q){return q.id!==p.id && (q.designer===p.designer);});
  if (rel.length<4) rel = rel.concat(D.products.filter(function(q){return q.id!==p.id && q.designer!==p.designer && q.cat===p.cat;})).slice(0,4);
  rel = rel.slice(0,4);
  var film = p.video ? '<section class="sec tight" style="padding-bottom:0"><div class="feat"><div class="media" style="aspect-ratio:'+(p.video==="egg"?"1":"4/5")+';max-height:760px"><video autoplay muted loop playsinline preload="metadata" poster="img/'+p.video+'-poster.webp"><source src="video/'+p.video+'.mp4" type="video/mp4"></video></div><div class="txt"><span class="label muted">'+t("film")+'</span><h2>'+esc(p.name)+'</h2><p>'+esc(d.name)+(p.year?', '+p.year:'')+' · '+b.name+'</p></div></div></section>' : '';
  return '<div class="wrap"><div class="crumbs" style="padding-top:28px"><a href="#home">'+t("home")+'</a><span>/</span><a href="#collection">'+t("collection")+'</a><span>/</span><a href="#brand.'+p.brand+'">'+b.name+'</a></div>'+
    '<div class="prod"><div class="gal"><div class="main" id="gmain" role="button" tabindex="0" aria-label="'+t("zoom")+'"><img id="gimg" src="'+img(p.imgs[0])+'" alt="'+esc(p.name)+'"><span class="zoom">'+t("zoom")+'</span></div>'+thumbs+'</div>'+
    '<div class="info"><div class="stick"><span class="label brand">'+b.name+'</span><h1>'+esc(p.name)+'</h1><p class="by"><a href="#d.'+p.designer+'">'+esc(d.name)+'</a>'+(p.year?', '+p.year:'')+'</p>'+
      '<div class="price"><span>'+t("priceReq")+'</span><span>'+t("onReq")+'</span></div>'+
      '<p class="story">'+esc(L(p.story))+'</p>'+
      '<div class="acts"><a class="btn dark" href="'+waLink(t("waProduct")(p.name+" ("+b.name+")"))+'" target="_blank" rel="noopener">'+WAICO+t("askWA")+'</a><a class="btn line" href="#inquire" data-scroll="inquire">'+t("reqDetails")+'</a><a class="btn line" href="#showroom">'+t("seeShowroom")+'</a></div>'+
      '<div class="specs"><details open><summary>'+t("materials")+'</summary><div class="body">'+L(p.materials).split(" · ").map(function(x){return '<span>'+esc(x)+'</span>';}).join("")+'</div></details>'+
      '<details><summary>'+t("dims")+'</summary><div class="body"><span>'+(p.dims?esc(p.dims):"")+'</span><span>'+t("dimsReq")+'</span></div></details>'+
      '<details><summary>'+t("delivery")+'</summary><div class="body"><span>'+t("deliveryT")+'</span></div></details></div>'+
    '</div></div></div>'+film+
    '<section class="sec tight" id="inquire"><div class="feat" style="align-items:start"><div class="txt"><span class="label muted">'+esc(p.name)+'</span><h2>'+t("reqDetails")+'</h2><p>'+t("reply")+'</p></div>'+form("product", p.name+" ("+b.name+")")+'</div></section>'+
    '<section class="sec tight" style="padding-top:0"><div class="sec-h"><h2>'+t("related")+'</h2><a class="more" href="#d.'+p.designer+'">'+t("moreBy")+' '+esc(d.name)+'</a></div><div class="grid">'+rel.map(card).join("")+'</div></section></div>';
}

function form(kind, subject){
  var extra = "";
  if (kind==="visit") extra = '<div class="two"><div class="fld"><label for="f-date">'+t("fDate")+'</label><input id="f-date" name="date" type="date"></div><div class="fld"><label for="f-time">'+t("fTime")+'</label><select id="f-time" name="time"><option>'+t("fMorning")+'</option><option>'+t("fAfternoon")+'</option><option>'+t("fEvening")+'</option></select></div></div>';
  if (kind==="trade") extra = '<div class="fld"><label for="f-studio">'+t("fStudio")+'</label><input id="f-studio" name="studio" autocomplete="organization"></div>';
  return '<form class="form" data-kind="'+kind+'" data-subject="'+esc(subject||"")+'" novalidate>'+
    '<div class="two"><div class="fld"><label for="f-name-'+kind+'">'+t("formName")+'</label><input id="f-name-'+kind+'" name="name" autocomplete="name"></div><div class="fld"><label for="f-contact-'+kind+'">'+t("formContact")+'</label><input id="f-contact-'+kind+'" name="contact" autocomplete="email"></div></div>'+
    (kind!=="trade" ? '<div class="fld"><label for="f-type-'+kind+'">'+t("formType")+'</label><select id="f-type-'+kind+'" name="type"><option>'+t("fPrivate")+'</option><option>'+t("fArch")+'</option><option>'+t("fCompany")+'</option></select></div>' : '')+
    extra+
    '<div class="fld"><label for="f-msg-'+kind+'">'+(kind==="visit"?t("fInterest"):t("formMsg"))+'</label><textarea id="f-msg-'+kind+'" name="msg"></textarea></div>'+
    '<p class="err" hidden></p><button class="btn dark" type="submit" style="justify-self:start">'+t("formSend")+'</button></form>';
}
function onSubmit(e){
  var f = e.target; if (!f.matches || !f.matches("form.form")) return;
  e.preventDefault();
  var v = function(n){ var el=f.elements[n]; return el ? el.value.trim() : ""; };
  var err = f.querySelector(".err");
  if (!v("name") || !v("contact")) { err.textContent = t("formReq"); err.hidden = false; return; }
  var kind = f.getAttribute("data-kind"), subj = f.getAttribute("data-subject");
  var head = {product:"Inquiry: "+subj, visit:"Showroom visit request", trade:"Trade program application", contact:"Message from the website"}[kind];
  var lines = [head, "Name: "+v("name"), "Contact: "+v("contact")];
  if (v("type")) lines.push("Client: "+v("type"));
  if (v("studio")) lines.push("Studio: "+v("studio"));
  if (v("date")) lines.push("Date: "+v("date")+(v("time")?" ("+v("time")+")":""));
  if (v("msg")) lines.push("", v("msg"));
  var text = lines.join("\n");
  if (window.ETERNA_NETLIFY) {
    var body = new URLSearchParams({"form-name": kind, subject: subj||head, name: v("name"), contact: v("contact"), type: v("type"), studio: v("studio"), date: v("date"), time: v("time"), msg: v("msg")});
    var btn = f.querySelector("button[type=submit]"); if (btn) btn.disabled = true;
    fetch("/", {method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body: body.toString()})
      .then(function(r){ if (!r.ok) throw 0; var ok = document.createElement("div"); ok.className = "done fade";
        ok.innerHTML = '<h3 style="font-size:var(--fs-m)">'+t("sentH")+'</h3><p class="muted">'+t("sentP")+'</p><div class="btns"><a class="btn line" href="'+waLink(text)+'" target="_blank" rel="noopener">'+WAICO+t("whatsapp")+'</a></div>';
        f.replaceWith(ok); })
      .catch(function(){ manual(f, text); });
    return;
  }
  manual(f, text);
}
function manual(f, text){
  var box = document.createElement("div"); box.className = "done fade";
  box.innerHTML = '<h3 style="font-size:var(--fs-m)">'+t("doneH")+'</h3><p class="muted">'+t("doneP")+'</p><pre>'+esc(text)+'</pre>'+
    '<div class="btns"><a class="btn dark" href="'+waLink(text)+'" target="_blank" rel="noopener">'+WAICO+t("sendWA")+'</a><button class="btn line" type="button" data-copy="1">'+t("copy")+'</button></div><p class="muted" style="font-size:var(--fs-s)">'+SALES+'</p>';
  box.querySelector("[data-copy]").addEventListener("click", function(ev){
    var b = ev.currentTarget;
    try { navigator.clipboard.writeText(text).then(function(){ b.textContent = t("copied"); }, function(){ b.textContent = t("copyFail"); selectPre(box); }); }
    catch(x){ b.textContent = t("copyFail"); selectPre(box); }
  });
  f.replaceWith(box);
}
function selectPre(box){ var r=document.createRange(); r.selectNodeContents(box.querySelector("pre")); var s=getSelection(); s.removeAllRanges(); s.addRange(r); }

function portrait(k){ var d=D.designers[k]; return d.portrait ? "img/portrait-"+k+".webp" : img(d.img); }
function pDesigners(){
  var keys = D.designerOrder || Object.keys(D.designers);
  return '<div class="wrap"><div class="phead"><span class="label muted">'+t("designers")+'</span><h1 style="margin-top:16px">'+t("dH")+'</h1><p>'+t("dIntro")+'</p></div><div class="dlist sec" style="padding-top:0">'+
    keys.map(function(k){var d=D.designers[k];var w=(d.works||[]).filter(function(x){return x[1];}).slice(0,3).map(function(x){return esc(x[0].replace(/™/g,""))+' '+x[1];}).join(' · ');
      return '<a class="card dcard" href="#d.'+k+'"><div class="pic bw"><img src="'+portrait(k)+'" alt="'+esc(d.name)+'" loading="lazy"></div><div class="wl"><span class="n">'+esc(d.name)+'</span><span class="d">'+esc(d.life)+(d.life?' · ':'')+L(d.country)+'</span>'+(w?'<span class="w">'+w+'</span>':'')+'</div></a>';}).join("")+'</div></div>';
}
function pDesigner(k){
  var d = D.designers[k]; if (!d) return null;
  var list = D.products.filter(function(p){return p.designer===k;});
  var st = d.story ? L(d.story) : [L(d.bio)];
  var works = (d.works||[]).slice().sort(function(a,b){return (a[1]||9999)-(b[1]||9999);});
  return '<div class="wrap"><div class="crumbs" style="padding-top:28px"><a href="#designers">'+t("designers")+'</a></div>'+
    '<section class="dhero"><div class="pic bw"><img src="'+portrait(k)+'" alt="'+esc(d.name)+'"></div><div class="txt"><span class="label muted">'+esc(d.life)+(d.life?' · ':'')+L(d.country)+'</span><h1>'+esc(d.name)+'</h1>'+st.map(function(p,i){return '<p'+(i===0?' class="first"':'')+'>'+esc(p)+'</p>';}).join("")+'</div></section>'+
    (works.length?'<section class="sec tight"><div class="sec-h"><h2>'+t("works")+'</h2></div><div class="tbl"><table class="works"><thead><tr><th>'+t("designed")+'</th><th>'+t("works")+'</th><th>'+t("producedBy")+'</th></tr></thead><tbody>'+
      works.map(function(w){return '<tr><td class="y">'+(w[1]||'—')+'</td><td>'+(w[3]?'<a href="#p.'+w[3]+'">'+esc(w[0])+'</a>':esc(w[0]))+'</td><td class="muted">'+esc(w[2])+'</td></tr>';}).join("")+'</tbody></table></div></section>':'')+
    '<div class="sec-h"><h2>'+t("piecesBy")+' '+esc(d.name)+'</h2></div><div class="grid" style="margin-bottom:clamp(64px,10vw,140px)">'+list.map(card).join("")+'</div></div>';
}
function pJournal(){
  return '<div class="wrap"><div class="phead"><h1>'+t("journal")+'</h1><p>'+t("jP")+'</p></div><div class="sec" style="padding-top:0">'+journalGrid()+'</div></div>';
}
function pArticle(id){
  var j = D.journal.filter(function(x){return x.id===id;})[0]; if (!j) return null;
  return '<article class="wrap sec" style="padding-top:clamp(32px,5vw,64px)"><div class="art"><div class="crumbs"><a href="#journal">'+t("journal")+'</a></div><h1 style="font-size:var(--fs-xl)">'+L(j.title)+'</h1><p class="dek">'+L(j.dek)+'</p></div>'+
    '<div class="cover" style="max-width:1100px;margin-inline:auto;margin-bottom:48px"><img src="'+img(j.img)+'" alt=""></div><div class="art">'+L(j.body).map(function(p){return '<p>'+esc(p)+'</p>';}).join("")+'</div>'+
    '<div style="margin-top:64px"><div class="sec-h"><h2>'+t("seePiece")+'</h2></div><div class="grid">'+j.related.map(function(id,i){return card(byId(id),i);}).join("")+'</div></div></article>';
}
function pShowroom(){
  return '<section class="hero" style="height:min(64vh,700px)"><img class="poster" src="img/ex-salone-1.webp" alt=""><div class="wrap in fade"><span class="label">'+t("tag")+'</span><h1 style="margin-top:16px">'+t("showH")+'</h1><p class="lead" style="margin-top:18px">'+t("showP")+'</p></div></section>'+
    '<div class="wrap sec"><div class="cols"><ul class="list">'+t("showList").map(function(r){return '<li><b>'+r[0]+'</b><span>'+r[1]+'</span></li>';}).join("")+'</ul><div><h2 style="font-size:var(--fs-l);margin-bottom:28px">'+t("bookH")+'</h2>'+form("visit")+'</div></div></div>';
}
function pTrade(){
  return '<div class="wrap"><div class="phead"><span class="label muted">'+t("trade")+'</span><h1 style="margin-top:16px">'+t("tradeH")+'</h1><p>'+t("tradeP")+'</p></div><div class="cols sec" style="padding-top:0"><ul class="list">'+t("tradeList").map(function(r){return '<li><b>'+r[0]+'</b><span>'+r[1]+'</span></li>';}).join("")+'</ul><div><h2 style="font-size:var(--fs-l);margin-bottom:28px">'+t("applyH")+'</h2>'+form("trade")+'</div></div></div>';
}
function pAbout(){
  return '<section class="ph-hero"><div class="wrap"><span class="label">'+t("philosophy")+'</span><h1>'+t("phH")+'</h1><p>'+t("phLead")+'</p></div></section>'+
    '<section class="wrap sec"><p class="ph-open">'+t("phOpen")+'</p><div class="cols" style="margin-top:clamp(48px,7vw,96px)"><div><h2 class="ph-h">'+t("phWhyH")+'</h2><p>'+t("phWhy")+'</p></div><div><h2 class="ph-h">'+t("phMeanH")+'</h2><p>'+t("phMean")+'</p></div></div></section>'+
    '<section class="ph-quote bw"><img src="img/egg-5.webp" alt="" loading="lazy"><div class="wrap"><blockquote>'+t("phQuote")+'</blockquote></div></section>'+
    '<section class="wrap sec"><div class="sec-h"><h2>'+t("phPillarsH")+'</h2></div><div class="pillars">'+t("phPillars").map(function(x){return '<div class="pillar"><h3>'+x[0]+'</h3><p>'+x[1]+'</p></div>';}).join("")+'</div></section>'+
    '<section class="sec" style="background:var(--stone)"><div class="wrap feat"><div class="media bw" style="aspect-ratio:4/5;max-height:760px"><img src="img/pk111-1.webp" alt="" loading="lazy"></div><div class="txt"><h2>'+t("phSacredH")+'</h2><p style="color:var(--ink)">'+t("phSacred")+'</p></div></div></section>'+
    '<section class="wrap sec"><div class="sec-h"><h2>'+t("phPromiseH")+'</h2></div><ul class="list">'+t("phPromise").map(function(r){return '<li><b>'+r[0]+'</b><span>'+r[1]+'</span></li>';}).join("")+'</ul>'+
    '<div class="sign"><p>'+t("phSign")+'</p><span class="mark">ETERNA</span><span class="muted">Arch. Erik Premti · Tirana</span></div></section>'+visitBand();
}
function pContact(){
  function row(l,v,h){ return '<li><b>'+l+'</b><span class="contact-big">'+(h?'<a href="'+h+'" target="_blank" rel="noopener">'+v+'</a>':v)+'</span></li>'; }
  return '<div class="wrap"><div class="phead"><h1>'+t("contactH")+'</h1><p>'+t("contactP")+'</p></div><div class="cols sec" style="padding-top:0"><ul class="list">'+
    row(t("phoneL"),PHONE,waLink("Hello Eterna"))+row(t("general"),INFO)+row(t("quotes"),SALES)+row(t("instagram"),"@"+IG,"https://instagram.com/"+IG)+row(t("showroom"),t("byAppt"))+
    '</ul><div><h2 style="font-size:var(--fs-l);margin-bottom:28px">'+t("writeH")+'</h2>'+form("contact")+'</div></div></div>';
}
function p404(){ return '<div class="wrap phead"><h1>'+t("notFound")+'</h1><p><a class="more" href="#home">'+t("home")+'</a></p></div>'; }

/* ---------- router ---------- */
function route(){
  var h = (location.hash||"").replace(/^#/,"") || "home";
  var i = h.indexOf(".");
  return i>-1 ? {name:h.slice(0,i), arg:h.slice(i+1)} : {name:h, arg:""};
}
var titles = {home:"ETERNA · Timeless Design"};
function render(scrollTop){
  var r = route(), html = null, over = false, fabText = null;
  switch(r.name){
    case "home": html = pHome(); over = true; break;
    case "collection": html = pCollection({}); break;
    case "room": html = pCollection({room:r.arg}); break;
    case "cat": html = pCollection({cat:r.arg}); break;
    case "c": var ca = r.arg.split("."); html = ca[0]==="new" ? pCollection({isNew:"1"}) : D.brands[ca[0]] ? pCollection({brand:ca[0], cat:ca[1]||""}) : null; break;
    case "brand": html = pBrand(r.arg); over = !!html; break;
    case "p": html = pProduct(r.arg); var p=byId(r.arg); if(p) fabText = t("waProduct")(p.name+" ("+D.brands[p.brand].name+")"); break;
    case "designers": html = pDesigners(); break;
    case "d": html = pDesigner(r.arg); break;
    case "journal": html = pJournal(); break;
    case "j": html = pArticle(r.arg); break;
    case "showroom": html = pShowroom(); over = true; break;
    case "trade": html = pTrade(); break;
    case "about": html = pAbout(); over = true; break;
    case "contact": html = pContact(); break;
    case "inquire": return;
  }
  if (html === null) html = p404();
  document.documentElement.lang = lang === "sq" ? "sq" : "en";
  app.innerHTML = header(over) + '<main class="'+(over?'':'pad')+' fade">' + html + '</main>' + footer() + fab(fabText);
  if (r.name==="collection"||r.name==="room"||r.name==="cat"||r.name==="c") renderFilters();
  var p2 = byId(r.arg); document.title = r.name==="p"&&p2 ? p2.name+" · ETERNA" : "ETERNA · Timeless Design";
  bindHeader(over);
  if (scrollTop!==false) window.scrollTo(0,0);
  if (r.name==="p") bindGallery(byId(r.arg));
  var hv = document.getElementById("herov"); if (hv) { var pr = hv.play && hv.play(); if (pr && pr.catch) pr.catch(function(){}); }
}
function bindHeader(over){
  var h = document.getElementById("hdr");
  function upd(){ if (!over) return; h.classList.toggle("over", window.scrollY < 80); }
  window.onscroll = upd; upd();
  document.getElementById("burger").onclick = openMenu;
  var tr = document.getElementById("ddt"), panel = document.getElementById("ddp"), tm;
  function open(){ clearTimeout(tm); h.classList.add("ddopen"); tr.setAttribute("aria-expanded","true"); }
  function shut(){ h.classList.remove("ddopen"); tr.setAttribute("aria-expanded","false"); }
  tr.onclick = function(){ h.classList.contains("ddopen") ? shut() : open(); };
  if (window.matchMedia("(hover:hover)").matches) {
    tr.onmouseenter = open; panel.onmouseenter = open;
    h.onmouseleave = function(){ tm = setTimeout(shut, 180); };
  }
  panel.onclick = function(e){ if (e.target.closest("a")) shut(); };
  document.onkeydown = function(e){ if (e.key==="Escape") shut(); };
}
function openMenu(){
  var m = document.createElement("div"); m.className = "menu"; m.setAttribute("role","dialog");
  function sub(k){ return '<div class="msub"><a href="#c.'+k+'"><b>'+D.brands[k].name+'</b></a>'+brandCats(k).map(function(c){return '<a href="#c.'+k+'.'+c+'">'+L(D.cats[c])+'</a>';}).join("")+'</div>'; }
  var links = [["designers",t("designers")],["journal",t("journal")],["showroom",t("showroom")],["trade",t("trade")],["about",t("philosophy")],["contact",t("contact")]];
  m.innerHTML = '<div class="top"><span class="mark">ETERNA</span><button class="label" data-close="1">'+t("close")+'</button></div>'+
    '<details class="macc" open><summary class="big">'+t("collection")+'</summary><div class="msubs"><div class="msub"><a href="#collection"><b>'+t("allPieces")+'</b></a><a href="#c.new">'+t("newArr")+'</a></div>'+sub("fritz-hansen")+sub("exteta")+'</div></details>'+
    links.map(function(l){return '<a class="big" href="#'+l[0]+'">'+l[1]+'</a>';}).join("")+
    '<div class="foot"><span>WhatsApp '+PHONE+'</span><span>'+SALES+'</span><span class="lang"><button data-lang="sq" class="'+(lang==="sq"?"on":"")+'">AL</button> / <button data-lang="en" class="'+(lang==="en"?"on":"")+'">EN</button></span></div>';
  document.body.appendChild(m);
  m.addEventListener("click", function(e){ if (e.target.closest("a")||e.target.closest("[data-close]")||e.target.closest("[data-lang]")) m.remove(); });
}
function bindGallery(p){
  if (!p) return;
  var cur = 0, main = document.getElementById("gimg");
  function show(i){ cur = (i+p.imgs.length)%p.imgs.length; main.src = img(p.imgs[cur]); document.querySelectorAll(".thumbs button").forEach(function(b,j){ b.classList.toggle("on", j===cur); }); }
  document.querySelectorAll(".thumbs button").forEach(function(b){ b.onclick = function(){ show(+b.getAttribute("data-i")); }; });
  var gm = document.getElementById("gmain");
  function lb(){
    var o = document.createElement("div"); o.className="lb"; o.setAttribute("role","dialog");
    o.innerHTML = '<img src="'+img(p.imgs[cur])+'" alt="'+esc(p.name)+'"><button class="x">'+t("close")+'</button>'+(p.imgs.length>1?'<button class="pv">'+t("prev")+'</button><button class="nx">'+t("next")+'</button>':'');
    var im = o.querySelector("img");
    function go(d){ show(cur+d); im.src = img(p.imgs[cur]); }
    o.addEventListener("click", function(e){ if (e.target.classList.contains("pv")) go(-1); else if (e.target.classList.contains("nx")) go(1); else if (e.target!==im) close(); });
    function key(e){ if(e.key==="Escape") close(); if(e.key==="ArrowRight") go(1); if(e.key==="ArrowLeft") go(-1); }
    function close(){ o.remove(); document.removeEventListener("keydown", key); }
    document.addEventListener("keydown", key);
    document.body.appendChild(o);
  }
  gm.onclick = lb; gm.onkeydown = function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); lb(); } };
}

document.addEventListener("click", function(e){
  var l = e.target.closest("[data-lang]");
  if (l) { lang = l.getAttribute("data-lang"); try{ localStorage.setItem("eterna-lang", lang); }catch(x){} render(false); return; }
  var c = e.target.closest(".chip");
  if (c) { F[c.getAttribute("data-f")] = c.getAttribute("data-v"); renderFilters(); return; }
  if (e.target.closest("[data-clear]")) { F={brand:"",cat:"",room:"",isNew:""}; renderFilters(); return; }
  var s = e.target.closest("[data-scroll]");
  if (s) { e.preventDefault(); var el = document.getElementById(s.getAttribute("data-scroll")); if (el) el.scrollIntoView({behavior:"smooth"}); }
});
document.addEventListener("submit", onSubmit);
window.addEventListener("hashchange", function(){ render(); });
render();
})();
