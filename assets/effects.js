// 輕量特效：捲動淡入 + 首頁亮點粒子（呼應閃亮波「滿滿的亮點無垠」）
(function () {
  // 尊重使用者的減少動態偏好
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. 捲動淡入：主要區塊進入視窗時浮現
  var targets = document.querySelectorAll('main h2, main .card, main .tablewrap, main blockquote');
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  // 2. hero 亮點粒子
  var hero = document.querySelector('.hero');
  if (!hero || reduced) return;
  var canvas = document.createElement('canvas');
  canvas.className = 'sparks';
  hero.insertBefore(canvas, hero.firstChild);
  var ctx = canvas.getContext('2d');
  var dots = [];
  var COLORS = ['#c0392b', '#277a4f', '#2e5fa3', '#c9971c', '#9a9aae', '#6d4a9e'];

  function resize() {
    canvas.width = hero.clientWidth;
    canvas.height = hero.clientHeight;
  }
  function spawn(n) {
    for (var i = 0; i < n; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.8 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.2,
        a: 0,
        life: 0,
        max: 300 + Math.random() * 300,
        c: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(function (d) {
      d.x += d.vx; d.y += d.vy; d.life++;
      var half = d.max / 2;
      d.a = d.life < half ? d.life / half : Math.max(0, 1 - (d.life - half) / half);
      ctx.globalAlpha = d.a * 0.55;
      ctx.fillStyle = d.c;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    dots = dots.filter(function (d) { return d.life < d.max && d.y > -5; });
    if (dots.length < 45) spawn(45 - dots.length);
    requestAnimationFrame(tick);
  }
  resize();
  window.addEventListener('resize', resize);
  spawn(45);
  tick();
})();
