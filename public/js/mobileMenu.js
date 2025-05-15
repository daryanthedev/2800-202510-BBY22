// Made with AI :sunglasses:

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle menu visibility
      mobileMenu.classList.toggle('hidden');
      
      // Update button aria attribute
      this.setAttribute('aria-expanded', !isExpanded);
      
      // Change button icon
      this.textContent = isExpanded ? '☰' : '✕';
      
      // Optional: Prevent body scroll when menu is open
      document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    });
    
    // Close menu when clicking on a link (optional)
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.textContent = '☰';
        document.body.style.overflow = 'auto';
      });
    });
    
    // Close menu when clicking outside (optional)
    document.addEventListener('click', function(event) {
      if (!mobileMenu.contains(event.target) && 
          event.target !== mobileMenuButton && 
          !mobileMenuButton.contains(event.target)) {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.textContent = '☰';
        document.body.style.overflow = 'auto';
      }
    });
  });