// -------------------- Mobile menu elements --------------------
// First we grab the hamburger icon and the nav menu so we can use them everywhere
let hamburger = document.querySelector('.hamburger')
let navMenu = document.querySelector('.nav-menu')


// -------------------- Smooth scroll for nav links --------------------
// This makes the page scroll smoothly when we click links like #about, #projects, etc.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // Stop the default jump-to-section behavior
    e.preventDefault()

    // Find the section that matches the clicked link
    let target = document.querySelector(this.getAttribute('href'))

    if (target) {
      // Navbar height is subtracted so the section title doesn’t hide behind the navbar
      let navbarEl = document.querySelector('.navbar')
      let navHeight = navbarEl ? navbarEl.offsetHeight : 0

      // Where to scroll (section top - navbar height)
      let targetPosition = target.offsetTop - navHeight

      // Smooth scroll to the section
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })

      // If mobile menu is open, close it after clicking a link
      if (navMenu) navMenu.classList.remove('active')
      if (hamburger) hamburger.classList.remove('active')
    }
  })
})


// -------------------- Hamburger toggle (mobile) --------------------
// When user clicks hamburger, we open/close the menu
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active')
    navMenu.classList.toggle('active')
  })

  // Close the menu if user clicks outside of it
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active')
      navMenu.classList.remove('active')
    }
  })
}


// -------------------- Active nav link on scroll --------------------
// This highlights the nav link based on the section currently on screen
let sections = document.querySelectorAll('section')
let navLinks = document.querySelectorAll('.nav-link')

let updateActiveLink = () => {
  // +100 so the active link changes a little earlier while scrolling
  let scrollPosition = window.scrollY + 100

  sections.forEach(section => {
    let sectionTop = section.offsetTop
    let sectionHeight = section.offsetHeight
    let sectionId = section.getAttribute('id')

    // Check if scroll is inside this section
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active')

        // Match href with section id, like href="#about"
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active')
        }
      })
    }
  })
}

window.addEventListener('scroll', updateActiveLink)


// -------------------- Scroll animations (IntersectionObserver) --------------------
// We use IntersectionObserver to animate cards when they come into view
let observerOptions = {
  threshold: 0.1,           // element becomes visible when ~10% is in viewport
  rootMargin: '0px 0px -50px 0px' // triggers a bit earlier before fully visible
}

let observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // When element comes into view, show it nicely
      entry.target.style.opacity = '1'
      entry.target.style.transform = 'translateY(0)'
    }
  })
}, observerOptions)

// Select items we want to animate on scroll
let animateOnScroll = document.querySelectorAll(
  '.skill-category, .project-card, .service-card, .contact-card, .feature-card'
)

animateOnScroll.forEach(el => {
  // Start hidden + moved down
  el.style.opacity = '0'
  el.style.transform = 'translateY(30px)'

  // Add transition so it feels smooth
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'

  // Observer will “watch” this element
  observer.observe(el)
})


// -------------------- Navbar style change on scroll --------------------
// This changes navbar background + shadow when you scroll down
let navbar = document.querySelector('.navbar')

let updateNavbarStyle = () => {
  if (!navbar) return

  let isLightMode = document.body.classList.contains('light-mode')

  if (window.scrollY > 100) {
    navbar.classList.add('scrolled')

    // Light vs dark background styles
    if (isLightMode) {
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)'
    } else {
      navbar.style.backgroundColor = 'rgba(10, 14, 26, 0.95)'
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)'
    }
  } else {
    navbar.classList.remove('scrolled')

    // When at top, keep it more transparent
    if (isLightMode) {
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
      navbar.style.boxShadow = 'none'
    } else {
      navbar.style.backgroundColor = 'rgba(10, 14, 26, 0.9)'
      navbar.style.boxShadow = 'none'
    }
  }
}

window.addEventListener('scroll', updateNavbarStyle)


// -------------------- Theme toggle (dark/light) --------------------
// This switches the theme and saves it in localStorage
let themeToggle = document.getElementById('themeToggle')

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode')

    // Save user choice so it stays after refresh
    let isLightMode = document.body.classList.contains('light-mode')
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark')

    // Update navbar instantly after theme change
    updateNavbarStyle()
  })

  // On page load, apply saved theme if it exists
  let savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode')
  }

  // Set navbar style correctly on load
  updateNavbarStyle()
}


// -------------------- Skill tag hover effect --------------------
// Small animation when user hovers skill tags
let skillTags = document.querySelectorAll('.skill-tag')

skillTags.forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)'
  })

  tag.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)'
  })
})


// -------------------- Dynamic year --------------------
// Auto updates copyright year
let yearSpan = document.getElementById('year')

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear()
}


// -------------------- Typing effect for name/title --------------------
// It types "Akshat Shaw" then deletes and types "Software Developer"
let nameElement = document.getElementById('typed-name')

if (nameElement) {
  let texts = [
    { normal: 'Akshat ', highlight: 'Shaw' },
    { normal: 'Software ', highlight: 'Developer' }
  ]

  let textIndex = 0
  let charIndex = 0
  let isDeleting = false
  let isPaused = false

  let type = () => {
    let currentText = texts[textIndex]
    let fullText = currentText.normal + currentText.highlight

    // Pause before deleting, so user can read
    if (isPaused) {
      setTimeout(type, 2000)
      isPaused = false
      return
    }

    if (isDeleting) {
      // Delete characters
      charIndex--
      let textToShow = fullText.substring(0, charIndex)

      // Clear then rebuild with highlight span
      nameElement.innerHTML = ''

      if (textToShow.length <= currentText.normal.length) {
        nameElement.textContent = textToShow
      } else {
        nameElement.textContent = currentText.normal
        let span = document.createElement('span')
        span.className = 'highlight'
        span.textContent = textToShow.substring(currentText.normal.length)
        nameElement.appendChild(span)
      }

      // When fully deleted, move to next text
      if (charIndex === 0) {
        isDeleting = false
        textIndex = (textIndex + 1) % texts.length
        setTimeout(type, 500)
        return
      }

      setTimeout(type, 50)
    } else {
      // Type characters
      charIndex++
      let textToShow = fullText.substring(0, charIndex)

      nameElement.innerHTML = ''

      if (charIndex <= currentText.normal.length) {
        nameElement.textContent = textToShow
      } else {
        nameElement.textContent = currentText.normal
        let span = document.createElement('span')
        span.className = 'highlight'
        span.textContent = textToShow.substring(currentText.normal.length)
        nameElement.appendChild(span)
      }

      // When full text typed, pause then start deleting
      if (charIndex === fullText.length) {
        isPaused = true
        isDeleting = true
      }

      setTimeout(type, 100)
    }
  }

  setTimeout(type, 500)
}


// -------------------- Button click ripple effect --------------------
// This creates a ripple circle on button click
let buttons = document.querySelectorAll('.btn')

buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    let ripple = document.createElement('span')
    let rect = this.getBoundingClientRect()

    // Ripple size based on button size
    let size = Math.max(rect.width, rect.height)

    // Position ripple where user clicked
    let x = e.clientX - rect.left - size / 2
    let y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.classList.add('ripple')

    this.appendChild(ripple)

    // Remove ripple after animation ends
    setTimeout(() => ripple.remove(), 600)
  })
})


// -------------------- Project card tilt effect --------------------
// This gives a 3D tilt feel when moving mouse over cards
let projectCards = document.querySelectorAll('.project-card')

projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    let rect = card.getBoundingClientRect()
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top

    let centerX = rect.width / 2
    let centerY = rect.height / 2

    let rotateX = (y - centerY) / 20
    let rotateY = (centerX - x) / 20

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`
  })

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'
  })
})


// -------------------- Cursor trail effect --------------------
// Just a small UI effect that follows the mouse cursor
let cursor = document.createElement('div')
cursor.classList.add('cursor-trail')
document.body.appendChild(cursor)

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px'
  cursor.style.top = e.clientY + 'px'
})


// -------------------- Inject CSS styles from JS --------------------
// Not always the best practice, but works for quick styling
let style = document.createElement('style')

style.innerHTML = `
  .cursor-trail {
    position: fixed;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--primary-color);
    pointer-events: none;
    opacity: 0.3;
    transition: transform 0.2s ease;
    z-index: 9999;
    transform: translate(-50%, -50%);
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`

document.head.appendChild(style)


// -------------------- Service cards stagger animation --------------------
// Adds delay so cards animate one by one
let serviceCards = document.querySelectorAll('.service-card')

serviceCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`
})


// -------------------- Run things on page load --------------------
window.addEventListener('load', () => {
  document.body.classList.add('loaded')
  updateActiveLink()
  updateNavbarStyle()
})


// -------------------- Debounce utility --------------------
// Debounce means: don’t run function too many times while scrolling
function debounce(func, wait) {
  let timeout

  return function executedFunction(...args) {
    let later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Use debounce for scroll event to reduce lag
let debouncedScroll = debounce(() => {
  updateActiveLink()
}, 10)

window.addEventListener('scroll', debouncedScroll)


// -------------------- Simple performance log --------------------
// Shows approx page load time in console
if (window.performance) {
  window.addEventListener('load', () => {
    let perfData = window.performance.timing
    let pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    console.log(`Page load time: ${pageLoadTime}ms`)
  })
}
