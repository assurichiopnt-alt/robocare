// Assurich RoboCare — site script
(function () {
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Pre-select interest from ?interest= in URL
  var params = new URLSearchParams(location.search);
  var interest = params.get('interest');
  var sel = document.getElementById('f-interest');
  if (interest && sel) {
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === interest) { sel.selectedIndex = i; break; }
    }
  }

  // Demo form: no server yet -> compose email or WhatsApp message
  var form = document.getElementById('demo-form');
  if (!form) return;

  function buildText() {
    var d = new FormData(form);
    return [
      'Book Assessment / Trial — Assurich RoboCare',
      'Name: ' + (d.get('name') || ''),
      'Email: ' + (d.get('email') || ''),
      'Phone: ' + (d.get('phone') || ''),
      'Organization: ' + (d.get('org') || '-'),
      'Care setting: ' + (d.get('setting') || ''),
      'Interest: ' + (d.get('interest') || ''),
      'Need: ' + (d.get('need') || '')
    ].join('\n');
  }

  function valid() {
    if (!form.checkValidity()) { form.reportValidity(); return false; }
    return true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valid()) return;
    var subject = encodeURIComponent('Book Assessment / Trial — ' + (form.name.value || ''));
    window.location.href = 'mailto:sa02@assurich.com?subject=' + subject + '&body=' + encodeURIComponent(buildText());
    document.querySelector('.form-msg').style.display = 'block';
  });

  var waBtn = document.getElementById('send-wa');
  if (waBtn) {
    waBtn.addEventListener('click', function () {
      if (!valid()) return;
      window.open('https://wa.me/6597162646?text=' + encodeURIComponent(buildText()), '_blank', 'noopener');
    });
  }
})();

// Hero slider: auto-advance every 4.5 s, pause on hover, clickable dots
(function () {
  var box = document.querySelector('.slider');
  if (!box) return;
  var slides = box.querySelectorAll('.slide');
  var dots = box.querySelectorAll('.dots-nav button');
  var i = 0, timer = null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(n) {
    slides[i].classList.remove('on'); dots[i].classList.remove('on');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('on'); dots[i].classList.add('on');
  }
  function start() { if (!reduce) { stop(); timer = setInterval(function () { show(i + 1); }, 4500); } }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  dots.forEach(function (d, n) { d.addEventListener('click', function () { show(n); start(); }); });
  box.addEventListener('mouseenter', stop);
  box.addEventListener('mouseleave', start);
  start();
})();
