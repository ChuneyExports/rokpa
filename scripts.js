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

    // Profile Modal HTML with enhanced download functionality
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
            <div id="downloadStats" class="mt-4 text-sm text-gray-600"></div>
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

    // Job Seeker Form Handling with enhanced resume storage
    const jobSeekerForm = document.querySelector('#jobSeekerForm');
    if (jobSeekerForm) {
        jobSeekerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(jobSeekerForm);
            const jobSeekerData = Object.fromEntries(formData.entries());
            
            // Handle resume file with better storage
            const resumeFile = document.querySelector('input[type="file"]').files[0];
            if (resumeFile) {
                // Convert file to base64 for reliable storage
                const base64Resume = await convertFileToBase64(resumeFile);
                jobSeekerData.resume = base64Resume;
                jobSeekerData.resumeFileName = resumeFile.name;
            }
            
            // Store in localStorage with additional metadata
            let jobSeekers = JSON.parse(localStorage.getItem('jobSeekers') || '[]');
            jobSeekerData.id = Date.now().toString();
            jobSeekerData.downloadCount = 0;
            jobSeekerData.lastDownload = null;
            jobSeekers.push(jobSeekerData);
            localStorage.setItem('jobSeekers', JSON.stringify(jobSeekers));
            
            alert('Profile submitted successfully!');
            jobSeekerForm.reset();
        });
    }

    // File to Base64 conversion utility
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Enhanced download function with tracking
    window.downloadResume = function(candidateId) {
        const jobSeekers = JSON.parse(localStorage.getItem('jobSeekers') || '[]');
        const candidateIndex = jobSeekers.findIndex(js => js.id === candidateId);
        
        if (candidateIndex === -1) {
            alert('Resume not found');
            return;
        }

        const candidate = jobSeekers[candidateIndex];
        
        // Create and trigger download
        const link = document.createElement('a');
        link.href = candidate.resume;
        link.download = candidate.resumeFileName || 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Update download statistics
        jobSeekers[candidateIndex].downloadCount = (jobSeekers[candidateIndex].downloadCount || 0) + 1;
        jobSeekers[candidateIndex].lastDownload = new Date().toISOString();
        localStorage.setItem('jobSeekers', JSON.stringify(jobSeekers));

        // Update download stats display
        const downloadStats = document.getElementById('downloadStats');
        downloadStats.textContent = `Downloads: ${jobSeekers[candidateIndex].downloadCount}`;
    };

    // Enhanced profile viewing function
    window.viewProfile = function(candidateId) {
        const jobSeekers = JSON.parse(localStorage.getItem('jobSeekers') || '[]');
        const candidate = jobSeekers.find(js => js.id === candidateId);
        
        if (!candidate) {
            alert('Profile not found');
            return;
        }

        const profileModal = document.getElementById('profileModal');
        const profileName = document.getElementById('profileName');
        const profileContent = document.getElementById('profileContent');
        const downloadStats = document.getElementById('downloadStats');

        profileName.textContent = `${candidate.firstName} ${candidate.lastName}`;

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
                        <button onclick="downloadResume('${candidate.id}')" 
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

        // Display download statistics
        downloadStats.textContent = `Downloads: ${candidate.downloadCount || 0}`;
        profileModal.classList.remove('hidden');
    };

    // Other existing functions remain unchanged
    window.closeProfileModal = function() {
        const profileModal = document.getElementById('profileModal');
        profileModal.classList.add('hidden');
    };

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

    // Event listeners
    loginButton.addEventListener('click', () => toggleLogin(true));
    jobSeekerButton.addEventListener('click', () => showPortal(jobSeekerPortal));
    employerButton.addEventListener('click', () => showPortal(employerPortal));

    // Initialize the application
    checkLoginStatus();
});
