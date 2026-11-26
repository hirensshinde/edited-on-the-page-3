/* OneHostBox forms: sends this site's forms to its owner. */
(function () {
  function show(el) { el.hidden = false; el.style.display = ''; }
  function hide(el) { el.style.display = 'none'; }
  function wire(form) {
    if (form.__ohb) return;
    form.__ohb = true;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('[data-ohb-success]');
      var err = form.querySelector('[data-ohb-error]');
      var btn = form.querySelector('button[type=submit],input[type=submit],button:not([type])');
      if (err) hide(err);
      if (btn) btn.disabled = true;
      fetch(form.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(form)),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (b) {
          if (r.status === 429) throw new Error('Too many messages from here. Please try again in a few minutes.');
          if (!r.ok) throw new Error(typeof b.message === 'string' ? b.message : 'Your message could not be sent. Please try again.');
        });
      }).then(function () {
        form.reset();
        if (!ok) {
          ok = document.createElement('p');
          ok.setAttribute('role', 'status');
          ok.textContent = 'Thanks! Your message has been sent.';
          form.appendChild(ok);
        }
        Array.prototype.forEach.call(form.children, function (c) { if (c !== ok && !c.contains(ok)) hide(c); });
        show(ok);
        if (ok.setAttribute) ok.setAttribute('tabindex', '-1');
        if (ok.focus) ok.focus();
      }).catch(function (x) {
        if (!err) {
          err = document.createElement('p');
          err.setAttribute('role', 'alert');
          form.appendChild(err);
        }
        err.textContent = (x && x.message) || 'Your message could not be sent. Please try again.';
        show(err);
      }).then(function () { if (btn) btn.disabled = false; });
    });
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll('form[data-ohb-form]'), wire); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
