// Main JavaScript file for Job Portal

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const jobSeekerButton = document.querySelector('#jobSeekerPortalBtn');
    const employerButton = document.querySelector('#employerPortalBtn');
    const landingPage = document.querySelector('#landingPage');
    const jobSeekerPortal = document.querySelector('#jobSeekerPortal');
    const employerPortal = document.querySelector('#employerPortal');
    const backButtons = document.querySelectorAll('.back-to-landing');
    const aboutPage = document.querySelector('#aboutPage');
    const contactPage = document.querySelector('#contactPage');
    const logo = document.querySelector('.logo');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navMenu = document.getElementById('nav-menu');
    const loginButton = document.querySelector('.nav-container .btn-primary');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');

    // Profile Modal HTML
    const profileModalHTML = `
    <div id="profileModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-2xl font-bold" id="profileName"></h2>
                <button onclick="closeProfileModal()" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div id="profileContent" class="space-y-4">
                <!-- Profile content will be inserted here -->
            </div>
        </div>
    </div>`;

    // Insert profile modal HTML into document
    document.body.insertAdjacentHTML('beforeend', profileModalHTML);

    // Hide all pages except landing
    function hideAllPages() {
        landingPage.style.display = 'none';
        jobSeekerPortal.style.display = 'none';
        employerPortal.style.display = 'none';
        aboutPage.style.display = 'none';
        contactPage.style.display = 'none';
    }

    // Show specific page
    function showPage(page) {
        hideAllPages();
        page.style.display = 'block';
        page.classList.add('fade-in');
    }

    // Logo click handler
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(landingPage);
    });

    // Navigation handlers
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.textContent.toLowerCase();
            
            switch(target) {
                case 'about':
                    showPage(aboutPage);
                    break;
                case 'contact':
                    showPage(contactPage);
                    break;
                default:
                    showPage(landingPage);
            }
        });
    });

    // Mobile menu handling
    mobileMenuButton.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            navMenu.classList.remove('show');
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('show');
        }
    });

    // Portal navigation
    function showPortal(portalElement) {
        showPage(portalElement);
        portalElement.classList.add('fade-in');
    }

    // Portal button handlers
    jobSeekerButton.addEventListener('click', () => showPortal(jobSeekerPortal));
    employerButton.addEventListener('click', () => showPortal(employerPortal));

    // Back button functionality
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            showPage(landingPage);
        });
    });

    // Job Seeker Form Handling
    const jobSeekerForm = document.querySelector('#jobSeekerForm');
    if (jobSeekerForm) {
        jobSeekerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(jobSeekerForm);
            const jobSeekerData = Object.fromEntries(formData.entries());
            
            // Handle resume file
            const resumeFile = document.querySelector('input[type="file"]').files[0];
            if (resumeFile) {
                jobSeekerData.resume = URL.createObjectURL(resumeFile);
            }
            
            // Store in localStorage
            let jobSeekers = JSON.parse(localStorage.getItem('jobSeekers') || '[]');
            jobSeekerData.id = Date.now().toString(); // Add unique ID
            jobSeekers.push(jobSeekerData);
            localStorage.setItem('jobSeekers', JSON.stringify(jobSeekers));
            
            alert('Profile submitted successfully!');
            jobSeekerForm.reset();
        });
    }

    // Employer Portal Filtering
    const filterForm = document.querySelector('#filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const experience = document.querySelector('#experienceFilter').value;
            const education = document.querySelector('#educationFilter').value;
            const gender = document.querySelector('#genderFilter').value;
            
            let jobSeekers = JSON.parse(localStorage.getItem('jobSeekers') || '[]');
            
            const filteredCandidates = jobSeekers.filter(candidate => {
                const meetsExperience = !experience || candidate.experience >= parseInt(experience);
                const meetsEducation = !education || candidate.education === education;
                const meetsGender = !gender || candidate.gender === gender;
                
                return meetsExperience && meetsEducation && meetsGender;
            });
            
            displayCandidates(filteredCandidates);
        });
    }

    // Display candidates function
    function displayCandidates(candidates) {
        const candidatesContainer = document.querySelector('#candidatesContainer');
        candidatesContainer.innerHTML = '';
        
        candidates.forEach(candidate => {
            const candidateCard = document.createElement('div');
            candidateCard.className = 'candidate-card fade-in p-4 border rounded-lg mb-4 bg-white shadow-sm';
            candidateCard.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg font-medium">${candidate.firstName} ${candidate.lastName}</h3>
                        <p class="text-gray-600">${candidate.education}</p>
                        <p class="text-gray-600">${candidate.experience} years experience</p>
                    </div>
                    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" 
                            onclick="viewProfile('${candidate.id}')">
                        View Profile
                    </button>
                </div>
            `;
            candidatesContainer.appendChild(candidateCard);
        });
    }

    // Login functionality
    loginButton.addEventListener('click', () => toggleLogin(true));

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (email === "employer@rokpa.com" && password === "employer123") {
            localStorage.setItem('userType', 'employer');
            localStorage.setItem('isLoggedIn', 'true');
            alert('Logged in successfully as employer');
            toggleLogin(false);
            checkLoginStatus();
        } else if (email === "jobseeker@rokpa.com" && password === "jobseeker123") {
            localStorage.setItem('userType', 'jobseeker');
            localStorage.setItem('isLoggedIn', 'true');
            alert('Logged in successfully as job seeker');
            toggleLogin(false);
            checkLoginStatus();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });

    // Check initial login status
    checkLoginStatus();
});

// Profile viewing functions
function viewProfile(candidateId) {
    const jobSeekers = JSON.parse(localStorage.getItem('jobSeekers') || '[]');
    const candidate = jobSeekers.find(js => js.id === candidateId);
    
    if (!candidate) {
        alert('Profile not found');
        return;
    }

    const profileModal = document.getElementById('profileModal');
    const profileName = document.getElementById('profileName');
    const profileContent = document.getElementById('profileContent');

    // Set candidate name
    profileName.textContent = `${candidate.firstName} ${candidate.lastName}`;

    // Build profile content
    profileContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
                <div>
                    <h3 class="font-medium text-gray-700">Contact Information</h3>
                    <p class="text-gray-600">Email: ${candidate.email}</p>
                    <p class="text-gray-600">Phone: ${candidate.phone}</p>
                </div>
                
                <div>
                    <h3 class="font-medium text-gray-700">Personal Details</h3>
                    <p class="text-gray-600">Gender: ${candidate.gender}</p>
                </div>
            </div>

            <div class="space-y-3">
                <div>
                    <h3 class="font-medium text-gray-700">Professional Information</h3>
                    <p class="text-gray-600">Education: ${candidate.education}</p>
                    <p class="text-gray-600">Experience: ${candidate.experience} years</p>
                    <p class="text-gray-600">Skills: ${candidate.skills || 'Not specified'}</p>
                </div>
                
                ${candidate.resume ? `
                <div>
                    <h3 class="font-medium text-gray-700">Resume</h3>
                    <button onclick="downloadResume('${candidate.resume}')" 
                            class="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        Download Resume
                    </button>
                </div>
                ` : ''}
            </div>
        </div>

        ${candidate.about ? `
        <div class="mt-4">
            <h3 class="font-medium text-gray-700">About</h3>
            <p class="text-gray-600">${candidate.about}</p>
        </div>
        ` : ''}
    `;

    profileModal.classList.remove('hidden');
}

function closeProfileModal() {
    const profileModal = document.getElementById('profileModal');
    profileModal.classList.add('hidden');
}

function downloadResume(resumeUrl) {
    window.open(resumeUrl, '_blank');
}

// Login related functions
function toggleLogin(show) {
    const loginModal = document.getElementById('loginModal');
    loginModal.classList.toggle('hidden', !show);
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');
    const loginButton = document.querySelector('.nav-container .btn-primary');

    if (isLoggedIn) {
        loginButton.textContent = 'Logout';
        loginButton.addEventListener('click', logout);
    } else {
        loginButton.textContent = 'Login';
        loginButton.addEventListener('click', () => toggleLogin(true));
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    checkLoginStatus();
    window.location.reload();
}

// Close modals with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeProfileModal();
        const loginModal = document.getElementById('loginModal');
        loginModal.classList.add('hidden');
    }
});

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const profileModal = document.getElementById('profileModal');
    const loginModal = document.getElementById('loginModal');
    
    if (event.target === profileModal) {
        closeProfileModal();
    }
    if (event.target === loginModal) {
        loginModal.classList.add('hidden');
    }
});
