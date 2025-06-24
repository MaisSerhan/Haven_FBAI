// دالة لتحميل محتوى HTML من ملف خارجي إلى حاوية معينة
function loadHTML(url, containerId, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
            if (callback) callback(); // تنفيذ دالة الـ callback بعد تحميل HTML
        })
        .catch(error => console.error(`Error loading the HTML file for ${containerId}:`, error));
}

// دالة لتحديث شريط التنقل بناءً على حالة تسجيل الدخول ودور المستخدم/المستوى
function updateNavbar() {
    const authLinksContainer = document.getElementById('auth-links-container');
    const stagesDropdownMenu = document.getElementById('stages-dropdown-menu'); 
    
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('user_name'); 
    const userLevelRaw = localStorage.getItem('user_level'); 
    const userLevel = userLevelRaw ? userLevelRaw.trim() : userLevelRaw; 
    const userProfileImage = localStorage.getItem('user_profile_image'); 

    // --- رسائل تصحيح الأخطاء (Debugging) ---
    console.log('--- updateNavbar Debug Info ---');
    console.log('Token:', token ? 'Exists' : 'Does NOT exist');
    console.log('User Role from localStorage:', userRole);
    console.log('User Name from localStorage:', userName); 
    console.log('User Profile Image from localStorage:', userProfileImage); 
    console.log('User Level (Raw from localStorage):', userLevelRaw); 
    console.log('User Level (After Trim):', userLevel); 
    if (userLevel) {
        console.log('User Level Length (After Trim):', userLevel.length);
        console.log('User Level First Char Code:', userLevel.charCodeAt(0));
        console.log('User Level Last Char Code:', userLevel.charCodeAt(userLevel.length - 1));
    }
    // --- نهاية رسائل تصحيح الأخطاء ---

    // ----------------------------------------------------
    //  منطق تحديث قسم "حالة تسجيل الدخول" (انضم إلينا / مرحباً [اسم] / تسجيل خروج)
    // ----------------------------------------------------
    if (token) {
        let displayGreetingOnlyName = ''; 

        if (userRole === 'doctor') {
            displayGreetingOnlyName = `مرحباً أيها الطبيب ${userName || ''}\u200F`; 
        } else if (userRole === 'admin') {
            displayGreetingOnlyName = `مرحباً أيها المسؤول ${userName || ''}\u200F`;
        } else if (userRole === 'father' && userName) {
            displayGreetingOnlyName = `مرحباً بالأب ${userName}\u200F`; 
        } else if (userRole === 'mother' && userName) {
            displayGreetingOnlyName = `مرحباً بالأم ${userName}\u200F`; 
        } else if (userName) { 
            displayGreetingOnlyName = `مرحباً ${userName}\u200F`;
        } else if (userRole) { 
            displayGreetingOnlyName = `مرحباً ${userRole}\u200F`;
        } else { 
            displayGreetingOnlyName = 'مرحباً بك';
        }

        // تحديد مسار الصورة للعرض
        const profileImageSrc = userProfileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

        authLinksContainer.innerHTML = `
            <div class="dropdown d-flex align-items-center flex-row-reverse">
                <!-- العنصر الذي سيظهر دائماً (الترحيب والصورة) -->
                <a class="nav-link d-flex align-items-center" href="#" role="button" id="profileDropdown" 
                   data-bs-toggle="dropdown" aria-expanded="false">
                    <span class="text-danger fs-5 me-2" dir="rtl">${displayGreetingOnlyName}!</span>
                    <img src="${profileImageSrc}" alt="صورة الملف الشخصي" 
                         class="profile-image rounded-circle border border-danger"  
                         style="width: 40px; height: 40px; object-fit: cover; cursor: pointer;">
                </a>

                <!-- القائمة المنسدلة التي ستظهر عند النقر على الصورة/الترحيب -->
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    ${userLevel ? `<li><span class="dropdown-item text-muted" dir="rtl">\u200Fالمرحلة: ${userLevel}\u200F</span></li>` : ''}
                    <li><button type="button" class="dropdown-item text-danger" id="logoutBtn">تسجيل الخروج</button></li>
                </ul>
            </div>
        `;

        // إعادة ربط حدث النقر لزر تسجيل الخروج بعد تحديث innerHTML
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.clear(); 
                window.location.href = '../../index.html'; 
            });
        }

    } else {
        // المستخدم غير مسجل الدخول، عرض خيارات الانضمام/تسجيل الدخول/الاشتراك
        authLinksContainer.innerHTML = `
            <li class="nav-item auth-dropdown">
                <a class="" href="#" id="join-us-btn-dynamic">
                    <button type="button" class="btn btn-outline-danger fs-5 i18n-join">انضم إلينا</button>
                </a>
                <div class="auth-dropdown-content">
                    <a href="../../Pages/Login_Signup/login.html" id="nav-login">تسجيل الدخول</a>
                    <a href="../../Pages/Login_Signup/signup.html" id="nav-signup">انشاء حساب</a>
                </div>
            </li>
        `;
    }

    // ----------------------------------------------------
    //  منطق تحديث قسم "المراحل" بناءً على حالة تسجيل الدخول والمستوى
    // ----------------------------------------------------
    if (stagesDropdownMenu) { 
        console.log('Stages Dropdown Menu element found.'); 
        if (token && userLevel) { 
            console.log('User is logged in and has a level. userLevel (cleaned):', userLevel); 
            let stageHtml = '';
            
            const stagesMap = {
                'حمل': '../../Pages/Pregnant/Pregnant.html', 
                'ولادة': '../../Pages/Birth/Birth.html',      
                'السنة الأولى من طفلك': '../../Pages/Year1/oneYear.html', 
                'السنة الثانية من طفلك': '../../Pages/Year2-3/year2.html', 
            };

            const pagePath = stagesMap[userLevel]; 
            console.log('Attempting to find pagePath for userLevel (cleaned):', userLevel, 'Result:', pagePath); 
            
            if (pagePath) {
                stageHtml = `<li><a class="dropdown-item" href="${pagePath}">${userLevel}</a></li>`;
            } else {
                stageHtml = `<li><span class="dropdown-item text-muted">لا توجد مراحل محددة لهذا الدور أو المستوى</span></li>`; 
            }
            
            stagesDropdownMenu.innerHTML = stageHtml;
            console.log('Stages Dropdown Menu updated for logged in user.'); 

        } else {
            console.log('User is NOT logged in or has no valid "user_level". Displaying all stages.'); 
            stagesDropdownMenu.innerHTML = `
                <li><a class="dropdown-item i18n-pregnancy" href="../../Pages/Pregnant/Pregnant.html">مرحلة الحمل</a></li>
                <li><a class="dropdown-item i18n-birth" href="../../Pages/Birth/Birth.html">مرحلة الولادة</a></li>
                <li><a class="dropdown-item i18n-year1" href="../../Pages/Year1/oneYear.html">مرحلة السنة الاولى من الطفل</a></li>
                <li><a class="dropdown-item i18n-year2-3" href="../../Pages/Year2-3/year2.html">مرحلة السنة الثانية والثالثة من الطفل</a></li>
            `;
        }
    } else {
        console.warn('Stages Dropdown Menu element with ID "stages-dropdown-menu" not found. Make sure navbar.html is loaded and the ID is correct.'); 
    }
}

// معالجة تحميل الصفحة واستمرار اللغة
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded. Starting navbar load...'); 
    loadHTML('../../Assets/Html/navbar.html', 'navbar-container', () => {
        console.log('Navbar HTML loaded. Updating navbar...'); 
        updateNavbar(); 
        publicationLink ()
    });

    loadHTML('../../Assets/Html/footer.html', 'footer-container', () => {
        // يمكن أن يكون لديك تحديث مماثل للفوتر إذا كان ديناميكياً
    });
});
