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