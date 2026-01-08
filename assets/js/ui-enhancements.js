/**
 * UI Enhancement Script
 * Adds smooth animations, interactions, and responsive behaviors
 */

// Enhanced scroll behavior and animations
class UIEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupRippleEffects();
        this.setupScrollReveal();
        this.setupConnectionStatus();
        this.setupTypingIndicator();
        this.setupEnhancedInteractions();
        this.setupMobileOptimizations();
        this.setupAccessibilityFeatures();
        this.setupSearchEnhancements();
    }

    // Smooth scrolling for chat messages
    setupSmoothScrolling() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            // Enhanced scroll to bottom with smooth animation
            window.scrollToBottom = (smooth = true) => {
                if (smooth) {
                    chatMessages.scrollTo({
                        top: chatMessages.scrollHeight,
                        behavior: 'smooth'
                    });
                } else {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            };

            // Auto-scroll when new messages arrive
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check if user is near bottom before auto-scrolling
                        const isNearBottom = chatMessages.scrollTop + chatMessages.clientHeight >= chatMessages.scrollHeight - 100;
                        if (isNearBottom) {
                            setTimeout(() => scrollToBottom(true), 100);
                        }
                    }
                });
            });

            observer.observe(chatMessages, { childList: true });
        }
    }

    // Add ripple effects to buttons
    setupRippleEffects() {
        const buttons = document.querySelectorAll('.btn, .chat-input button, .chat-list li');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Scroll reveal animations
    setupScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observe messages for scroll reveal
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => {
            message.classList.add('scroll-reveal');
            observer.observe(message);
        });
    }

    // Connection status indicator
    setupConnectionStatus() {
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'connection-status online';
        statusIndicator.textContent = 'Online';
        document.body.appendChild(statusIndicator);

        // Monitor connection status
        const updateConnectionStatus = () => {
            if (navigator.onLine) {
                statusIndicator.className = 'connection-status online';
                statusIndicator.textContent = 'Online';
            } else {
                statusIndicator.className = 'connection-status offline';
                statusIndicator.textContent = 'Offline';
            }
        };

        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);

        // Auto-hide after 3 seconds when online
        let hideTimeout;
        const resetHideTimeout = () => {
            clearTimeout(hideTimeout);
            statusIndicator.style.opacity = '1';
            if (navigator.onLine) {
                hideTimeout = setTimeout(() => {
                    statusIndicator.style.opacity = '0';
                }, 3000);
            }
        };

        resetHideTimeout();
        window.addEventListener('online', resetHideTimeout);
        window.addEventListener('offline', () => {
            clearTimeout(hideTimeout);
            statusIndicator.style.opacity = '1';
        });
    }

    // Enhanced typing indicator
    setupTypingIndicator() {
        let typingTimeout;
        const chatInput = document.getElementById('chatInput');
        
        if (chatInput) {
            chatInput.addEventListener('input', () => {
                // Show typing indicator logic here
                clearTimeout(typingTimeout);
                
                // Hide typing indicator after 2 seconds of no typing
                typingTimeout = setTimeout(() => {
                    // Hide typing indicator logic here
                }, 2000);
            });
        }
    }

    // Enhanced interactions
    setupEnhancedInteractions() {
        // Enhanced form focus states
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });

        // Enhanced button interactions
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mousedown', () => {
                button.classList.add('btn-pressed');
            });
            
            button.addEventListener('mouseup', () => {
                button.classList.remove('btn-pressed');
            });
            
            button.addEventListener('mouseleave', () => {
                button.classList.remove('btn-pressed');
            });
        });

        // Enhanced chat list interactions
        const chatItems = document.querySelectorAll('.chat-list li');
        chatItems.forEach((item, index) => {
            item.style.setProperty('--i', index);
            
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(8px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    item.style.transform = '';
                }
            });
        });
    }

    // Mobile-specific optimizations
    setupMobileOptimizations() {
        if (window.innerWidth <= 768) {
            // Enhanced touch interactions
            let touchStartY = 0;
            let touchEndY = 0;
            
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.addEventListener('touchstart', (e) => {
                    touchStartY = e.changedTouches[0].screenY;
                }, { passive: true });
                
                chatMessages.addEventListener('touchend', (e) => {
                    touchEndY = e.changedTouches[0].screenY;
                    handleSwipe();
                }, { passive: true });
                
                const handleSwipe = () => {
                    const swipeDistance = touchStartY - touchEndY;
                    
                    // Pull to refresh (swipe down at top)
                    if (swipeDistance < -100 && chatMessages.scrollTop === 0) {
                        // Trigger refresh animation
                        this.showRefreshIndicator();
                    }
                };
            }

            // Prevent zoom on input focus (iOS)
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                const inputs = document.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.addEventListener('focus', () => {
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
                    });
                    
                    input.addEventListener('blur', () => {
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
                    });
                });
            }
        }
    }

    // Accessibility features
    setupAccessibilityFeatures() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay.visible');
                if (modal && window.closeModal) {
                    window.closeModal();
                }
            }
            
            // Arrow keys for chat navigation
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                const chatItems = document.querySelectorAll('.chat-list li');
                const activeItem = document.querySelector('.chat-list li.active');
                
                if (chatItems.length > 0 && activeItem) {
                    const currentIndex = Array.from(chatItems).indexOf(activeItem);
                    let newIndex;
                    
                    if (e.key === 'ArrowUp') {
                        newIndex = currentIndex > 0 ? currentIndex - 1 : chatItems.length - 1;
                    } else {
                        newIndex = currentIndex < chatItems.length - 1 ? currentIndex + 1 : 0;
                    }
                    
                    chatItems[newIndex].click();
                    e.preventDefault();
                }
            }
        });

        // Focus management for modals
        const modals = document.querySelectorAll('.modal-container');
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                lastElement.focus();
                                e.preventDefault();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                firstElement.focus();
                                e.preventDefault();
                            }
                        }
                    }
                });
            }
        });
    }

    // Enhanced search functionality integration
    setupSearchEnhancements() {
        const searchInput = document.getElementById('searchUser');
        const searchSuggestions = document.getElementById('searchSuggestions');
        
        if (searchInput && searchSuggestions) {
            // Add search state management
            let searchState = 'idle'; // idle, searching, results, no-results
            
            // Enhanced search input animations
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('search-focused');
            });
            
            searchInput.addEventListener('blur', () => {
                // Delay to allow suggestion clicks
                setTimeout(() => {
                    searchInput.parentElement.classList.remove('search-focused');
                }, 200);
            });
            
            // Search state indicator
            const updateSearchState = (state) => {
                searchState = state;
                searchInput.classList.remove('searching', 'has-results', 'no-results');
                
                switch(state) {
                    case 'searching':
                        searchInput.classList.add('searching');
                        break;
                    case 'results':
                        searchInput.classList.add('has-results');
                        break;
                    case 'no-results':
                        searchInput.classList.add('no-results');
                        break;
                }
            };
            
            // Expose state updater globally for chat.js to use
            window.updateSearchState = updateSearchState;
            
            // Enhanced suggestion interactions
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.target === searchSuggestions) {
                        const suggestions = searchSuggestions.querySelectorAll('.search-suggestion-item');
                        
                        suggestions.forEach((suggestion, index) => {
                            // Add staggered animation delay
                            suggestion.style.animationDelay = `${index * 50}ms`;
                            
                            // Enhanced hover effects
                            suggestion.addEventListener('mouseenter', () => {
                                suggestion.style.transform = 'translateX(6px) scale(1.02)';
                            });
                            
                            suggestion.addEventListener('mouseleave', () => {
                                suggestion.style.transform = '';
                            });
                        });
                        
                        // Update search state
                        if (suggestions.length > 0) {
                            updateSearchState('results');
                        }
                    }
                });
            });
            
            observer.observe(searchSuggestions, { childList: true });
        }
    }

    // Show refresh indicator
    showRefreshIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'refresh-indicator';
        indicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
        
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.insertBefore(indicator, chatMessages.firstChild);
            
            setTimeout(() => {
                indicator.remove();
                // Trigger actual refresh logic here
                if (window.loadMessages && window.currentChatUser) {
                    window.loadMessages(window.currentChatUser, true, true);
                }
            }, 1500);
        }
    }

    // Notification system
    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // Enhanced notification for search actions
    static showSearchNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `search-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
    }

    // Enhanced loading states
    static showLoadingSkeleton(container, count = 3) {
        const skeletons = [];
        
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'loading-skeleton';
            skeleton.style.height = '60px';
            skeleton.style.marginBottom = '10px';
            skeleton.style.borderRadius = '12px';
            
            container.appendChild(skeleton);
            skeletons.push(skeleton);
        }
        
        return () => {
            skeletons.forEach(skeleton => skeleton.remove());
        };
    }
}

// CSS for additional animations
const additionalStyles = `
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.refresh-indicator {
    text-align: center;
    padding: 1rem;
    color: var(--subtle-text-color);
    font-size: 0.9rem;
    animation: fadeInUp 0.3s ease;
}

@keyframes notificationSlideOut {
    to {
        opacity: 0;
        transform: translateX(100%) scale(0.9);
    }
}

.focused {
    transform: scale(1.02);
    transition: transform 0.2s ease;
}

.search-focused {
    transform: scale(1.02);
    transition: transform 0.2s ease;
}

.search-notification {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0 0 8px 8px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 1001;
    animation: slideDown 0.3s ease;
}

.search-notification.info {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: translateY(-10px);
    }
}

.search-container.search-focused .search-suggestions {
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

#searchUser.has-results {
    border-color: var(--secondary-color);
}

#searchUser.no-results {
    border-color: var(--subtle-text-color);
}

@media (prefers-reduced-motion: reduce) {
    .ripple-effect {
        animation: none;
    }
    
    .scroll-reveal {
        opacity: 1;
        transform: none;
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize UI enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UIEnhancements();
});

// Export for use in other scripts
window.UIEnhancements = UIEnhancements;