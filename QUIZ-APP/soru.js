function Soru(soruMetni,cevapSecenekleri,dogruCevap){
    this.soruMetni=soruMetni;
    this.cevapSecenekleri=cevapSecenekleri;
    this.dogruCevap=dogruCevap;
    //  this.cevapControl=function(cevap){
    //      return cevap===this.dogruCevap;
    //  }
}

// her bir nesneye özel olarak tanımlamayıp classa tanımlayıp her nesnenin aynı fonksiyonu kullanmasını sağlar
 Soru.prototype.cevapControl=function(cevap){
    return cevap===this.dogruCevap;
 }
let sorular=[
    new Soru("1-Cumhuriyet Ne Zaman İlan Edilmiştir?",{ a:"1920", b: "2002",c:"1923",d:"128 Milyar Dolar Nerde"},"c"),
    new Soru("2-AFAD Afetlere Müdahale başkan yardımcısı hangi bölümden mezundur?",{ a:"İnşaat Müh.", b: "İlahiyat",c:"Orman Mühendisliği",d:"Tıp"},"b"),
    new Soru("3-Beşi beş kuruştan beş yumurta alırsam bir yumurta kaç kuruştur?",{ a:"5", b: "25",c:"Ekinler baş vermeden kör buzağı topallamazmış"},"a"),
    new Soru("4-İstanbul ne zaman fethedilmiştir",{ a:"1150", b: "1384",c:"1453"},"c"),
    new Soru(`5-"Yalancı Ayrılık" Şarkısı Kime Aittir?`,{ a:"Barış Manço", b: "Albert Einstein",c:"Ahmet Kaya",d:"Musa Eroğlu"},"c"),
    
];