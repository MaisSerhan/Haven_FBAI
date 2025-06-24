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
    const userLevelRaw = localStorage.getItem('user_level'); // الحصول على المستوى الخام من localStorage
    const userLevel = userLevelRaw ? userLevelRaw.trim() : userLevelRaw; // استخدام .trim() لإزالة المسافات البيضاء

    // --- رسائل تصحيح الأخطاء (Debugging) ---
    console.log('--- updateNavbar Debug Info ---');
    console.log('Token:', token ? 'Exists' : 'Does NOT exist');
    console.log('User Role from localStorage:', userRole);
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
        let displayLevelAndRole = ''; 

        // تحديد ما سيتم عرضه بناءً على الدور والمستوى
        if (userRole === 'doctor') {
            displayLevelAndRole = 'مرحباً أيها الطبيب!'; // يمكن تخصيصها باسم الطبيب
        } else if (userRole === 'admin') {
            displayLevelAndRole = 'مرحباً أيها المسؤول!';
        } else if (userRole === 'father' && userLevel) {
            displayLevelAndRole = `مرحباً بك أب! (المرحلة: ${userLevel})`;
        } else if (userRole === 'mother' && userLevel) {
            displayLevelAndRole = `مرحباً بك أم! (المرحلة: ${userLevel})`;
        } else if (userRole && userLevel) { // لأدوار أخرى لديها مستوى
            displayLevelAndRole = `مرحباً ${userRole}! (المرحلة: ${userLevel})`;
        } else if (userRole) { // لأدوار أخرى بدون مستوى محدد
            displayLevelAndRole = `مرحباً ${userRole}!`;
        } else { // حالة عامة إذا لم يتوفر دور
            displayLevelAndRole = 'مرحباً بك!';
        }


        authLinksContainer.innerHTML = `
            <span class="nav-link text-danger fs-5 me-2">${displayLevelAndRole}</span>
            <button type="button" class="btn btn-outline-danger fs-5" id="logoutBtn">تسجيل الخروج</button>
        `;

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.clear(); // مسح جميع بيانات المستخدم من localStorage
                window.location.href = '../../index.html'; // إعادة التوجيه إلى الصفحة الرئيسية
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

document.addEventListener('DOMContentLoaded', function() {
  
    loadHTML('../../Assets/Html/navbar.html', 'navbar-container', () => {
      publicationLink ();
    });
  //updatePost(savedLang, langName);
});

function publicationLink () {
    const publicationLink = document.querySelector('.i18n-publications');
    console.log(publicationLink)
    if (publicationLink) {
        publicationLink.textContent = 'المتجر';
        publicationLink.setAttribute('href', './store.html');
    } else {
        console.warn('لم يتم العثور على رابط المنشورات لتغييره.');
    }
};
