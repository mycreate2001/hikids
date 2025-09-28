import { Component, OnDestroy } from '@angular/core';

interface Question {
  id: number;
  a: number;
  b: number;
  op: '×' | '÷';
  answer: number;
  user?: number;
}

@Component({
  selector: 'app-multiple',
  templateUrl: './multiple.page.html',
  styleUrls: ['./multiple.page.scss'],
})
export class MultiplePage implements OnDestroy {
  tables = [2,3,4,5,6,7,8,9];
  selectedTables = new Set<number>();

  numQuestions = 10;
  quizTime = 5;
  mode: 'random' | 'order' = 'random';
  opMode: 'both' | 'mul' | 'div' = 'both';

  modeTypes = [
    { value: 'random', label: 'Ngẫu nhiên' },
    { value: 'order', label: 'Theo thứ tự' }
  ];

  loaiPhepTinh = [
    { value: 'both', label: 'Cả nhân & chia' },
    { value: 'mul', label: 'Chỉ nhân' },
    { value: 'div', label: 'Chỉ chia' }
  ];

  quizStarted = false;
  submitted = false;
  currentQuestions: Question[] = [];

  timer: any;
  timeLeft = 0;
  timerDisplay = '';

  score = 0;
  scorePercent = 0;

  toggleTable(t: number) {
    if (this.selectedTables.has(t)) this.selectedTables.delete(t);
    else this.selectedTables.add(t);
  }

  generateQuiz() {
    if (this.selectedTables.size === 0) {
      alert('Vui lòng chọn ít nhất 1 bảng cửu chương');
      return;
    }
    this.currentQuestions = this.makeQuestions([...this.selectedTables], this.numQuestions, this.mode, this.opMode);
    this.quizStarted = true;
    this.submitted = false;
    this.score = 0;
    this.startTimer(this.quizTime);
  }

  makeQuestions(tables: number[], num: number, mode: string, opMode: string): Question[] {
    const pool: Question[] = [];
    for (let a = 1; a <= 10; a++) {
      for (let b = 1; b <= 10; b++) {
        if (tables.includes(a) || tables.includes(b)) {
          if (opMode === 'both' || opMode === 'mul') {
            pool.push({ a, b, op: '×', answer: a * b, id: 0 });
          }
          if (opMode === 'both' || opMode === 'div') {
            pool.push({ a: a * b, b: a, op: '÷', answer: b, id: 0 });
          }
        }
      }
    }
    if (mode === 'random') this.shuffle(pool);
    const out: Question[] = [];
    if (mode === 'random') {
      for (let i = 0; i < num && i < pool.length; i++) out.push(pool[i]);
    } else {
      let idx = 0;
      while (out.length < num) {
        out.push(pool[idx % pool.length]);
        idx++;
      }
    }
    return out.map((q, i) => ({ ...q, id: i + 1 }));
  }

  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  startTimer(minutes: number) {
    clearInterval(this.timer);
    this.timeLeft = minutes * 60;
    this.updateTimerDisplay();
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.submitQuiz();
        alert('Hết thời gian, bài đã được nộp tự động!');
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const m = Math.floor(this.timeLeft / 60);
    const s = this.timeLeft % 60;
    this.timerDisplay = `${m}:${s.toString().padStart(2, '0')}`;
  }

  submitQuiz() {
    clearInterval(this.timer);
    this.submitted = true;
    this.score = this.currentQuestions.filter(q => q.user === q.answer).length;
    this.scorePercent = Math.round(100 * this.score / this.currentQuestions.length);
  }

  resetQuiz() {
    this.quizStarted = false;
    this.currentQuestions = [];
    clearInterval(this.timer);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
