class Timer {
  constructor(target = 60, options = {}) {
    this.target = target * 1000;
    this.isTicking = false;
    this.onUpdate = options.onUpdate;
  }

  init() {
    this.reference = Date.now();
    this.elapsed = 0;
    this.timeOnPaused = 0;
    this.left = this.target;
    this.progress = 0;
    this.update();
  }

  refresh() {
    if (this.left < 0) {
      this.left = 0;
      this.update();
      clearTimeout(this.timeout);
    } else {
      this.elapsed = (Date.now() - this.reference) + this.timeOnPaused;
      this.left = this.target - this.elapsed;
      this.progress = this.elapsed / this.target;
      this.update();
      this.timeout = setTimeout(this.refresh.bind(this), 10);
    }
  }

  pause() {
    this.isTicking = false;
    clearTimeout(this.timeout);
    this.timeOnPaused = this.elapsed;
  }

  play() {
    if (!this.isTicking) {
      this.isTicking = true;
      this.reference = Date.now();
      this.refresh();
    }
  }

  update() {
    this.onUpdate({
      secondLeft: Math.round(this.left / 1000),
      progress: this.progress,
    });
  }

  reset() {
    this.isTicking = false;
    clearTimeout(this.timeout);
    this.init();
  }
}

const timer = new Timer(1500, {
  onUpdate: s => {
    const padToTwo = (num) =>
      num < 10 ? `0${num}` : num;
    const minute = padToTwo(Math.floor(s.secondLeft / 60));
    const second = padToTwo(s.secondLeft % 60);
    $('.time').text(`${minute}:${second}`);
  }
});

timer.init();

$('.play').on('submit', e => {
  e.preventDefault();
  var value = $('.play input').val();
  $('.play input').val('');
  $('.play input').blur();
  $('.bursts').append(
    $('<li>').text(value)
  );
  $('.bursts-count').text(` (${ $('.bursts li').length})`);
  timer.play();
});

$(document).on('keydown', e => {
  if (e.keyCode === 76 && !$('.play input').is(':focus')) {
    e.preventDefault();
    $('.play input').focus();
  }
});
