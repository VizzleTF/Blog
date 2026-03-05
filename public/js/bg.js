
  function generateParticles(n) {
    let value = `${getRandom(2560)}px ${getRandom(2560)}px #000`;
    for (let i = 2; i <= n; i++) {
      value += `, ${getRandom(2560)}px ${getRandom(2560)}px #000`;
    }
    return value;
  }

  function generateStars(n) {
    let value = `${getRandom(2560)}px ${getRandom(2560)}px #fff`;
    for (let i = 2; i <= n; i++) {
      value += `, ${getRandom(2560)}px ${getRandom(2560)}px #fff`;
    }
    return value;
  }

  function getRandom(max) {
    return Math.floor(Math.random() * max);
  }

  function initBG() {
    if (!window._bgCache) {
      window._bgCache = {
        particlesSmall: generateParticles(1000),
        particlesMedium: generateParticles(500),
        particlesLarge: generateParticles(250),
        starsSmall: generateStars(1000),
        starsMedium: generateStars(500),
        starsLarge: generateStars(250),
      };
    }

    const c = window._bgCache;

    const particles1 = document.getElementById('particles1');
    const particles2 = document.getElementById('particles2');
    const particles3 = document.getElementById('particles3');

    if (particles1) {
      particles1.style.cssText = `
      width: 1px;
      height: 1px;
      border-radius: 50%;
      box-shadow: ${c.particlesSmall};
      animation: animStar 50s linear infinite;
      `;
    }

    if (particles2) {
      particles2.style.cssText = `
      width: 1.5px;
      height: 1.5px;
      border-radius: 50%;
      box-shadow: ${c.particlesMedium};
      animation: animateParticle 100s linear infinite;
      `;
    }

    if (particles3) {
      particles3.style.cssText = `
      width: 2px;
      height: 2px;
      border-radius: 50%;
      box-shadow: ${c.particlesLarge};
      animation: animateParticle 150s linear infinite;
      `;
    }

    const stars1 = document.getElementById('stars1');
    const stars2 = document.getElementById('stars2');
    const stars3 = document.getElementById('stars3');

    if (stars1) {
      stars1.style.cssText = `
      width: 1px;
      height: 1px;
      border-radius: 50%;
      box-shadow: ${c.starsSmall};
      `;
    }

    if (stars2) {
      stars2.style.cssText = `
      width: 1.5px;
      height: 1.5px;
      border-radius: 50%;
      box-shadow: ${c.starsMedium};
      `;
    }

    if (stars3) {
      stars3.style.cssText = `
      width: 2px;
      height: 2px;
      border-radius: 50%;
      box-shadow: ${c.starsLarge};
      `;
    }
  }

  document.addEventListener('astro:after-swap', initBG);
  initBG();
