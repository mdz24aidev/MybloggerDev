/**
 * Game Post JavaScript - Super Lapin Sauteur
 * Animations et interactions pour l'article de blog présentant le jeu
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  // ===== ANIMATIONS D'APPARITION AU DÉFILEMENT =====
  function animateOnScroll() {
    const sections = document.querySelectorAll('.section-title, .game-features, .game-worlds, .game-mechanics, .progression-system, .multiplayer, .artistic-direction, .daily-challenges, .cta-section, .game-comments, .related-games');
    
    sections.forEach(section => {
      const sectionPosition = section.getBoundingClientRect().top;
      const screenPosition = window.innerHeight * 0.85;
      
      if (sectionPosition < screenPosition) {
        section.classList.add('visible');
      }
    });
  }
  
  // Lancer l'animation au chargement initial
  setTimeout(animateOnScroll, 300);
  
  // Ajouter l'écouteur d'événement pour le défilement
  window.addEventListener('scroll', animateOnScroll);
  
  // ===== INTERACTION AVEC LA BANDE-ANNONCE =====
  const videoPlaceholder = document.querySelector('.video-container');
  if (videoPlaceholder) {
    videoPlaceholder.addEventListener('click', function() {
      // Simulation de l'ouverture d'une vidéo
      // Dans une implémentation réelle, vous pourriez insérer une iframe YouTube ou autre
      showGameNotification("Bande-annonce en cours de chargement...", "info");
      
      setTimeout(() => {
        // Créer une modal pour la vidéo
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
          <div class="video-modal-content">
            <div class="video-modal-close">&times;</div>
            <div class="video-modal-placeholder">
              <img src="https://placehold.in/1280x720/845EC2/FFFFFF?text=Bande-annonce+en+lecture" alt="Bande-annonce Super Lapin Sauteur">
            </div>
            <div class="video-controls">
              <button class="video-control-btn play-btn">
                <svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>
              </button>
              <div class="video-progress">
                <div class="video-progress-bar"></div>
              </div>
              <button class="video-control-btn volume-btn">
                <svg viewBox="0 0 24 24"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/></svg>
              </button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        
        // Animation d'entrée de la modal
        setTimeout(() => {
          modal.classList.add('open');
        }, 10);
        
        // Fermeture de la modal
        const closeBtn = modal.querySelector('.video-modal-close');
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('open');
          setTimeout(() => {
            modal.remove();
          }, 300);
        });
        
        // Simuler l'interaction avec la barre de progression
        const progressBar = modal.querySelector('.video-progress-bar');
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 0.5;
          progressBar.style.width = `${progress}%`;
          
          if (progress >= 100) {
            clearInterval(progressInterval);
          }
        }, 200);
        
        // Simuler le bouton play/pause
        const playBtn = modal.querySelector('.play-btn');
        let isPlaying = true;
        playBtn.addEventListener('click', () => {
          if (isPlaying) {
            playBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M14,19H18V5H14M6,19H10V5H6V19Z"/></svg>`;
            isPlaying = false;
          } else {
            playBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>`;
            isPlaying = true;
          }
        });
      }, 1000);
    });
  }
  
  // ===== ANIMATION DES CARTES DE MONDE =====
  const worldCards = document.querySelectorAll('.world-card');
  worldCards.forEach((card, index) => {
    // Animation au survol
    card.addEventListener('mouseenter', function() {
      // Arrêter l'animation pulse existante
      this.style.animation = 'none';
      
      // Appliquer l'effet de hover
      setTimeout(() => {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        
        // Animation des éléments internes
        const image = this.querySelector('.world-image img');
        if (image) {
          image.style.transform = 'scale(1.12)';
        }
      }, 10);
    });
    
    card.addEventListener('mouseleave', function() {
      // Restaurer l'animation pulse
      this.style.animation = `pulse 4s infinite ease-in-out`;
      this.style.animationDelay = `${0.5 * (index + 1)}s`;
      
      // Restaurer l'état normal
      this.style.transform = '';
      this.style.boxShadow = '';
      
      const image = this.querySelector('.world-image img');
      if (image) {
        image.style.transform = '';
      }
    });
  });
  
  // ===== EFFETS SUR LES CARTES DE MÉCANIQUE =====
  const mechanicCards = document.querySelectorAll('.mechanic-card');
  mechanicCards.forEach(card => {
    const iconElement = card.querySelector('.mechanic-icon');
    
    card.addEventListener('mouseenter', function() {
      // Animation d'entrée
      iconElement.style.transform = 'scale(1.1) rotate(10deg)';
    });
    
    card.addEventListener('mouseleave', function() {
      // Animation de sortie
      iconElement.style.transform = '';
    });
  });
  
  // ===== EFFETS SUR LES BOUTONS =====
  // Ajouter l'effet de particules au bouton de jeu principal
  const playButtons = document.querySelectorAll('.play-button');
  if (typeof addParticleEffect === 'function') {
    playButtons.forEach(button => {
      addParticleEffect(button);
    });
  } else {
    // Si la fonction n'est pas définie, créer notre propre effet
    playButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Créer l'élément conteneur pour les particules
        const particles = document.createElement('div');
        particles.className = 'button-particles';
        document.body.appendChild(particles);
        
        // Positionner le conteneur à l'emplacement du clic
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        particles.style.left = (rect.left + x) + 'px';
        particles.style.top = (rect.top + y) + 'px';
        
        // Créer plusieurs particules
        for (let i = 0; i < 12; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          
          // Couleurs aléatoires adaptées au thème
          const colors = ['#4DB4FF', '#FF6F91', '#F9F871', '#00D2FC', '#845EC2'];
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
          if (typeof Element.prototype.animate === 'function') {
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
          } else {
            // Fallback pour les navigateurs ne supportant pas l'API Web Animation
            particle.style.transform = 'translate(0, 0) scale(1)';
            particle.style.opacity = '1';
            
            setTimeout(() => {
              particle.style.transition = 'all 0.5s ease-out';
              particle.style.transform = `translate(${vx * 20}px, ${vy * 20}px) scale(0)`;
              particle.style.opacity = '0';
            }, 10);
          }
          
          particles.appendChild(particle);
        }
        
        // Supprimer l'élément après l'animation
        setTimeout(() => {
          particles.remove();
        }, 1000);
        
        // Si c'est le bouton "Jouer maintenant", afficher une notification
        if (this.textContent.includes('Jouer')) {
          e.preventDefault();
          if (typeof showGameNotification === 'function') {
            showGameNotification("Tu vas bientôt pouvoir aider Hoppy à sauver les Terres Sautillantes !", "success");
          }
          setTimeout(() => {
            // Simuler la redirection vers le jeu
            const gameInfoMessage = document.createElement('div');
            gameInfoMessage.className = 'game-info-screen';
            gameInfoMessage.innerHTML = `
              <div class="game-info-content">
                <h2>Chargement du jeu...</h2>
                <div class="loading-bar">
                  <div class="loading-progress"></div>
                </div>
                <p>Prépare-toi à sauter avec Hoppy à travers les quatre royaumes saisonniers !</p>
              </div>
            `;
            document.body.appendChild(gameInfoMessage);
            
            const loadingProgress = gameInfoMessage.querySelector('.loading-progress');
            let progress = 0;
            const loadingInterval = setInterval(() => {
              progress += 2;
              loadingProgress.style.width = `${progress}%`;
              
              if (progress >= 100) {
                clearInterval(loadingInterval);
                gameInfoMessage.querySelector('.game-info-content').innerHTML = `
                  <h2>Super Lapin Sauteur</h2>
                  <img src="https://placehold.in/400x300/4DB4FF/FFFFFF?text=Jeu+en+développement" alt="Jeu en développement">
                  <p>Le jeu est actuellement en développement. Reviens bientôt pour aider Hoppy dans sa quête !</p>
                  <button class="close-game-info">Retour à l'article</button>
                `;
                
                const closeButton = gameInfoMessage.querySelector('.close-game-info');
                closeButton.addEventListener('click', () => {
                  gameInfoMessage.classList.add('closing');
                  setTimeout(() => {
                    gameInfoMessage.remove();
                  }, 300);
                });
              }
            }, 50);
            
            // Ajouter le CSS pour l'écran d'information du jeu
            const gameInfoStyles = document.createElement('style');
            gameInfoStyles.textContent = `
              .game-info-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                animation: fadeIn 0.3s ease-in;
              }
              
              .game-info-screen.closing {
                animation: fadeOut 0.3s ease-out;
              }
              
              .game-info-content {
                background-color: white;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                padding: 2rem;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
              }
              
              .game-info-content h2 {
                color: var(--primary-color);
                margin-bottom: 1.5rem;
              }
              
              .game-info-content img {
                max-width: 100%;
                border-radius: 8px;
                margin-bottom: 1.5rem;
              }
              
              .game-info-content p {
                margin-bottom: 1.5rem;
              }
              
              .loading-bar {
                width: 100%;
                height: 20px;
                background-color: #f0f0f0;
                border-radius: 10px;
                margin: 1.5rem 0;
                overflow: hidden;
              }
              
              .loading-progress {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, var(--primary-color), var(--accent2));
                border-radius: 10px;
                transition: width 0.2s ease;
              }
              
              .close-game-info {
                background-color: var(--primary-color);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 50px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.3s ease;
              }
              
              .close-game-info:hover {
                background-color: var(--primary-dark);
              }
              
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
              }
            `;
            document.head.appendChild(gameInfoStyles);
          }, 1500);
        }
      });
    });
  }
  
  // ===== BOUTONS DE PARTAGE =====
  const shareButtons = document.querySelectorAll('.share-button');
  if (shareButtons.length > 0) {
    shareButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Récupérer les informations
        const url = this.getAttribute('data-url') || window.location.href;
        const title = this.getAttribute('data-title') || document.title;
        
        // Vérifier si l'API Web Share est disponible
        if (navigator.share) {
          navigator.share({
            title: title,
            text: 'Découvre ce jeu de plateforme incroyable pour enfants !',
            url: url
          }).catch(console.error);
        } else {
          // Fallback: créer une popup de partage personnalisée
          const shareMenu = document.createElement('div');
          shareMenu.className = 'share-menu';
          shareMenu.innerHTML = `
            <div class="share-menu-content">
              <h3>Partage "Super Lapin Sauteur"</h3>
              <div class="share-options">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="share-option facebook">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                  </svg>
                  Facebook
                </a>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}" target="_blank" class="share-option twitter">
                  <svg viewBox="0 0 24 24">
                    <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/>
                  </svg>
                  Twitter
                </a>
                <a href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Découvre ce super jeu : ' + url)}" class="share-option email">
                  <svg viewBox="0 0 24 24">
                    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                  </svg>
                  E-mail
                </a>
                <button class="share-option copy">
                  <svg viewBox="0 0 24 24">
                    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
                  </svg>
                  Copier le lien
                </button>
              </div>
              <button class="close-share-menu">Fermer</button>
            </div>
          `;
          document.body.appendChild(shareMenu);
          
          // Ajouter le CSS pour le menu de partage
          const shareMenuStyles = document.createElement('style');
          shareMenuStyles.textContent = `
            .share-menu {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.7);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 9999;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            
            .share-menu-content {
              background-color: white;
              border-radius: 12px;
              max-width: 400px;
              width: 90%;
              padding: 1.5rem;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .share-menu h3 {
              text-align: center;
              margin-bottom: 1.5rem;
              color: var(--primary-color);
            }
            
            .share-options {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1rem;
              margin-bottom: 1.5rem;
            }
            
            .share-option {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 10px;
              border-radius: 8px;
              text-decoration: none;
              color: white;
              font-weight: bold;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              cursor: pointer;
            }
            
            .share-option:hover {
              transform: translateY(-3px);
              box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
            }
            
            .share-option svg {
              width: 20px;
              height: 20px;
              fill: white;
            }
            
            .share-option.facebook {
              background-color: #3b5998;
            }
            
            .share-option.twitter {
              background-color: #1da1f2;
            }
            
            .share-option.email {
              background-color: #dd4b39;
            }
            
            .share-option.copy {
              background-color: #333;
              border: none;
              font-size: 1rem;
            }
            
            .close-share-menu {
              display: block;
              width: 100%;
              padding: 10px;
              background-color: var(--primary-color);
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: bold;
              cursor: pointer;
              transition: background-color 0.2s ease;
            }
            
            .close-share-menu:hover {
              background-color: var(--primary-dark);
            }
          `;
          document.head.appendChild(shareMenuStyles);
          
          // Animation d'apparition
          setTimeout(() => {
            shareMenu.style.opacity = '1';
          }, 10);
          
          // Fonction de fermeture du menu
          function closeShareMenu() {
            shareMenu.style.opacity = '0';
            setTimeout(() => {
              shareMenu.remove();
              shareMenuStyles.remove();
            }, 300);
          }
          
          // Fermer le menu
          const closeButton = shareMenu.querySelector('.close-share-menu');
          closeButton.addEventListener('click', closeShareMenu);
          
          // Fermer le menu en cliquant en dehors du contenu
          shareMenu.addEventListener('click', function(e) {
            if (e.target === this) {
              closeShareMenu();
            }
          });
          
          // Gérer le bouton de copie
          const copyButton = shareMenu.querySelector('.share-option.copy');
          copyButton.addEventListener('click', function() {
            // Créer un élément de texte temporaire
            const tempInput = document.createElement('input');
            tempInput.value = url;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Modifier le texte du bouton pour indiquer que le lien a été copié
            this.innerHTML = `
              <svg viewBox="0 0 24 24">
                <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
              </svg>
              Lien copié !
            `;
            this.style.backgroundColor = '#4CAF50';
          });
        }
      });
    });
  }
  
  // ===== EFFETS SUR LES CARTES D'ART =====
  const artCards = document.querySelectorAll('.art-card');
  artCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const image = this.querySelector('.art-image img');
      if (image) {
        image.style.transform = 'scale(1.12)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const image = this.querySelector('.art-image img');
      if (image) {
        image.style.transform = '';
      }
    });
  });
  
  // ===== FONCTION DE NOTIFICATION =====
  // Vérifier si la fonction showGameNotification existe déjà (définie dans le JavaScript principal)
  if (typeof window.showGameNotification !== 'function') {
    window.showGameNotification = function(message, type = 'info') {
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
    };
    
    // Créer le CSS des notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
      .notification {
        position: fixed;
        bottom: 20px;
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
        font-weight: 500;
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
      
  .notification-warn {
        border-left: 4px solid #FF9800;
      }
      
      .notification-error {
        border-left: 4px solid #F44336;
      }
      
      @media (max-width: 480px) {
        .notification {
          width: calc(100% - 40px);
          max-width: none;
          bottom: 10px;
          right: 10px;
          left: 10px;
        }
      }
    `;
    document.head.appendChild(notificationStyles);
  }
  
  // ===== EFFET DE PARTICULES =====
  if (typeof window.addParticleEffect !== 'function') {
    window.addParticleEffect = function(element) {
      const particleStyles = document.createElement('style');
      particleStyles.textContent = `
        .button-particles {
          position: absolute;
          pointer-events: none;
          z-index: 9999;
        }
        
        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--primary-color);
          pointer-events: none;
        }
      `;
      document.head.appendChild(particleStyles);
    };
  }
  
  // ===== ANIMATION DES ÉTOILES DE NOTATION =====
  const stars = document.querySelectorAll('.rating .star');
  if (stars.length > 0) {
    stars.forEach((star, index) => {
      // Animation au survol
      star.addEventListener('mouseenter', function() {
        // Effet de pulsation
        this.style.animation = 'pulse 0.5s infinite alternate';
        
        // Effet de cascade pour les étoiles précédentes
        for (let i = 0; i < index; i++) {
          stars[i].style.animation = `pulse 0.5s infinite alternate ${i * 0.1}s`;
        }
      });
      
      star.addEventListener('mouseleave', function() {
        // Réinitialisation de l'animation
        stars.forEach(s => {
          s.style.animation = '';
        });
      });
    });
  }
  
  // ===== ANIMATION DES TÉMOIGNAGES =====
  // Rotation aléatoire subtile pour les témoignages
  const testimonials = document.querySelectorAll('.testimonial');
  testimonials.forEach(testimonial => {
    const randomRotation = (Math.random() * 2 - 1) * 0.5; // entre -0.5 et 0.5 degrés
    testimonial.style.transform = `rotate(${randomRotation}deg)`;
    
    testimonial.addEventListener('mouseenter', function() {
      this.style.transform = 'rotate(0deg) translateY(-5px)';
    });
    
    testimonial.addEventListener('mouseleave', function() {
      this.style.transform = `rotate(${randomRotation}deg)`;
    });
  });
  
  // ===== DÉTECTION DES PRÉFÉRENCES DE MOUVEMENT RÉDUIT =====
  // Vérifier si l'utilisateur préfère un mouvement réduit et ajuster les animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Supprimer les animations qui pourraient gêner
    const animatedElements = document.querySelectorAll('.world-card, .cta-section .play-button');
    animatedElements.forEach(el => {
      el.style.animation = 'none';
    });
    
    // Ajuster les transitions pour les rendre plus subtiles
    document.documentElement.style.setProperty('--transition-speed', '0.1s');
  }
  
  // ===== DÉTECTION DU THÈME (SOMBRE/CLAIR) =====
  // Détecte la préférence de thème de l'utilisateur
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark-theme');
    
    // Styles spécifiques pour le thème sombre
    const darkThemeStyles = document.createElement('style');
    darkThemeStyles.textContent = `
      :root.dark-theme {
        --text-dark: #e1e1e1;
        --text-medium: #b0b0b0;
        --background-color: #121212;
      }
      
      .dark-theme .game-article {
        background-color: #121212;
        color: #e1e1e1;
      }
      
      .dark-theme .world-card,
      .dark-theme .mechanic-card,
      .dark-theme .art-card,
      .dark-theme .challenge-item,
      .dark-theme .testimonial,
      .dark-theme .related-card {
        background-color: #1e1e1e;
      }
      
      .dark-theme .game-teaser p {
        background-color: rgba(30, 30, 30, 0.8);
      }
      
      .dark-theme .share-button {
        background-color: #2a2a2a;
        color: #e1e1e1;
      }
      
      .dark-theme .coop-container {
        background-color: rgba(77, 180, 255, 0.1);
      }
    `;
    document.head.appendChild(darkThemeStyles);
  }
  
  // ===== EASTER EGG =====
  // Ajoute un Easter Egg qui fait apparaître un lapin qui saute quand on tape "hoppy"
  let keySequence = '';
  document.addEventListener('keydown', function(e) {
    keySequence += e.key.toLowerCase();
    
    // Garde seulement les 5 derniers caractères
    if (keySequence.length > 5) {
      keySequence = keySequence.substr(keySequence.length - 5);
    }
    
    // Vérifie le mot-clé "hoppy"
    if (keySequence === 'hoppy') {
      activateEasterEgg();
    }
  });
  
  function activateEasterEgg() {
    // Créer le lapin
    const rabbit = document.createElement('div');
    rabbit.className = 'easter-egg-rabbit';
    const rabbitImage = document.createElement('img');
    rabbitImage.src = 'https://placehold.in/80x80/845EC2/FFFFFF?text=🐰';
    rabbitImage.alt = 'Hoppy';
    rabbit.appendChild(rabbitImage);
    
    // Ajouter au DOM
    document.body.appendChild(rabbit);
    
    // Styles du lapin
    const rabbitStyles = document.createElement('style');
    rabbitStyles.textContent = `
      .easter-egg-rabbit {
        position: fixed;
        bottom: -80px;
        left: 50px;
        z-index: 9999;
        width: 80px;
        height: 80px;
        animation: rabbitJump 3s forwards;
      }
      
      .easter-egg-rabbit img {
        width: 100%;
        height: auto;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
      }
      
      @keyframes rabbitJump {
        0% { bottom: -80px; transform: rotate(0deg); }
        20% { bottom: 40vh; transform: rotate(10deg); }
        30% { bottom: 30vh; transform: rotate(-5deg); }
        40% { bottom: 50vh; transform: rotate(5deg); }
        50% { bottom: 40vh; transform: rotate(-10deg); }
        60% { bottom: 70vh; transform: rotate(5deg); }
        70% { bottom: 60vh; transform: rotate(-5deg); }
        80% { bottom: 90vh; transform: rotate(10deg); }
        100% { bottom: 110vh; transform: rotate(0deg); }
      }
    `;
    document.head.appendChild(rabbitStyles);
    
    // Supprimer le lapin après l'animation
    setTimeout(() => {
      rabbit.remove();
    }, 3000);
    
    // Afficher un message
    if (typeof window.showGameNotification === 'function') {
      setTimeout(() => {
        showGameNotification("Tu as trouvé Hoppy ! Il sautille vers sa prochaine aventure !", "success");
      }, 1500);
    }
  }
  
  // ===== EFFETS SUR LES IMAGES DES JEUX SIMILAIRES =====
  const relatedCards = document.querySelectorAll('.related-card');
  relatedCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const image = this.querySelector('.related-image img');
      if (image) {
        image.style.transform = 'scale(1.12)';
      }
      this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
      const image = this.querySelector('.related-image img');
      if (image) {
        image.style.transform = '';
      }
      this.style.transform = '';
    });
  });
  
  // ===== INITIALISATION DES VARIABLES CSS =====
  // Définir les variables CSS si elles ne sont pas déjà définies
  if (!document.querySelector(':root').style.getPropertyValue('--primary-color')) {
    document.documentElement.style.setProperty('--primary-color', '#4DB4FF');
    document.documentElement.style.setProperty('--primary-dark', '#0087D3');
    document.documentElement.style.setProperty('--primary-light', '#A0DAFF');
    document.documentElement.style.setProperty('--accent1', '#FF9671');
    document.documentElement.style.setProperty('--accent2', '#FF6F91');
    document.documentElement.style.setProperty('--accent3', '#845EC2');
    document.documentElement.style.setProperty('--accent4', '#00D2FC');
    document.documentElement.style.setProperty('--text-dark', '#333333');
    document.documentElement.style.setProperty('--text-medium', '#666666');
    document.documentElement.style.setProperty('--background-color', '#f9f9f9');
  }
});
