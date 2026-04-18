import { Component, OnDestroy } from '@angular/core';

interface Question {
  id: number;
  a: number;
  b: number;
  op: '×' | '÷';
  answer: number;
  user?: number;
  startTime?: number;
  endTime?: number;
  timeSpent?: number;
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

  quizStartTime = 0;
  elapsedTime = 0;
  elapsedTimeDisplay = '';

  avgTimePerQuestion: string = '0';

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
    this.quizStartTime = Date.now();
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

  onFocus(q: Question) {
    q.startTime = Date.now();
  }

  onBlur(q: Question) {
    if (q.startTime) {
      q.endTime = Date.now();
      const spent = Math.floor((q.endTime - q.startTime) / 1000);
      q.timeSpent = (q.timeSpent ?? 0) + spent;
      q.startTime = undefined;
    }
  }

  submitQuiz() {
    clearInterval(this.timer);
    this.submitted = true;
    this.score = this.currentQuestions.filter(q => q.user === q.answer).length;
    this.scorePercent = Math.round(100 * this.score / this.currentQuestions.length);

    this.elapsedTime = Math.floor((Date.now() - this.quizStartTime) / 1000);
    const m = Math.floor(this.elapsedTime / 60);
    const s = this.elapsedTime % 60;
    this.elapsedTimeDisplay = `${m} phút ${s} giây`;

    const total = this.currentQuestions.reduce((sum, q) => sum + (q.timeSpent ?? 0), 0);
    this.avgTimePerQuestion = total > 0 ? (total / this.currentQuestions.length).toFixed(1) : '0';
  }

  resetQuiz() {
    this.quizStarted = false;
    this.currentQuestions = [];
    clearInterval(this.timer);
  }

  getResultMessage(): string {
    if (this.scorePercent >= 90) return "Xuất sắc! Con làm rất giỏi 👏👏";
    if (this.scorePercent >= 70) return "Tốt lắm! Cố gắng thêm chút nữa nhé 💪";
    if (this.scorePercent >= 50) return "Con đã làm khá, hãy luyện thêm nhé 👍";
    return "Không sao đâu, mình cùng luyện thêm để giỏi hơn nha 🌱";
  }

  getSelectedTables(): string {
    return Array.from(this.selectedTables).join(', ');
  }

  displayAnswer(userAnswer: number | undefined): string {
    return userAnswer !== undefined && userAnswer !== null ? userAnswer.toString() : '—';
  }

  shareResult() {
    let message = `📘 Kết quả bài tập Toán của con\n\n`;
    message += `⚙️ Cài đặt trước khi làm:\n`;
    message += `- Bảng cửu chương: ${this.getSelectedTables()}\n`;
    message += `- Số câu hỏi: ${this.numQuestions}\n`;
    message += `- Chế độ: ${this.mode === 'random' ? 'Ngẫu nhiên' : 'Theo thứ tự'}\n`;
    message += `- Loại phép tính: ${this.opMode === 'both' ? 'Cả nhân & chia' : this.opMode === 'mul' ? 'Chỉ nhân' : 'Chỉ chia'}\n`;
    message += `- Thời gian quy định: ${this.quizTime} phút\n\n`;

    message += `🎯 Kết quả:\n`;
    message += `- Điểm: ${this.score}/${this.currentQuestions.length}\n`;
    message += `- Tỷ lệ đúng: ${this.scorePercent}%\n`;
    message += `- Thời gian đã làm: ${this.elapsedTimeDisplay}\n`;
    message += `- Thời gian TB / câu: ${this.avgTimePerQuestion} giây\n`;
    message += `- Nhận xét: ${this.getResultMessage()}\n\n`;

    message += `📑 Bài thi chi tiết:\n`;
    this.currentQuestions.forEach((q, idx) => {
      const userAns = this.displayAnswer(q.user);
      const spent = q.timeSpent ?? 0;
      if (q.user === q.answer) {
        message += `${idx + 1}. ${q.a} ${q.op} ${q.b} = ${userAns} ✅ (${spent}s)\n`;
      } else {
        message += `${idx + 1}. ${q.a} ${q.op} ${q.b} = ${userAns} ❌ (Đúng: ${q.answer}, ${spent}s)\n`;
      }
    });

    if (navigator.share) {
      navigator.share({
        title: 'Kết quả Toán của con',
        text: message,
      }).catch(err => console.log('Share cancelled', err));
    } else {
      navigator.clipboard.writeText(message);
      alert("Đã copy toàn bộ kết quả vào clipboard! Con có thể gửi cho bố mẹ.");
    }
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
