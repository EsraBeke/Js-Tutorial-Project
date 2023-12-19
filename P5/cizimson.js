let aci = 0;
let hareketAgaci = 0.01; // her geçişte ekran genişliğinin %1'i kadar kaydır
let yogunluk = 0; // ağaç geçiş sayacı
let ekDal = 0; // rastgele ek dal oluştur
let azDal = 0; // henüz uygulanmadı
let govdeKalinligi = 0.11; // her dalın azalan boyutu
let minDal = 10; // küçük dallar yoğun tepeler oluşturur
let maksAgac = 3; // ağaç başına kaç geçiş yapılacak
let pg;
let finished = false;  //ağaç çizimi bitti mi

let snowflakes = []; // kar taneleri
let snowfallDirection = 1; // kar yağışı yönü (1: aşağı, -1: yukarı)
let snowfallSpeed = 1; // kar yağma hızı

let snowfallSpeedSlider; //hız ayarlama 

let skyColorSlider; // Gökyüzü geçişi ayarlama

let snowPile = [];  // kar birkimi için

let snowmanButton;            //kardan adam koyma butonu
let snowmanCreated = false;

let snowing = true; // Kar yağıyor mu? 

let raining = false; // Yağmur yağıyor mu?

let sound;            //ses sistemleri
let muzik;
let isPlaying = false;  

let stars = [];  

let captureButton;

function preload() {
  sound = loadSound('https://assets.mixkit.co/active_storage/sfx/2415/2415-preview.mp3'); 
  //sogukhavasesi=loadSound('')
  muzik=loadSound('https://cdn.pixabay.com/audio/2022/03/20/audio_ca77c717bc.mp3');
}

function setup() {
  createCanvas(700, 700);
  pg = createGraphics(width, height);

  frameRate(10); // Frame hızını artır

  startSnowfall(); // Kar yağışını başlat
  
  //Burada textler canvanın dışına çıkamadığı için düğme gibi işlevsiz bir buton yazdım
  
  Yazı = createButton('Kar Yağış Hızı:');
  Yazı.position(430, 710);
  Yazı.style('background-color', '#ffffff');
  Yazı.style('border', 'none');
  Yazı.style('padding', '10px');
  Yazı.style('text-align', 'center');
  Yazı.style('text-decoration', 'none');
  Yazı.style('display', 'inline-block');
  Yazı.style('font-size', '16px');
  Yazı.style('cursor', 'pointer');
  
  
  snowfallSpeedSlider = createSlider(1, 10, snowfallSpeed, 1); // Slider oluştur
  snowfallSpeedSlider.position(560, 720);
  
  
   // İşlevsiz bir düğme oluştur
  skyYazısı = createButton('Gökyüzü :');
  skyYazısı.position(200, 710);
  skyYazısı.style('background-color', '#ffffff');
  skyYazısı.style('border', 'none');
  skyYazısı.style('padding', '10px');
  skyYazısı.style('text-align', 'center');
  skyYazısı.style('text-decoration', 'none');
  skyYazısı.style('display', 'inline-block');
  skyYazısı.style('font-size', '16px');
  skyYazısı.style('cursor', 'pointer');
  skyColorSlider = createSlider(0, 255, 0, 1); // Slider oluştur
  skyColorSlider.position(290, 720);
  
  snowmanButton = createButton("Kardan Adam Oluştur");
  snowmanButton.position(0,740);
  snowmanButton.mousePressed(createSnowman);
  
  let button = createButton("Kar Efekti Durdur/ Başlat");
  button.position(0, 720);
  button.mousePressed(toggleSnowing); // Butona basıldığında toggleSnowing fonksiyonunu çağır
  
  rainButton = createButton("Yağmur Efekti");
  rainButton.position(0, 700);
  rainButton.mousePressed(toggleRain); // Butona basıldığında toggleRain fonksiyonunu çağır
  
  
  //Bu gökyüzüne tıkladığımızda tıkladığımız yere yıldız eklesin diye yapıldı
  //Slider sonda iken çizilebilsin. Yani sadece hava tam karardığında yıldız çizilebilsin istedim.
  mousePressed = function() {
    if (skyColorSlider.value() === 255) {
      stars.push(new Star(mouseX, mouseY));
    } 
  }
  
  // Ekran görüntüsü almak için düğme oluşturuluyor
  captureButton = createButton('Ekran Görüntüsü Al');
  captureButton.position(0, 760);
  captureButton.mousePressed(captureScreenshot);
  
  playMuzik();
  
  
}

function draw() {
  background(240);

  
 // Gökyüzü
  let skyColor = map(skyColorSlider.value(), 0, 255, 180, 0);
  fill(skyColor, skyColor, skyColor);
  rect(0, 0, width, height);
  
  //Burada diyorum ki eğer slideri 0 yaparsak çizdiğimiz yıldızlar silinsin
  if (skyColorSlider.value() === 0) {
    stars = []; // Yıldızları temizle
  }
   for (let star of stars) {
    star.update();
    star.display();
  }

  // Ay dağların arkasından çıksın ve rengi önce koyu iken slider tam dolu olduğunda açık renk olsun ve giderek büyüsün
  let moonColor = map(skyColorSlider.value(), 0, 255, 100, 255);
  let shading = map(skyColorSlider.value(), 0, 255, 100, 0);
  let moonBrightness = map(skyColorSlider.value(), 0, 255, 200, 255);
  let moonSize = map(skyColorSlider.value(), 0, 255, 100, 90);
  fill(moonColor - shading, moonBrightness);
  noStroke();
  let moonX = map(skyColorSlider.value(), 0, 255, -200, width - 100);
  let moonY = map(skyColorSlider.value(), 0, 255, 200, 50);
  ellipse(moonX, moonY, moonSize, moonSize);

  // burada ay Slider tam dolduğunda büyüklüğü artsın diyorum.
  if (skyColorSlider.value() === 255) {
    fill(255, moonBrightness);
    ellipse(moonX, moonY, moonSize + 10, moonSize + 10);
  }
  
  //DAğ
  fill(91, 71, 110);
  strokeWeight(0);
  triangle(360, 130, 760, 500, -40, 500);
   
  fill(213, 212, 255);
  strokeWeight(0);
  beginShape();
  vertex(360, 130);
  vertex(485, 246);
  vertex(390, 200);
  vertex(360, 250);
  vertex(320, 217);
  vertex(225, 255);
  endShape(CLOSE);
  
  
  fill(174, 139, 222);
  strokeWeight(0);
  triangle(100, 180, 500, 500, -260, 500);

  fill(231, 241, 255);
  strokeWeight(0);
  beginShape();
  vertex(100, 180);
  vertex(225, 280);
  vertex(145, 250);
  vertex(120, 290);
  vertex(70, 260);
  vertex(-20, 286);
  endShape(CLOSE);

  //Arka plandaki ova gibi çimenler
  fill(60, 130, 57);
  ellipse(200, 580, 1000, 400);

  fill(69, 140, 66);
  ellipse(500, 650, 1300, 400);
  
   // Bu kod aslında en başta sürekli çizilip duruyordu yani canvanın en sağına geldiğinde 
   //yeniden çizilmeye  başlıyordu
  // Ağaç çizimi en sağa geldiğinde dursun diye bi kod yazdım
  if (!finished) {
    pg.push();
    yogunluk += 1;
    ekDal = int(random(0, 2));
    azDal = int(random(0, 3));

    if (yogunluk > maksAgac) {
      yogunluk = 0;
      hareketAgaci += 0.1;
      if (hareketAgaci >= 0.99) {
        hareketAgaci = 1;
        finished = true;
      }
    }

    aci = random(PI * 0.1);
    let baslangicUzunlugu = random(50, 120);
    pg.stroke(random(50, 60), random(25, 30), 0, 255);
    pg.strokeWeight(baslangicUzunlugu * govdeKalinligi);
    pg.translate(width * (hareketAgaci + random(-0.005, 0.005)), height * 0.95);
    dal(baslangicUzunlugu);
    pg.pop();
  }
  //Burası çizmek için
  image(pg, 0, 50);
  
  
  
  // Kar tanelerini güncelle ve çiz
  updateSnowflakes();
  drawSnowflakes();
  
  // Kar yağma hızını güncelle
  snowfallSpeed = snowfallSpeedSlider.value();
  
  accumulateSnow();
  drawSnowPile();


  
    if (snowmanCreated) {
    // Kardan adamı çiz
    drawSnowman();
  }
 if (raining) {
    // Display thin blue raindrops
    for (let i = 0; i < 100; i++) {
      let x = random(width);
      let y = random(height);
      stroke(0, 0, 255);
      strokeWeight(1);
      line(x, y, x, y + 5);
    }
  }

}
//Bu fonksiyon dalları yaprakları teker teker belirli verilmiş random aralığa göre çizilmesini sağlayan bi kod
function dal(uzunluk) {
  pg.line(0, 0, 0, -uzunluk);
  pg.translate(0, -uzunluk);

  if (uzunluk > minDal) {
    pg.push();
    pg.stroke(random(50, 60), random(25, 30), 0, 255);
    pg.strokeWeight(uzunluk * govdeKalinligi);
    pg.rotate(random(-QUARTER_PI * random(1), QUARTER_PI * random(1)));
    dal(uzunluk * random(0.4, 0.8));
    pg.pop();

    if (ekDal === 0) {
      pg.push();
      pg.stroke(random(50, 100), random(25, 30), 0, 255);
      pg.strokeWeight(uzunluk * govdeKalinligi);
      pg.rotate(random(-QUARTER_PI * random(1), QUARTER_PI * random(1)));
      dal(uzunluk * random(0.2, 0.97));
      pg.pop();
      pg.push();
      pg.stroke(random(100, 75), random(25, 50), 0, 255);
      pg.strokeWeight(uzunluk * govdeKalinligi);
      pg.rotate(random(-QUARTER_PI * random(1), QUARTER_PI * random(1)));
      dal(uzunluk * random(0.2, 0.97));
      pg.pop();
    }
  } else if (uzunluk <= minDal) {
    pg.push();
    pg.noStroke();
    pg.fill(random(50, 120), 175, random(20, 80), 200);
    pg.ellipse(0, 0, random(3, 11), random(3, 11));
    pg.pop();
    uzunluk = random(50, 200);
    pg.translate(width * hareketAgaci, height * 0.95);
    pg.rotate(0);
  }
}
//Kar yağdıran fonksiyon yani kar yağmaya başlasın diyorum
function startSnowfall() {
  for (let i = 0; i < 200; i++) { 
    snowflakes.push(new Snowflake());
  }
}
//Burda da kar taneleri en alta geldiğinde üstte güncellenip yine gelsin diyorum
function updateSnowflakes() {
  for (let snowflake of snowflakes) {
    snowflake.update();
  }
}
function drawSnowflakes() {
  for (let snowflake of snowflakes) {
    snowflake.display();
  }
}

//Kar tanesi sınıfı
class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = random(-100, -10);
    this.size = random(2, 8);
    this.speed = random((0.5), 4);
  }

  update() {
    this.y += this.speed * snowfallDirection * snowfallSpeed;

    if (this.y > height) {
      this.y = random(-100, -10);
    }
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}
//Kar birikme sınıfı
class SnowPile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10);
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}

function accumulateSnow() {
  for (let snowflake of snowflakes) {
    if (snowflake.y > height - 20) {
      snowPile.push(new SnowPile(snowflake.x, height - 1));
    }
  }
}
//Burda en altta kar tanelerini biriktir çiz diyorum
function drawSnowPile() {
  for (let snow of snowPile) {
    snow.display();
  }
}
// Eğer kardan adam varsa kaldır yoksa çiz
function createSnowman() {
  snowmanCreated = ! snowmanCreated;
  
  
}

function drawSnowman() {
  let snowmanX = width/2 ;
  let snowmanY = height - 70;
  let snowmanSize = 50;

  // Kardan adamı çiz
  fill(255);
  stroke(0);
  ellipse(snowmanX, snowmanY, snowmanSize, snowmanSize); // Baş
  ellipse(snowmanX, snowmanY + snowmanSize, snowmanSize * 1.2, snowmanSize * 1.2); // Gövde
  ellipse(snowmanX, snowmanY + snowmanSize * 2.6, snowmanSize * 1.4, snowmanSize * 1.4); // Ayaklar

  fill(0);
  ellipse(snowmanX - 10, snowmanY - 5, 5, 5); // Sol göz
  ellipse(snowmanX + 10, snowmanY - 5, 5, 5); // Sağ göz
  ellipse(snowmanX, snowmanY + 5, 10, 5); // Ağız

  // Çubuktan kol
  strokeWeight(2);
  line(snowmanX - snowmanSize * 0.6, snowmanY + snowmanSize * 0.7, snowmanX - snowmanSize * 0.9, snowmanY + snowmanSize * 0.4); // Sol kol
  line(snowmanX + snowmanSize * 0.6, snowmanY + snowmanSize * 0.7, snowmanX + snowmanSize * 0.9, snowmanY + snowmanSize * 0.4); // Sağ kol
 
}


function toggleSnowing() {
  snowing = !snowing; // Kar yağışı durumu tersine çevir

  if (snowing) {
    startSnowfall(); // Kar yağışını yeniden başlat
    
  } else {
    snowflakes = []; // Kar tanelerini temizle
    snowPile = []; // Kar birikintisini temizle
  } 

}
function createRaindrop() {
  let x = random(width); // Rastgele x koordinatı
  let y = random(-100, -10); // Üst taraftan başlaması için y koordinatı
  let size = random(1, 5); // Boyut
  let speed = random(2, 6); // Hız

  let raindrop = { x, y, size, speed }; // Yağmur damlası nesnesi
  raindrops.push(raindrop); // Yağmur damlası dizisine ekle
}

function updateRaindrops() {
  for (let i = raindrops.length - 1; i >= 0; i--) {
    let raindrop = raindrops[i];
    raindrop.y += raindrop.speed; // Y koordinatını güncelle

    if (raindrop.y > height) {
      // Ekranın altına düşen yağmur damlasını sil
      raindrops.splice(i, 1);
    }
  }
}
function toggleRain() {

  raining = !raining; // Yağmur değişkeninin değerini tersine çevir
  
 if (raining) {
   snowflakes = []; // Kar tanelerini temizle
  snowPile = []; // Kar birikintisini temizle
 }
  
   if (isPlaying) {
    sound.stop(); // Ses çalıyorsa durdur
    isPlaying = false;
    rainButton.html('Yağmur Başlat'); // Buton metnini güncelle
  } else {
    sound.play(); // Ses çalmıyorsa başlat
    isPlaying = true;
    rainButton.html('Yağmur Durdur'); // Buton metnini güncelle
  }
  
}
function playSound() {
  sound.play();
  // Ses dosyasını oynat
}
function playMuzik()
{
  
  muzik.play();
  muzik.loop();
}
class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(1, 3);
    this.brightness = color(random(200, 255), random(200, 255), 0);
    this.rotationSpeed = random(-0.02, 0.02); // Rastgele bir dönüş hızı
    this.rotationAngle = 0; // Başlangıçta dönüş açısı sıfır
  }

  update() {
    this.rotationAngle += this.rotationSpeed; // Dönüş açısını güncelle
  }

  display() {
    let radius = this.size * 0.5; 
    
    push(); // Geçici dönüşüm matrisini kaydet
    
    translate(this.x, this.y); // Yıldızın konumuna taşı
    rotate(this.rotationAngle); // Yıldızı döndür
    
    // Yıldızı çiz
    fill(this.brightness);
    noStroke();
    drawStars(radius);
    
    pop(); // Geçici dönüşüm matrisini geri yükle
  }
}

// Çiçek şeklindeki yıldızı çizmek için yardımcı fonksiyon
function drawStars(radius) {
  let angle = TWO_PI / 6; // Altıgen için açı aralığı
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = cos(a) * radius;
    let sy = sin(a) * radius;
    vertex(sx, sy);
    let hx = cos(a + angle * 0.5) * radius * 0.5; // Ortadaki petalın x konumu
    let hy = sin(a + angle * 0.5) * radius * 0.5; // Ortadaki petalın y konumu
    vertex(hx, hy);
  }
  endShape(CLOSE);
}

function captureScreenshot() {
  // Ekran görüntüsünü al
  let screenshot = get();
  // Fotoğraf olarak kaydetmek için bir img elementi oluştur
  let img = document.createElement('img');
  img.src = screenshot.canvas.toDataURL();
  
  // Fotoğrafı indirmek için bir a etiketi oluştur
  let link = document.createElement('a');
  link.href = img.src;
  link.download = 'screenshot.png';
  
  // Dökümana img ve link elementlerini ekle
  document.body.appendChild(img);
  document.body.appendChild(link);
  
  // Fotoğrafı otomatik olarak indir
  link.click();
  
  // Eklenen elementleri kaldır
  document.body.removeChild(img);
  document.body.removeChild(link);
}