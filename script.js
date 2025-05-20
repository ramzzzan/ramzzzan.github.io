document.addEventListener("DOMContentLoaded", () => {
  // Меню бургер
  const burger = document.getElementById("burger")
  const nav = document.querySelector("#nav ul")

  burger.addEventListener("click", () => {
    nav.classList.toggle("active")
    burger.classList.toggle("active")
  })

  // Плавная прокрутка для якорных ссылок и активация пунктов меню
  document.querySelectorAll("#nav ul li a, .footer-col ul li a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // Если это ссылка с хэшем, обрабатываем как якорную ссылку
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault()

        if (this.getAttribute("href") === "#") return

        // Удаляем активный класс у всех пунктов меню
        document.querySelectorAll("#nav ul li a").forEach((item) => {
          item.classList.remove("active")
        })

        // Добавляем активный класс текущему пункту
        this.classList.add("active")

        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth",
          })

          // Закрываем меню на мобильных устройствах
          if (nav.classList.contains("active")) {
            nav.classList.remove("active")
            burger.classList.remove("active")
          }
        }
      }
    })
  })

  // Обработчик для кнопок в футере
  document.querySelectorAll(".footer-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Проверяем есть ли соответствующий раздел на странице
      const targetId = this.textContent.toLowerCase().trim()
      const possibleSections = {
        "о компании": "about",
        новости: "news",
        вакансии: "about",
        реклама: "contact",
        "правила посещения": "rules",
        "цены и скидки": "schedule",
        "подарочные сертификаты": "contact",
        "ино-бар": "about",
      }

      const sectionId = possibleSections[targetId]
      if (sectionId && document.getElementById(sectionId)) {
        // Если есть соответствующий раздел прокручиваем к нему
        window.scrollTo({
          top: document.getElementById(sectionId).offsetTop - 80,
          behavior: "smooth",
        })
      } else {
        // Если нет то показываем уведомление
        showNotification(`Страница "${this.textContent}" находится в разработке`, "info")
      }
    })
  })

  // Изменение шапки при скролле
  const header = document.querySelector(".header")
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Слайдер
  function initSlider() {
    const sliderWrapper = document.getElementById("sliderWrapper")
    const slides = document.querySelectorAll(".slide")
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")
    const dotsContainer = document.querySelector(".slider-dots")

    if (!sliderWrapper || !slides.length || !prevBtn || !nextBtn || !dotsContainer) {
      console.error("Slider elements not found")
      return
    }

    let currentSlide = 0
    let slideInterval

    // Очищаем контейнер с точками перед добавлением новых
    dotsContainer.innerHTML = ""

    // Создаем точки для слайдера
    slides.forEach((slide, index) => {
      const dot = document.createElement("div")
      dot.classList.add("dot")
      if (index === 0) dot.classList.add("active")
      dot.addEventListener("click", () => goToSlide(index))
      dotsContainer.appendChild(dot)
    })

    const dots = document.querySelectorAll(".dot")

    // Функция перехода к конкретному слайду
    function goToSlide(index) {
      // Удаляем активный класс у всех слайдов
      slides.forEach((slide) => slide.classList.remove("active"))

      currentSlide = (index + slides.length) % slides.length

      // Обновляем положение слайдера
      sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`

      // Обновляем активный класс у текущего слайда
      slides[currentSlide].classList.add("active")

      // Обновляем точки
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentSlide)
      })
    }

    // Следующий слайд
    function nextSlide() {
      goToSlide(currentSlide + 1)
    }

    // Предыдущий слайд
    function prevSlide() {
      goToSlide(currentSlide - 1)
    }

    // Автопрокрутка
    function startSlider() {
      stopSlider() // Останавливаем предыдущий интервал, если он был
      slideInterval = setInterval(nextSlide, 5000)
    }

    function stopSlider() {
      if (slideInterval) {
        clearInterval(slideInterval)
      }
    }

    // Обработчики кнопок
    prevBtn.addEventListener("click", () => {
      prevSlide()
      stopSlider()
      startSlider()
    })

    nextBtn.addEventListener("click", () => {
      nextSlide()
      stopSlider()
      startSlider()
    })

    // Останавливаем автопрокрутку при наведении
    sliderWrapper.addEventListener("mouseenter", stopSlider)
    sliderWrapper.addEventListener("mouseleave", startSlider)

    // Поддержка свайпов для мобильных устройств
    let touchStartX = 0
    let touchEndX = 0

    sliderWrapper.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      false,
    )

    sliderWrapper.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX
        handleSwipe()
      },
      false,
    )

    function handleSwipe() {
      // Определяем минимальное расстояние для свайпа (20% ширины экрана)
      const minSwipeDistance = window.innerWidth * 0.2

      if (touchStartX - touchEndX > minSwipeDistance) {
        // Свайп влево - следующий слайд
        nextSlide()
        stopSlider()
        startSlider()
      } else if (touchEndX - touchStartX > minSwipeDistance) {
        // Свайп вправо - предыдущий слайд
        prevSlide()
        stopSlider()
        startSlider()
      }
    }

    // Улучшение отображения слайдера на мобильных устройствах
    function adjustSliderForMobile() {
      const isMobile = window.innerWidth <= 768

      // Настраиваем интервал автопрокрутки в зависимости от устройства
      stopSlider()

      // На мобильных устройствах делаем интервал короче
      const interval = isMobile ? 4000 : 5000
      slideInterval = setInterval(nextSlide, interval)

      // Настраиваем видимость кнопок на мобильных устройствах
      if (isMobile) {
        // Скрываем кнопки навигации после короткой задержки на мобильных
        prevBtn.style.opacity = "0.6"
        nextBtn.style.opacity = "0.6"
      } else {
        prevBtn.style.opacity = "0.7"
        nextBtn.style.opacity = "0.7"
      }
    }

    // Показываем кнопки при касании на мобильных
    sliderWrapper.addEventListener("touchstart", () => {
      if (window.innerWidth <= 768) {
        prevBtn.style.opacity = "1"
        nextBtn.style.opacity = "1"

        // Скрываем кнопки через 3 секунды после последнего касания
        clearTimeout(window.navButtonsTimeout)
        window.navButtonsTimeout = setTimeout(() => {
          prevBtn.style.opacity = "0.6"
          nextBtn.style.opacity = "0.6"
        }, 3000)
      }
    })

    // Инициализируем первый слайд как активный
    slides[0].classList.add("active")

    // Запускаем слайдер
    startSlider()

    // Вызываем функцию при загрузке и изменении размера окна
    adjustSliderForMobile()
    window.addEventListener("resize", adjustSliderForMobile)

    // Возвращаем функции для использования в других частях кода
    return {
      goToSlide,
      nextSlide,
      prevSlide,
      startSlider,
      stopSlider,
    }
  }

  // Инициализируем слайдер
  const slider = initSlider()
  // Добавляем обработчики для кнопок на слайдере после инициализации слайдера
  function initSliderButtons() {
    // Кнопки "Купить билет"
    document.querySelectorAll(".slide .btn-primary.book-tickets").forEach((btn) => {
      btn.addEventListener("click", function () {
        const movieTitle = this.closest(".slide").querySelector("h2").textContent
        const movieId = this.getAttribute("data-id") || "slider-movie"
        openBookingModalWithMovie(movieTitle, movieId)
      })
    })

    // Кнопки "Смотреть трейлер"
    document.querySelectorAll(".slide .btn-outline.watch-trailer").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        const trailerUrl = this.getAttribute("data-trailer")
        if (trailerUrl) {
          trailerFrame.src = trailerUrl
          openModal(trailerModal)
        }
      })
    })
  }

  // Инициализируем кнопки на слайдере
  initSliderButtons()

  // Табы расписания
  const tabBtns = document.querySelectorAll(".tab-btn")
  const scheduleContent = document.querySelector(".schedule-content")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Удаляем активный класс у всех кнопок
      tabBtns.forEach((b) => b.classList.remove("active"))
      // Добавляем активный класс текущей кнопке
      this.classList.add("active")

      // Имитация загрузки данных
      setTimeout(() => {
        const day = this.getAttribute("data-day")
        let content = ""

        if (day === "today") {
          content = `
            <div class="schedule-day">
                <h3>Сегодня, ${new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}</h3>
                <div class="schedule-list">
                    <div class="schedule-item">
                        <div class="movie-time">10:00</div>
                        <div class="movie-title">Дюна 2</div>
                        <div class="movie-hall">Зал 1</div>
                        <div class="movie-price">1500 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Дюна 2" data-id="movie1">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">12:30</div>
                        <div class="movie-title">Оппенгеймер</div>
                        <div class="movie-hall">Зал 2</div>
                        <div class="movie-price">1750 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Оппенгеймер" data-id="movie2">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">15:00</div>
                        <div class="movie-title">Барби</div>
                        <div class="movie-hall">Зал 3</div>
                        <div class="movie-price">2000 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Барби" data-id="movie3">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">17:30</div>
                        <div class="movie-title">Крушение</div>
                        <div class="movie-hall">Зал 1</div>
                        <div class="movie-price">1750 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Крушение" data-id="movie4">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">19:45</div>
                        <div class="movie-title">Джокер 2</div>
                        <div class="movie-hall">Зал 2</div>
                        <div class="movie-price">2250 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Джокер 2" data-id="movie5">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">22:00</div>
                        <div class="movie-title">Гладиатор 2</div>
                        <div class="movie-hall">Зал 3</div>
                        <div class="movie-price">2500 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Гладиатор 2" data-id="movie6">Купить</button>
                    </div>
                </div>
            </div>
          `
        } else if (day === "tomorrow") {
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)

          content = `
            <div class="schedule-day">
                <h3>Завтра, ${tomorrow.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}</h3>
                <div class="schedule-list">
                    <div class="schedule-item">
                        <div class="movie-time">11:00</div>
                        <div class="movie-title">Крушение</div>
                        <div class="movie-hall">Зал 1</div>
                        <div class="movie-price">1500 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Крушение" data-id="movie4">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">14:30</div>
                        <div class="movie-title">Дюна 2</div>
                        <div class="movie-hall">Зал 2</div>
                        <div class="movie-price">1750 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Дюна 2" data-id="movie1">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">17:00</div>
                        <div class="movie-title">Оппенгеймер</div>
                        <div class="movie-hall">Зал 3</div>
                        <div class="movie-price">2000 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Оппенгеймер" data-id="movie2">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">20:00</div>
                        <div class="movie-title">Барби</div>
                        <div class="movie-hall">Зал 1</div>
                        <div class="movie-price">2000 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Барби" data-id="movie3">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">21:30</div>
                        <div class="movie-title">Джокер 2</div>
                        <div class="movie-hall">Зал 2</div>
                        <div class="movie-price">2250 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Джокер 2" data-id="movie5">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">22:30</div>
                        <div class="movie-title">Гладиатор 2</div>
                        <div class="movie-hall">Зал 3</div>
                        <div class="movie-price">2500 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Гладиатор 2" data-id="movie6">Купить</button>
                    </div>
                </div>
            </div>
          `
        } else {
          content = `
            <div class="schedule-week">
                <h3>Расписание на неделю</h3>
                <div class="schedule-list">
                    <div class="schedule-item">
                        <div class="movie-time">Пн, 15</div>
                        <div class="movie-title">Дюна 2</div>
                        <div class="movie-hall">Зал 1</div>
                        <div class="movie-price">1500 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Дюна 2" data-id="movie1">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">Вт, 16</div>
                        <div class="movie-title">Оппенгеймер</div>
                        <div class="movie-hall">Зал 2</div>
                        <div class="movie-price">1750 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Оппенгеймер" data-id="movie2">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">Ср, 17</div>
                        <div class="movie-title">Барби</div>
                        <div class="movie-hall">Зал 3</div>
                        <div class="movie-price">2000 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Барби" data-id="movie3">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">Чт, 18</div>
                        <div class="movie-title">Крушение</div>
                        <div class="movie-hall">Зал 1</div>
                        <div class="movie-price">1750 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Крушение" data-id="movie4">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">Пт, 19</div>
                        <div class="movie-title">Джокер 2</div>
                        <div class="movie-hall">Зал 2</div>
                        <div class="movie-price">2250 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Джокер 2" data-id="movie5">Купить</button>
                    </div>
                    <div class="schedule-item">
                        <div class="movie-time">Сб, 20</div>
                        <div class="movie-title">Гладиатор 2</div>
                        <div class="movie-hall">Зал 3</div>
                        <div class="movie-price">2500 ₸</div>
                        <button class="btn-buy book-tickets" data-movie="Гладиатор 2" data-id="movie6">Купить</button>
                    </div>
                </div>
            </div>
          `
        }

        scheduleContent.innerHTML = content

        // Добавляем обработчики для кнопок бронирования
        document.querySelectorAll(".book-tickets").forEach((btn) => {
          btn.addEventListener("click", openBookingModal)
        })

        // Добавляем анимацию появления
        const scheduleItems = document.querySelectorAll(".schedule-item")
        scheduleItems.forEach((item, index) => {
          item.style.opacity = "0"
          item.style.transform = "translateY(20px)"
          setTimeout(() => {
            item.style.transition = "opacity 0.5s ease, transform 0.5s ease"
            item.style.opacity = "1"
            item.style.transform = "translateY(0)"
          }, 100 * index)
        })
      }, 800)
    })
  })

  // Инициализация первого таба
  tabBtns[0].click()

  // Фильтрация новостей
  const filterBtns = document.querySelectorAll(".filter-btn")
  const newsItems = document.querySelectorAll(".news-item")
  const searchInput = document.querySelector(".filter-search input")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Удаляем активный класс у всех кнопок
      filterBtns.forEach((b) => b.classList.remove("active"))
      // Добавляем активный класс текущей кнопке
      this.classList.add("active")

      const filter = this.getAttribute("data-filter")

      // Фильтруем новости
      newsItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block"
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "translateY(0)"
          }, 50)
        } else {
          item.style.opacity = "0"
          item.style.transform = "translateY(20px)"
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })

      // Добавляем вызов функции инициализации кнопок "Купить" после фильтрации
      setTimeout(() => {
      }, 350)
    })
  })

  // Поиск по новостям
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()

    newsItems.forEach((item) => {
      const title = item.querySelector("h3").textContent.toLowerCase()
      const content = item.querySelector("p").textContent.toLowerCase()

      if (title.includes(searchTerm) || content.includes(searchTerm)) {
        item.style.display = "block"
        setTimeout(() => {
          item.style.opacity = "1"
          item.style.transform = "translateY(0)"
        }, 50)
      } else {
        item.style.opacity = "0"
        item.style.transform = "translateY(20px)"
        setTimeout(() => {
          item.style.display = "none"
        }, 300)
      }
    })

    // Добавляем вызов функции инициализации кнопок "Купить" после поиска
    setTimeout(() => {
    }, 350)
  })

  // Модальное окно входа
  const loginModal = document.getElementById("loginModal")
  const loginBtn = document.querySelector(".btn-login")
  const closeModalBtns = document.querySelectorAll(".close-modal")
  const registerLink = document.querySelector(".register-link")
  const forgotPasswordLink = document.querySelector(".forgot-password")
  const registerModal = document.getElementById("registerModal")
  const forgotPasswordModal = document.getElementById("forgotPasswordModal")
  const backToLoginLinks = document.querySelectorAll(".back-to-login")

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault()
    openModal(loginModal)
  })

  // Обработчик для ссылки "Зарегистрироваться"
  registerLink.addEventListener("click", (e) => {
    e.preventDefault()
    closeModal(loginModal)
    openModal(registerModal)
  })

  // Обработчик для ссылки "Забыли пароль"
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault()
    closeModal(loginModal)
    openModal(forgotPasswordModal)
  })

  // Обработчики для ссылок "Вернуться к входу"
  backToLoginLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const modal = link.closest(".modal")
      closeModal(modal)
      openModal(loginModal)
    })
  })

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal")
      closeModal(modal)

      // Если это модальное окно с трейлером, останавливаем видео
      if (modal.id === "trailerModal") {
        document.getElementById("trailerFrame").src = ""
      }
    })
  })

  // Закрытие модального окна при клике вне его
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal(e.target)

      // Если это модальное окно с трейлером, останавливаем видео
      if (e.target.id === "trailerModal") {
        document.getElementById("trailerFrame").src = ""
      }
    }
  })

  // Функции для работы с модальными окнами
  function openModal(modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"

    // Добавляем анимацию для содержимого модального окна
    const modalContent = modal.querySelector(".modal-content")
    if (modalContent) {
      modalContent.style.opacity = "0"
      modalContent.style.transform = "translateY(-20px)"
      setTimeout(() => {
        modalContent.style.transition = "opacity 0.3s ease, transform 0.3s ease"
        modalContent.style.opacity = "1"
        modalContent.style.transform = "translateY(0)"
      }, 50)
    }
  }

  function closeModal(modal) {
    const modalContent = modal.querySelector(".modal-content")
    if (modalContent) {
      modalContent.style.opacity = "0"
      modalContent.style.transform = "translateY(-20px)"
      setTimeout(() => {
        modal.classList.remove("active")
        document.body.style.overflow = ""
        // Сбрасываем стили после закрытия
        modalContent.style.transition = ""
        modalContent.style.opacity = ""
        modalContent.style.transform = ""
      }, 300)
    } else {
      modal.classList.remove("active")
      document.body.style.overflow = ""
    }
  }

  // Обработка формы входа
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      showNotification("Вы успешно вошли в систему!", "success")
      closeModal(loginModal)

      // Обновляем кнопку входа, чтобы показать, что пользователь вошел
      loginBtn.innerHTML = '<i class="fas fa-user-check"></i> Профиль'
      loginBtn.classList.add("logged-in")
    })
  }

  // Обработка формы регистрации
  const registerForm = document.getElementById("registerForm")
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      showNotification("Регистрация успешно завершена! Проверьте вашу почту для подтверждения.", "success")
      closeModal(registerModal)
    })
  }

  // Обработка формы восстановления пароля
  const forgotPasswordForm = document.getElementById("forgotPasswordForm")
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault()
      showNotification("Инструкции по восстановлению пароля отправлены на вашу почту!", "success")
      closeModal(forgotPasswordModal)
    })
  }

  // Обработка формы обратной связи
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()
      showNotification("Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.", "success")
      this.reset()

      // Добавляем эффект успешной отправки
      const formElements = this.querySelectorAll("input, textarea, button")
      formElements.forEach((el) => {
        el.disabled = true
      })

      const successMessage = document.createElement("div")
      successMessage.className = "success-message"
      successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Сообщение отправлено!'
      this.appendChild(successMessage)

      setTimeout(() => {
        formElements.forEach((el) => {
          el.disabled = false
        })
        successMessage.remove()
      }, 3000)
    })
  }

  // Обработка формы подписки
  const subscribeForm = document.querySelector(".subscribe-form-large")
  if (subscribeForm) {
    subscribeForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const emailInput = this.querySelector("input")
      const email = emailInput.value.trim()

      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification("Вы успешно подписались на новости и акции!", "success")
        emailInput.value = ""

        // Добавляем эффект успешной подписки
        const button = this.querySelector("button")
        const originalText = button.innerHTML
        button.innerHTML = '<i class="fas fa-check"></i> Подписка оформлена!'
        button.classList.add("success-btn")

        setTimeout(() => {
          button.innerHTML = originalText
          button.classList.remove("success-btn")
        }, 3000)
      } else {
        showNotification("Пожалуйста, введите корректный email", "error")
        emailInput.classList.add("error")

        setTimeout(() => {
          emailInput.classList.remove("error")
        }, 3000)
      }
    })
  }

  // Обработка формы подписки в футере
  const footerSubscribeForm = document.querySelector(".subscribe-form")
  if (footerSubscribeForm) {
    footerSubscribeForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const emailInput = this.querySelector("input")
      const email = emailInput.value.trim()

      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification("Вы успешно подписались на новости и акции!", "success")
        emailInput.value = ""

        // Добавляем эффект успешной подписки
        const button = this.querySelector("button")
        button.innerHTML = '<i class="fas fa-check"></i>'
        button.classList.add("success-btn")

        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-paper-plane"></i>'
          button.classList.remove("success-btn")
        }, 3000)
      } else {
        showNotification("Пожалуйста, введите корректный email", "error")
        emailInput.classList.add("error")

        setTimeout(() => {
          emailInput.classList.remove("error")
        }, 3000)
      }
    })
  }

  // Функция для отображения уведомлений
  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="close-notification">&times;</button>
      </div>
    `
    document.body.appendChild(notification)

    // Показываем уведомление
    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 5000)

    // Обработчик для закрытия уведомления
    notification.querySelector(".close-notification").addEventListener("click", () => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    })
  }

  // Кнопка "Наверх"
  const backToTopBtn = document.getElementById("backToTop")

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("active")
    } else {
      backToTopBtn.classList.remove("active")
    }
  })

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Просмотр трейлера
  const trailerModal = document.getElementById("trailerModal")
  const trailerFrame = document.getElementById("trailerFrame")
  const trailerBtns = document.querySelectorAll(".watch-trailer")

  trailerBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault()
      const trailerUrl = this.getAttribute("data-trailer")
      trailerFrame.src = trailerUrl
      openModal(trailerModal)
    })
  })

  // Добавляем обработчик для просмотра трейлера при клике на постер фильма
  document.querySelectorAll(".movie-poster").forEach((poster) => {
    poster.addEventListener("click", function () {
      const trailerBtn = this.querySelector(".watch-trailer")
      if (trailerBtn) {
        const trailerUrl = trailerBtn.getAttribute("data-trailer")
        trailerFrame.src = trailerUrl
        openModal(trailerModal)
      }
    })
  })

  // Модальное окно с подробностями о фильме
  const movieDetailsModal = document.getElementById("movieDetailsModal")

  function openMovieDetailsModal(movieTitle, movieId = "") {
    // Получаем данные о фильме
    const movieData = getMovieData(movieTitle, movieId)

    // Заполняем модальное окно данными
    document.getElementById("movieDetailsTitle").textContent = movieData.title
    document.getElementById("movieDetailsPoster").src = movieData.poster
    document.getElementById("movieDetailsRating").textContent = movieData.rating
    document.getElementById("movieDetailsAge").textContent = movieData.age
    document.getElementById("movieDetailsGenre").textContent = movieData.genre
    document.getElementById("movieDetailsDuration").textContent = movieData.duration
    document.getElementById("movieDetailsDirector").textContent = movieData.director
    document.getElementById("movieDetailsActors").textContent = movieData.actors
    document.getElementById("movieDetailsDescription").textContent = movieData.description

    // Устанавливаем трейлер
    const trailerBtn = document.getElementById("movieDetailsTrailerBtn")
    trailerBtn.setAttribute("data-trailer", movieData.trailer)

    // Устанавливаем ID фильма для кнопки бронирования
    const bookBtn = document.getElementById("movieDetailsBookBtn")
    bookBtn.setAttribute("data-movie", movieData.title)
    bookBtn.setAttribute("data-id", movieData.id)

    // Открываем модальное окно
    openModal(movieDetailsModal)
  }

  // Функция для получения данных о фильме
  function getMovieData(title, id = "") {
    const moviesData = {
      "Дюна 2": {
        id: "movie1",
        title: "Дюна 2",
        poster: "img/movie1.jpg",
        rating: "8.7",
        age: "16+",
        genre: "Боевик, Приключения, Фантастика",
        duration: "2ч 15мин",
        director: "Дени Вильнёв",
        actors: "Тимоти Шаламе, Зендея, Ребекка Фергюсон, Джош Бролин",
        description:
          "Продолжение истории Пола Атрейдеса, который объединяется с Чани и фрименами, чтобы отомстить заговорщикам, уничтожившим его семью. Столкнувшись с выбором между любовью всей его жизни и судьбой известной вселенной, он стремится предотвратить ужасное будущее, которое только он может предвидеть.",
        trailer: "https://www.youtube.com/embed/aSHs224Dge0",
      },
      Оппенгеймер: {
        id: "movie2",
        title: "Оппенгеймер",
        poster: "img/movie2.jpg",
        rating: "9.1",
        age: "12+",
        genre: "Фантастика, Драма, Биография",
        duration: "2ч 45мин",
        director: "Кристофер Нолан",
        actors: "Киллиан Мёрфи, Эмили Блант, Мэтт Деймон, Роберт Дауни мл.",
        description:
          "История жизни американского физика-теоретика Роберта Оппенгеймера, который во время Второй мировой войны руководил Манхэттенским проектом — разработкой первого ядерного оружия.",
        trailer: "https://www.youtube.com/embed/uYPbbksJxIg",
      },
      Барби: {
        id: "movie3",
        title: "Барби",
        poster: "img/movie3.jpg",
        rating: "7.8",
        age: "18+",
        genre: "Триллер, Детектив, Комедия",
        duration: "1ч 55мин",
        director: "Грета Гервиг",
        actors: "Марго Робби, Райан Гослинг, Америка Феррера",
        description:
          "Барби и Кен наслаждаются беззаботной жизнью в красочном мире Барбиленда, где каждый день — лучший день. Однако, когда их выгоняют в реальный мир, они обнаруживают радости и опасности, которые их ждут.",
        trailer: "https://www.youtube.com/embed/FKiCRMoumxk",
      },
      Крушение: {
        id: "movie4",
        title: "Крушение",
        poster: "img/movie4.jpg",
        rating: "6.5",
        age: "16+",
        genre: "Боевик, Триллер",
        duration: "2ч 05мин",
        director: "Жан-Франсуа Рише",
        actors: "Джерард Батлер, Майк Колтер, Йос Стеллинг",
        description:
          "Пилот гражданской авиации Рэй Торранс совершает героическую посадку поврежденного штормом самолета на острове в Филиппинах. Вскоре он обнаруживает, что остров захвачен воинствующими повстанцами, и теперь задача Торранса — защитить пассажиров и доставить их домой.",
        trailer: "https://www.youtube.com/embed/jP8a-GeqODA",
      },
      "Джокер 2": {
        id: "movie5",
        title: "Джокер 2",
        poster: "img/movie5.jpg",
        rating: "8.2",
        age: "18+",
        genre: "Триллер, Драма, Криминал",
        duration: "2ч 20мин",
        director: "Тодд Филлипс",
        actors: "Хоакин Феникс, Леди Гага, Зази Битц",
        description:
          "Продолжение истории Артура Флека, известного как Джокер. Фильм расскажет о новых безумных приключениях и погрузит зрителя в еще более темный и хаотичный мир Готэма.",
        trailer: "https://www.youtube.com/embed/d_j4K-QW_6U",
      },
      "Гладиатор 2": {
        id: "movie6",
        title: "Гладиатор 2",
        poster: "img/movie6.jpg",
        rating: "7.9",
        age: "16+",
        genre: "Боевик, Драма, Приключения",
        duration: "2ч 30мин",
        director: "Ридли Скотт",
        actors: "Пол Мескаль, Дензел Вашингтон, Конни Нильсен",
        description:
          "Спустя годы после событий первого фильма, история рассказывает о Луции, племяннике Коммода, который пытается найти свой путь в мире, полном интриг и борьбы за власть.",
        trailer: "https://www.youtube.com/embed/vsqiQYYexro",
      },
    }

    return (
      moviesData[title] || {
        id: "default",
        title: title,
        poster: "img/default-movie.jpg",
        rating: "0.0",
        age: "0+",
        genre: "Неизвестно",
        duration: "0ч 00мин",
        director: "Неизвестно",
        actors: "Неизвестно",
        description: "Описание отсутствует",
        trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      }
    )
  }

  // Модальное окно бронирования
  const bookingModal = document.getElementById("bookingModal")
  const bookingForm = document.getElementById("bookingForm")

  function openBookingModal(e) {
    e.preventDefault()

    const movieTitle = this.getAttribute("data-movie")
    const movieId = this.getAttribute("data-id")

    // Заполняем заголовок модального окна
    document.getElementById("bookingMovieTitle").textContent = `Бронирование билетов на "${movieTitle}"`

    // Устанавливаем информацию о фильме в модальном окне
    document.getElementById("summaryMovie").textContent = movieTitle

    // Открываем модальное окно
    openModal(bookingModal)

    // Сбрасываем шаги бронирования
    resetBookingSteps()
  }

  function openBookingModalWithMovie(movieTitle, movieId) {
    // Заполняем заголовок модального окна
    document.getElementById("bookingMovieTitle").textContent = `Бронирование билетов на "${movieTitle}"`

    // Устанавливаем информацию о фильме в модальном окне
    document.getElementById("summaryMovie").textContent = movieTitle

    // Открываем модальное окно
    openModal(bookingModal)

    // Сбрасываем шаги бронирования
    resetBookingSteps()
  }

  // Добавляем функцию для сброса шагов бронирования
  function resetBookingSteps() {
    // Показываем первый шаг, скрываем остальные
    document.getElementById("step1Content").style.display = "block"
    document.getElementById("step2Content").style.display = "none"
    document.getElementById("step3Content").style.display = "none"

    // Устанавливаем активный шаг
    document.querySelectorAll(".booking-step").forEach((step, index) => {
      if (index === 0) {
        step.classList.add("active")
      } else {
        step.classList.remove("active")
        step.classList.remove("completed")
      }
    })

    // Сбрасываем выбранные места и цену
    document.getElementById("summarySeats").textContent = "Не выбраны"
    document.getElementById("summaryPrice").textContent = "0 ₸"
    document.getElementById("finalPrice").textContent = "0 ₸"

    // Устанавливаем текущую дату и время
    const today = new Date()
    const formattedDate = today.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
    document.getElementById("summaryDateTime").textContent = `${formattedDate}, 15:00`
  }

  // Добавляем обработчики для кнопок навигации в модальном окне бронирования

  // Добавляем обработчики для кнопок бронирования
  document.querySelectorAll(".book-tickets").forEach((btn) => {
    btn.addEventListener("click", openBookingModal)
  })

  // Обработчики для шагов бронирования
  const goToStep2 = document.getElementById("goToStep2")
  const goToStep3 = document.getElementById("goToStep3")
  const backToStep1 = document.getElementById("backToStep1")
  const backToStep2 = document.getElementById("backToStep2")
  const cancelBooking = document.getElementById("cancelBooking")
  const confirmBooking = document.getElementById("confirmBooking")

  // Выбор даты и времени
  const dateBtns = document.querySelectorAll(".date-btn")
  const timeBtns = document.querySelectorAll(".time-btn")

  dateBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      dateBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      updateDateTime()
      checkStep1Complete()
    })
  })

  timeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      timeBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      updateDateTime()
      checkStep1Complete()
    })
  })

  function updateDateTime() {
    const selectedDate = document.querySelector(".date-btn.active")
    const selectedTime = document.querySelector(".time-btn.active")

    if (selectedDate && selectedTime) {
      const dateText = selectedDate.textContent
      const timeText = selectedTime.textContent
      document.getElementById("summaryDateTime").textContent = `${dateText}, ${timeText}`
      document.getElementById("ticketDateTime").textContent = `${dateText}, ${timeText}`
    }
  }

  function checkStep1Complete() {
    const selectedDate = document.querySelector(".date-btn.active")
    const selectedTime = document.querySelector(".time-btn.active")

    if (selectedDate && selectedTime) {
      goToStep2.disabled = false
    } else {
      goToStep2.disabled = true
    }
  }

  // Переход к шагу 2
  goToStep2.addEventListener("click", () => {
    document.getElementById("step1Content").style.display = "none"
    document.getElementById("step2Content").style.display = "block"

    document.querySelectorAll(".booking-step")[0].classList.add("completed")
    document.querySelectorAll(".booking-step")[0].classList.remove("active")
    document.querySelectorAll(".booking-step")[1].classList.add("active")

    // Генерируем места в зале
    generateSeats()
  })

  // Возврат к шагу 1
  backToStep1.addEventListener("click", () => {
    document.getElementById("step2Content").style.display = "none"
    document.getElementById("step1Content").style.display = "block"

    document.querySelectorAll(".booking-step")[1].classList.remove("active")
    document.querySelectorAll(".booking-step")[0].classList.remove("completed")
    document.querySelectorAll(".booking-step")[0].classList.add("active")
  })

  // Переход к шагу 3
  goToStep3.addEventListener("click", () => {
    document.getElementById("step2Content").style.display = "none"
    document.getElementById("step3Content").style.display = "block"

    document.querySelectorAll(".booking-step")[1].classList.add("completed")
    document.querySelectorAll(".booking-step")[1].classList.remove("active")
    document.querySelectorAll(".booking-step")[2].classList.add("active")

    // Копируем итоговую цену
    document.getElementById("finalPrice").textContent = document.getElementById("summaryPrice").textContent
  })

  // Возврат к шагу 2
  backToStep2.addEventListener("click", () => {
    document.getElementById("step3Content").style.display = "none"
    document.getElementById("step2Content").style.display = "block"

    document.querySelectorAll(".booking-step")[2].classList.remove("active")
    document.querySelectorAll(".booking-step")[1].classList.remove("completed")
    document.querySelectorAll(".booking-step")[1].classList.add("active")
  })

  // Отмена бронирования
  cancelBooking.addEventListener("click", () => {
    closeModal(bookingModal)
  })

  // Подтверждение бронирования
  confirmBooking.addEventListener("click", () => {
    // Генерируем случайный код бронирования
    const bookingCode = "CX-" + Math.floor(10000 + Math.random() * 90000)
    document.getElementById("ticketCode").textContent = bookingCode

    // Копируем информацию о фильме и местах
    document.getElementById("ticketMovie").textContent = document.getElementById("summaryMovie").textContent
    document.getElementById("ticketSeats").textContent = document.getElementById("summarySeats").textContent

    // Закрываем модальное окно бронирования и открываем окно успешного бронирования
    closeModal(bookingModal)
    openModal(document.getElementById("successModal"))
  })

  // Закрытие окна успешного бронирования
  document.getElementById("closeSuccess").addEventListener("click", () => {
    closeModal(document.getElementById("successModal"))
  })

  // Генерация мест в зале
  function generateSeats() {
    const seatMap = document.getElementById("seatMap")
    seatMap.innerHTML = ""

    // Генерируем 6 рядов по 10 мест
    for (let row = 1; row <= 6; row++) {
      for (let seat = 1; seat <= 10; seat++) {
        const seatElement = document.createElement("div")
        seatElement.className = "seat"

        // Случайным образом определяем, занято ли место
        const isOccupied = Math.random() < 0.3

        if (isOccupied) {
          seatElement.classList.add("occupied")
        } else {
          seatElement.classList.add("available")
          seatElement.addEventListener("click", toggleSeat)
        }

        seatElement.setAttribute("data-row", row)
        seatElement.setAttribute("data-seat", seat)
        seatElement.textContent = seat

        seatMap.appendChild(seatElement)
      }
    }
  }

  // Выбор или отмена выбора места
  function toggleSeat() {
    if (this.classList.contains("occupied")) return

    this.classList.toggle("selected")
    updateSelectedSeats()
  }

  // Обновление информации о выбранных местах
  function updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll(".seat.selected")
    const seatsText = Array.from(selectedSeats)
      .map((seat) => {
        const row = seat.getAttribute("data-row")
        const seatNum = seat.getAttribute("data-seat")
        return `Ряд ${row}, Место ${seatNum}`
      })
      .join("; ")

    document.getElementById("summarySeats").textContent = selectedSeats.length > 0 ? seatsText : "Не выбраны"

    // Рассчитываем стоимость (2000 тенге за место)
    const price = selectedSeats.length * 2000
    document.getElementById("summaryPrice").textContent = `${price} ₸`

    // Активируем или деактивируем кнопку перехода к шагу 3
    document.getElementById("goToStep3").disabled = selectedSeats.length === 0
  }

  // Обработка формы бронирования
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Получаем данные из формы
    const movieId = document.getElementById("bookingMovieId").value
    const date = document.getElementById("bookingDate").value
    const time = document.getElementById("bookingTime").value
    const seats = document.getElementById("bookingSeats").value

    showNotification(`Вы успешно забронировали ${seats} мест(а) на фильм "${movieId}" на ${date} в ${time}!`, "success")
    closeModal(bookingModal)
    this.reset()
  })

  // Инициализация
  function init() {
    // Получаем все элементы с классом "movie-item"
    const movieItems = document.querySelectorAll(".movie-item")

    // Для каждого элемента добавляем обработчик события при наведении мыши
    movieItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        // Добавляем класс "hovered" к текущему элементу
        item.classList.add("hovered")
      })

      item.addEventListener("mouseleave", () => {
        // Удаляем класс "hovered" с текущего элемента
        item.classList.remove("hovered")
      })
    })
  }

  // Вызываем функцию инициализации
  init()

  const showAllMoviesBtn = document.getElementById("showAllMovies")
  const allMoviesModal = document.getElementById("allMoviesModal")
  const allMoviesGrid = document.getElementById("allMoviesGrid")

  if (showAllMoviesBtn) {
    showAllMoviesBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Кнопка 'Все фильмы' нажата")

      // Очищаем сетку фильмов
      allMoviesGrid.innerHTML = ""

      // Получаем все фильмы из основной сетки
      const movieItems = document.querySelectorAll(".movie-item")
      console.log("Найдено фильмов:", movieItems.length)

      // Клонируем и добавляем их в модальное окно
      movieItems.forEach((item) => {
        const clone = item.cloneNode(true)
        allMoviesGrid.appendChild(clone)
      })

      // Добавляем обработчики событий для клонированных элементов
      allMoviesGrid.querySelectorAll(".book-tickets").forEach((btn) => {
        btn.addEventListener("click", openBookingModal)
      })

      allMoviesGrid.querySelectorAll(".watch-trailer").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault()
          const trailerUrl = this.getAttribute("data-trailer")
          trailerFrame.src = trailerUrl
          openModal(trailerModal)
        })
      })

      // Добавляем обработчик для заголовков фильмов в модальном окне
      allMoviesGrid.querySelectorAll(".movie-info h3").forEach((title) => {
        title.addEventListener("click", function () {
          const movieItem = this.closest(".movie-item")
          const movieId = movieItem.getAttribute("data-id")
          const movieTitle = this.textContent
          openMovieDetailsModal(movieTitle, movieId)
        })
        title.style.cursor = "pointer"
      })

      // Открываем модальное окно
      console.log("Открываем модальное окно")
      openModal(allMoviesModal)
    })
  }

  const showAllMoviesBtnElement = document.getElementById("showAllMovies")
  if (showAllMoviesBtnElement) {
    showAllMoviesBtnElement.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Кнопка 'Все фильмы' нажата")

      // Находим модальное окно и контейнер для фильмов
      const allMoviesModal = document.getElementById("allMoviesModal")
      const allMoviesGrid = document.getElementById("allMoviesGrid")

      if (!allMoviesModal || !allMoviesGrid) {
        console.error("Не найдены необходимые элементы для модального окна")
        return
      }

      // Очищаем контейнер
      allMoviesGrid.innerHTML = ""

      // Получаем все фильмы из основной сетки
      const movieItems = document.querySelectorAll(".movie-item")
      console.log("Найдено фильмов:", movieItems.length)

      // Клонируем и добавляем их в модальное окно
      movieItems.forEach((item) => {
        const clone = item.cloneNode(true)
        allMoviesGrid.appendChild(clone)
      })

      // Добавляем обработчики для кнопок "Купить билет"
      allMoviesGrid.querySelectorAll(".book-tickets").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault()
          const movieTitle = this.getAttribute("data-movie")
          const movieId = this.getAttribute("data-id")

          // Закрываем текущее модальное окно
          closeModal(allMoviesModal)

          // Открываем модальное окно бронирования с небольшой задержкой
          setTimeout(() => {
            openBookingModalWithMovie(movieTitle, movieId)
          }, 300)
        })
      })

      // Добавляем обработчики для кнопок "Смотреть трейлер"
      allMoviesGrid.querySelectorAll(".watch-trailer").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault()
          const trailerUrl = this.getAttribute("data-trailer")

          // Закрываем текущее модальное окно
          closeModal(allMoviesModal)

          // Открываем модальное окно с трейлером с небольшой задержкой
          setTimeout(() => {
            trailerFrame.src = trailerUrl
            openModal(trailerModal)
          }, 300)
        })
      })

      // Добавляем обработчики для заголовков фильмов
      allMoviesGrid.querySelectorAll(".movie-info h3").forEach((title) => {
        title.style.cursor = "pointer"
        title.addEventListener("click", function () {
          const movieItem = this.closest(".movie-item")
          const movieId = movieItem.getAttribute("data-id")
          const movieTitle = this.textContent

          // Закрываем текущее модальное окно
          closeModal(allMoviesModal)

          // Открываем модальное окно с подробностями о фильме с небольшой задержкой
          setTimeout(() => {
            openMovieDetailsModal(movieTitle, movieId)
          }, 300)
        })
      })

      // Открываем модальное окно
      console.log("Открываем модальное окно")
      openModal(allMoviesModal)
    })
  }
  //})



  readMoreBtns.forEach((btn) => {
    // Добавляем эффект при наведении
    btn.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s ease"
      this.style.color = "#b81d24"
      this.style.transform = "translateX(5px)"
    })

    btn.addEventListener("mouseleave", function () {
      this.style.transition = "all 0.3s ease"
      this.style.color = ""
      this.style.transform = ""
    })

    btn.addEventListener("click", function (e) {
      e.preventDefault()
      console.log("Кнопка 'Подробнее' нажата")

      const newsItem = this.closest(".news-item")
      const newsTitle = newsItem.querySelector("h3").textContent
      const newsDate = newsItem.querySelector(".news-date").textContent
      const newsContent = newsItem.querySelector("p").textContent
      const newsImage = newsItem.querySelector("img").src
      const newsCategory = newsItem.getAttribute("data-category")

      // Генерируем более подробное содержимое в зависимости от категории
      let detailedContent = `<p>${newsContent}</p>`

      if (newsCategory === "action") {
        detailedContent += `
          <h4>Условия акции:</h4>
          <ul>
            <li>Акция действует в период с ${newsDate} по ${new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</li>
            <li>Скидка распространяется на все сеансы указанного периода</li>
            <li>Для получения скидки необходимо предъявить карту лояльности</li>
            <li>Скидка не суммируется с другими акциями и предложениями</li>
          </ul>
          <p>Приходите в кинотеатр CinemaX и наслаждайтесь просмотром фильмов по выгодной цене!</p>
        `
      } else if (newsCategory === "news") {
        detailedContent += `
          <p>Мы рады сообщить вам о последних обновлениях в нашем кинотеатре. Следите за новостями на нашем сайте и в социальных сетях, чтобы быть в курсе всех событий.</p>
          <h4>Дополнительная информация:</h4>
          <p>Для получения более подробной информации вы можете обратиться к администратору кинотеатра или позвонить по телефону: +7 708 179 4125</p>
        `
      } else if (newsCategory === "event") {
        detailedContent += `
          <h4>Программа мероприятия:</h4>
          <ul>
            <li>Открытие мероприятия - 18:00</li>
            <li>Встреча с режиссером - 18:30</li>
            <li>Показ фильма - 19:30</li>
            <li>Обсуждение и вопросы - 21:30</li>
          </ul>
          <p>Не пропустите уникальную возможность встретиться с создателями фильма и задать интересующие вас вопросы!</p>
        `
      }

      // Заполняем модальное окно данными
      document.getElementById("newsDetailsTitle").textContent = newsTitle
      document.getElementById("newsDetailsDate").textContent = newsDate
      document.getElementById("newsDetailsContent").innerHTML = detailedContent
      document.getElementById("newsDetailsImage").src = newsImage

      // Устанавливаем категорию новости
      const newsBadge = document.getElementById("newsDetailsBadge")
      newsBadge.textContent = newsCategory === "action" ? "Акция" : newsCategory === "news" ? "Новость" : "Событие"

      // Открываем модальное окно с анимацией
      openModal(newsDetailsModal)

      // Добавляем анимацию для изображения
      const newsDetailsImage = document.getElementById("newsDetailsImage")
      newsDetailsImage.style.transition = "transform 0.5s ease"
      newsDetailsImage.style.transform = "scale(1)"

      setTimeout(() => {
        newsDetailsImage.style.transform = "scale(1.02)"
        setTimeout(() => {
          newsDetailsImage.style.transform = "scale(1)"
        }, 500)
      }, 100)
    })
  })

  // Добавляем обработчик для заголовков фильмов
  document.querySelectorAll(".movie-info h3").forEach((title) => {
    title.addEventListener("click", function () {
      const movieItem = this.closest(".movie-item")
      const movieId = movieItem.getAttribute("data-id")
      const movieTitle = this.textContent
      openMovieDetailsModal(movieTitle, movieId)
    })
    title.style.cursor = "pointer" // Добавляем стиль курсора, чтобы показать, что элемент кликабельный
  })
})
