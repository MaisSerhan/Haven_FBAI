function publicationLink () {
    const publicationLink = document.querySelector('.i18n-publications');
    console.log(publicationLink)
    if (publicationLink) {
        publicationLink.textContent = 'الحاسبة';
        publicationLink.setAttribute('href', './clcPreg.html');
    } else {
        console.warn('لم يتم العثور على رابط المنشورات لتغييره.');
    }

    const pregnancyMonth = localStorage.getItem('pregnancy_month');
    console.log(pregnancyMonth)
    if(pregnancyMonth){
        const items = document.querySelectorAll('.stages-buttons a');
        // Hide all items first
        items.forEach((item, index) => {
            item.style.display = 'none';
            // Show only the item matching pregnancyMonth
            if (index === pregnancyMonth - 1) {
                item.style.display = 'inline-block'; // or 'block' based on layout
            }
        });
    }

}; 