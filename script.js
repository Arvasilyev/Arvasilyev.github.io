document.addEventListener('DOMContentLoaded', () => {
    // Добавляем индикатор скролла
    const indicatorHTML = `
      <div class="scroll-indicator">
        <div class="scroll-track">
          <div class="scroll-thumb"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', indicatorHTML);
    
    // Настройки скролла
    const SCROLL_DELAY = 800;
    let isScrolling = false;
    const sections = document.querySelectorAll('section');
    const thumb = document.querySelector('.scroll-thumb');
    
    // Обновляем позицию индикатора
    function updateIndicator() {
      const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      const trackHeight = document.querySelector('.scroll-track').offsetHeight;
      const thumbHeight = thumb.offsetHeight;
      const maxOffset = trackHeight - thumbHeight;
      const thumbPosition = (scrollPercentage / 100) * maxOffset;
      
      thumb.style.transform = `translateY(${thumbPosition}px)`;
    }
    
    // Обработчик скролла
    function handleScroll(e) {
      if (isScrolling) return;
      isScrolling = true;
      
      const currentPos = window.scrollY;
      const windowHeight = window.innerHeight;
      let targetSection;
      
      // Определяем направление скролла
      if (e.deltaY > 0) {
        // Скролл вниз
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].offsetTop > currentPos + windowHeight * 0.1) {
            targetSection = sections[i];
            break;
          }
        }
      } else {
        // Скролл вверх
        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i].offsetTop < currentPos - windowHeight * 0.1) {
            targetSection = sections[i];
            break;
          }
        }
      }
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        });
      }
      
      setTimeout(() => {
        isScrolling = false;
      }, SCROLL_DELAY);
    }
    
    // Обработчики событий
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('scroll', updateIndicator);
    
    // Для тач-устройств
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    });
    
    window.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (Math.abs(diff) < 50) return;
      
      const fakeEvent = { deltaY: diff > 0 ? 1 : -1 };
      handleScroll(fakeEvent);
    });
    
    // Инициализация индикатора
    updateIndicator();
  });