const quiz=new Quiz(sorular);
const ui =new UI();


ui.btn_start.addEventListener("click", function(){   
    ui.quiz_box.classList.add("active");
    startTimer(10);
    startTimerLine();
    soruSayisiniGoster(quiz.soruIndex +1,quiz.sorular.length);
    soruGoster(quiz.soruGetir());
})
ui.next_button.addEventListener("click",function(){
    if(quiz.soruIndex+1<quiz.sorular.length ){
        quiz.soruIndex+=1;
    soruGoster(quiz.soruGetir());
    clearInterval(counter);
    clearInterval(counterLine);
    startTimer(10);
    startTimerLine();
    soruSayisiniGoster(quiz.soruIndex +1,quiz.sorular.length);
   }
   else{
    clearInterval(counter);
    console.log("quiz bitti");
    ui.quiz_box.classList.remove("active")
    ui.score_box.classList.add("active");
    let tag=`Toplam ${quiz.sorular.length} Sorudan ${quiz.trueAnswers} soru doğru, ${quiz.falseAnswers} soru yanlış yaptınız`;
    ui.score_text.innerHTML=tag;
    ui.quiz_box.classList.remove("active");
    ui.score_box.classList.add("active");

   }
})

function soruGoster(soru) {
    let question= `<span>${soru.soruMetni}</span>`;
    let options='';
    for(let cevap in soru.cevapSecenekleri){
        options+=
        `
            <div class="option"> 
                <span><b>${cevap}</b>: ${soru.cevapSecenekleri[cevap]} </span>
            </div>
        `
    }
    ui.next_button.classList.remove("show");
    document.querySelector(".question_text").innerHTML=question;
    ui.option_list.innerHTML=options;

    const option=ui.option_list.querySelectorAll(".option");

    for(let opt of option){
        opt.setAttribute("onclick","optionSelected(this)");
    }
}
ui.btn_quit.addEventListener("click",function(){
    window.location.reload();
})
ui.btn_replay.addEventListener("click",function(){
    ui.score_box.classList.remove("active");
    quiz.soruIndex=0;
    quiz.trueAnswers=0;
    quiz.falseAnswers=0;
    dogruYanlisGosterge();
    ui.btn_start.click();
})



function optionSelected(option) {
clearInterval(counter);
clearInterval(counterLine);
 let cevap=option.querySelector("span b").textContent;
 let soru=quiz.soruGetir();
 if(quiz.soruIndex+1<quiz.sorular.length)
 document.querySelector(".next-button").classList.add("show");
 if (soru.cevapControl(cevap)) {
    option.classList.add("correct");
    // Konum belirterek eklememize yarıyor
    option.insertAdjacentHTML("beforeend",ui.correctIcon);
    quiz.trueAnswers+=1;   
 }
 else{
    option.classList.add("incorrect")
    option.insertAdjacentHTML("beforeend",ui.incorrectIcon);
    quiz.falseAnswers+=1;
 }
    for(let i=0; i<ui.option_list.children.length; i++){
        ui.option_list.children[i].classList.add("disabled");
    }
    dogruYanlisGosterge();
    //quizin bittiği kısım
    if(quiz.soruIndex+1>=quiz.sorular.length){
     let tag=`Toplam ${quiz.sorular.length} Sorudan ${quiz.trueAnswers} soru doğru, ${quiz.falseAnswers} soru yanlış yaptınız`;
     ui.score_text.innerHTML=tag;
     ui.quiz_box.classList.remove("active");
     ui.score_box.classList.add("active");}
  
}
function dogruYanlisGosterge(){
    document.querySelector(".counterCorrect").innerHTML=`${quiz.trueAnswers} Doğru`;
    document.querySelector(".counterFalse").innerHTML=`${quiz.falseAnswers} Yanlış`; 
}

function soruSayisiniGoster(soruSirasi,toplamSoru) {
    let tag =`<span class="badge bg-warning">${soruSirasi} / ${toplamSoru}</span>`
    document.querySelector(".quiz_box .question-index").innerHTML=tag;
}
let counter;
function startTimer(time) {
    counter=setInterval(timer,1000);

    function timer() {
        ui.time_text.textContent="Kalan Süre"
       ui.time_second.textContent=time;
       time+=-1;
       if (time < 0) {
            clearInterval(counter);
            ui.time_text.textContent="Süre Bitti."
            let cevap= quiz.soruGetir().dogruCevap;
            for(let option of ui.option_list.children){
                if(option.querySelector("span b").textContent == cevap){
                    option.classList.add("correct");
                    option.insertAdjacentHTML("beforeend",ui.correctIcon);
                }
                    option.classList.add("disabled");
            }
           ui.next_button.classList.add("show"); 
        }
    }
    
}
let counterLine;
function startTimerLine() {
    let line_width=0;
    counterLine=setInterval(timer, 5);

    function timer(){
        line_width+=0.25;
        ui.time_line.style.width= line_width+ "px";
        if ((line_width+5) >550) {
            clearInterval(counterLine);
        }
    }
}

