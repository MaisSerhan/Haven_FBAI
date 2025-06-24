function publicationLink () {
    const publicationLink = document.querySelector('.i18n-publications');
    console.log(publicationLink)
    if (publicationLink) {
        publicationLink.textContent = 'اختيار الاسم';
        publicationLink.setAttribute('href', '../Pregnant/name.html');
    } else {
        console.warn('لم يتم العثور على رابط المنشورات لتغييره.');
    }
};