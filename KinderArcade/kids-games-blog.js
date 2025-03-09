/**
 * Kids Games Blog - Main JavaScript File
 * Interactive features for a children's game blog
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ====== VARIABLES ======
  const backToTopButton = document.getElementById('back-to-top');
  const mobileMenuButton = document.getElementById('mobile-menu-toggle');
  const mobileMenuCloseButton = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  
  // ====== BACK TO TOP BUTTON ======
  if (backToTopButton) {
    // Afficher ou masquer le bouton en fonction du défilement
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    // Remonter en haut lors du clic
    backToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ====== MOBILE MENU ======
  if (mobileMenuButton && mobileMenu && mobileMenuOverlay) {
    // Ouvrir le menu mobile
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.add('open');
      mobileMenuOverlay.classList.add('open');
      // Empêcher le défilement de la page
      document.body.style.overflow = 'hidden';
      
      // Animation d'entrée pour les éléments du menu
      const menuItems = document.querySelectorAll('.mobile-nav a');
      menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, 100 + (index * 50));
      });
    });

    // Fermer le menu mobile
    function closeMenu() {
      mobileMenu.classList.remove('open');
      mobileMenuOverlay.classList.remove('open');
      // Réactiver le défilement de la page
      document.body.style.overflow = '';
    }

    mobileMenuCloseButton.addEventListener('click', closeMenu);
    mobileMenuOverlay.addEventListener('click', closeMenu);

    // Fermer le menu si la fenêtre est redimensionnée à une taille plus grande
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 769) {
        closeMenu();
      }
    });
  }

  // ====== ANIMATIONS POUR LES CARTES DE JEUX ======
  const gameCards = document.querySelectorAll('.game-card');
  
  if (gameCards.length > 0) {
    // Ajouter l'effet de survol avec un léger délai
    gameCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = 'var(--shadow-medium)';
        
        const image = this.querySelector('.game-image img');
        if (image) {
          image.style.transform = 'scale(1.08)';
        }
        
        const button = this.querySelector('.play-button');
        if (button) {
          button.style.backgroundColor = 'var(--primary-dark)';
          button.style.transform = 'scale(1.05)';
        }
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-light)';
        
        const image = this.querySelector('.game-image img');
        if (image) {
          image.style.transform = 'scale(1)';
        }
        
        const button = this.querySelector('.play-button');
        if (button) {
          button.style.backgroundColor = 'var(--primary-color)';
          button.style.transform = 'scale(1)';
        }
      });
    });

    // Animation à l'apparition des cartes lors du chargement de la page
    const animateCardsOnScroll = function() {
      gameCards.forEach((card, index) => {
        // Vérifier si la carte est visible
        const rect = card.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.9);

        if (isVisible) {
          // Déclencher l'animation d'apparition
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100 + (index % 3) * 150); // Délai variable selon la position
        }
      });
    };

    // Initialiser les cartes avec une opacité de 0 et une position décalée
    gameCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'none'; // Désactiver la transition au début
    });

    // Déclencher l'animation au chargement
    setTimeout(animateCardsOnScroll, 300);

    // Déclencher l'animation au défilement
    window.addEventListener('scroll', animateCardsOnScroll);
  }

  // ====== GESTION DES IMAGES ======
  // Appliquer le lazy loading à toutes les images
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.src; // Force le chargement
    });
  } else {
    // Fallback pour les navigateurs qui ne supportent pas le lazy loading natif
    // Vous pourriez importer une bibliothèque de lazy loading externe ici
  }
  
  // Animer le chargement des images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Si l'image est déjà chargée
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.4s ease-in';
      // Quand l'image est chargée
      img.addEventListener('load', function() {
        img.style.opacity = '1';
      });
    }
  });

  // ====== NOTIFICATIONS INTERACTIVES ======
  // Fonction pour afficher des notifications ludiques
  function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <p>${message}</p>
      </div>
      <button class="notification-close" aria-label="Fermer">
        <svg viewBox="0 0 24 24" class="icon icon-close">
          <path d="M18.3,5.71L12,12l6.3,6.29c0.39,0.39,0.39,1.02,0,1.41s-1.02,0.39-1.41,0L12,13.41l-6.29,6.29
           c-0.39,0.39-1.02,0.39-1.41,0s-0.39-1.02,0-1.41L10.59,12L4.3,5.71c-0.39-0.39-0.39-1.02,0-1.41s1.02-0.39,1.41,0L12,10.59l6.29-6.29
           c0.39-0.39,1.02-0.39,1.41,0S18.68,5.32,18.3,5.71z"/>
        </svg>
      </button>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Configurer la fermeture automatique
    const autoClose = setTimeout(() => {
      closeNotification();
    }, 5000);
    
    // Fermeture manuelle
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
      clearTimeout(autoClose);
      closeNotification();
    });
    
    // Fonction pour fermer la notification
    function closeNotification() {
      notification.classList.remove('show');
      notification.classList.add('hiding');
      setTimeout(() => {
        notification.remove();
      }, 300); // Durée de l'animation de sortie
    }
  }
  
  // Créer le CSS des notifications de manière dynamique
  const notificationStyles = document.createElement('style');
  notificationStyles.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 300px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transform: translateX(120%);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
      z-index: 9999;
    }
    
    .notification.show {
      transform: translateX(0);
      opacity: 1;
    }
    
    .notification.hiding {
      transform: translateX(120%);
      opacity: 0;
    }
    
    .notification-content {
      flex-grow: 1;
      margin-right: 10px;
    }
    
    .notification-content p {
      margin: 0;
      font-size: 14px;
    }
    
    .notification-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
    }
    
    .notification-close .icon {
      width: 16px;
      height: 16px;
    }
    
    .notification-info {
      border-left: 4px solid var(--primary-color);
    }
    
    .notification-success {
      border-left: 4px solid #4CAF50;
    }
    
    .notification-warning {
      border-left: 4px solid #FFC107;
    }
    
    .notification-error {
      border-left: 4px solid #F44336;
    }
  `;
  document.head.appendChild(notificationStyles);

  // ====== DÉTECTION DE FONCTIONNALITÉS ======
  // Vérifier la prise en charge des fonctionnalités modernes
  const featureSupport = {
    webAnimations: 'animate' in Element.prototype,
    lazyLoading: 'loading' in HTMLImageElement.prototype,
    webGL: (function() {
      try {
        const canvas = document.createElement('canvas');
        return !!window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch(e) {
        return false;
      }
    })()
  };
  
  // Enregistrer la fonction showNotification pour une utilisation externe
  window.showGameNotification = showNotification;

  // ====== BOUTONS DE PARTAGE ======
  const shareButtons = document.querySelectorAll('.share-button');
  
  if (shareButtons.length > 0) {
    shareButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Récupérer les informations à partager
        const url = this.getAttribute('data-url') || window.location.href;
        const title = this.getAttribute('data-title') || document.title;
        
        // Vérifier si l'API Web Share est disponible
        if (navigator.share) {
          navigator.share({
            title: title,
            url: url
          }).catch(console.error);
        } else {
          // Fallback: ouvrir une fenêtre de partage personnalisée
          const left = (screen.width / 2) - (550 / 2);
          const top = (screen.height / 2) - (450 / 2);
          const shareUrl = this.href;
          
          window.open(
            shareUrl,
            'Partager',
            `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=550, height=450, top=${top}, left=${left}`
          );
        }
      });
    });
  }

  // ====== JEUX SESSION TRACKER ======
  // Système simple pour suivre les jeux joués
  const gameTracker = {
    init: function() {
      // Initialiser ou récupérer l'historique des jeux
      this.gameHistory = JSON.parse(localStorage.getItem('kidsgamesHistory')) || [];
      
      // Ajouter des écouteurs d'événements aux boutons de jeu
      const playButtons = document.querySelectorAll('.play-button');
      if (playButtons.length > 0) {
        playButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            // Si nous sommes sur la page d'accueil, empêcher la navigation par défaut
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
              e.preventDefault();
              
              // Récupérer le titre du jeu
              const gameCard = button.closest('.game-card');
              if (gameCard) {
                const gameTitle = gameCard.querySelector('h3').textContent;
                const gameUrl = button.getAttribute('href');
                
                // Enregistrer ce jeu dans l'historique
                this.addToHistory(gameTitle, gameUrl);
                
                // Afficher une notification
                showNotification(`Tu as choisi de jouer à "${gameTitle}" ! Bon jeu !`, 'success');
                
                // Simuler la navigation après un court délai
                setTimeout(() => {
                  window.location.href = gameUrl;
                }, 1500);
              }
            }
          });
        });
      }
    },
    
    addToHistory: function(title, url) {
      // Ajouter le jeu au début de l'historique
      this.gameHistory.unshift({
        title: title,
        url: url,
        timestamp: Date.now()
      });
      
      // Limiter l'historique à 10 entrées
      if (this.gameHistory.length > 10) {
        this.gameHistory.pop();
      }
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('kidsgamesHistory', JSON.stringify(this.gameHistory));
    },
    
    getHistory: function() {
      return this.gameHistory;
    }
  };
  
  // Initialiser le tracker de jeux
  gameTracker.init();

  // ====== EFFETS DE PARTICULES POUR LES BOUTONS ======
  // Fonction pour ajouter un effet de particules aux boutons
  function addParticleEffect(element) {
    element.addEventListener('click', (e) => {
      // Créer l'élément conteneur pour les particules
      const particles = document.createElement('div');
      particles.className = 'button-particles';
      document.body.appendChild(particles);
      
      // Positionner le conteneur à l'emplacement du clic
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      particles.style.left = (rect.left + x) + 'px';
      particles.style.top = (rect.top + y) + 'px';
      
      // Créer plusieurs particules
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Couleurs aléatoires adaptées aux enfants
        const colors = ['#FF9671', '#845EC2', '#00D2FC', '#F9F871', '#FF6F91'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Taille aléatoire
        const size = Math.random() * 8 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Direction aléatoire
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        // Animation
        particle.animate(
          [
            { 
              transform: 'translate(0, 0) scale(1)', 
              opacity: 1 
            },
            { 
              transform: `translate(${vx * 20}px, ${vy * 20}px) scale(0)`, 
              opacity: 0 
            }
          ], 
          { 
            duration: Math.random() * 600 + 400,
            easing: 'cubic-bezier(0,.9,.57,1)',
            fill: 'forwards' 
          }
        );
        
        particles.appendChild(particle);
      }
      
      // Supprimer l'élément après l'animation
      setTimeout(() => {
        particles.remove();
      }, 1000);
    });
  }

  // Ajouter le CSS pour les particules
  const particleStyles = document.createElement('style');
  particleStyles.textContent = `
    .button-particles {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
    }
    
    .particle {
      position: absolute;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  `;
  document.head.appendChild(particleStyles);
  
  // Appliquer l'effet aux boutons de jeu
  const playButtons = document.querySelectorAll('.play-button');
  if (featureSupport.webAnimations && playButtons.length > 0) {
    playButtons.forEach(button => {
      addParticleEffect(button);
    });
  }

  // ====== INITIALISATION FINALE ======
  // Afficher un message de bienvenue après un court délai
  setTimeout(() => {
    const isFirstVisit = !localStorage.getItem('kidsgamesVisited');
    
    if (isFirstVisit) {
      showNotification('Bienvenue sur notre site de jeux pour enfants ! Choisis un jeu et amuse-toi bien !', 'info');
      localStorage.setItem('kidsgamesVisited', 'true');
    }
  }, 2000);

  // Consigner l'initialisation réussie
  console.log('Kids Games Blog - JavaScript initialized successfully');
  console.log('Feature support:', featureSupport);
});
