function UI() {
    this.btn_start=document.querySelector(".btn_start"),
    this.next_button=document.querySelector(".next-button"),
    this.option_list=document.querySelector(".option_list");
    this.score_box=document.querySelector(".score-box");
    this.btn_replay=document.querySelector(".btn-replay");
    this.btn_quit=document.querySelector(".btn-quit");
    this.score_text=document.querySelector(".score_text");
    this.quiz_box=document.querySelector(".quiz_box");
    this.correctIcon=`<div class="icon"><i class="fas fa-check"></i></div>`,
    this.incorrectIcon=`<div class="icon"><i class="fas fa-times"></i></div>`,
    this.time_second=document.querySelector(".time-second");
    this.time_text=document.querySelector(".time-text");
    this.time_line=document.querySelector(".time-line");

}