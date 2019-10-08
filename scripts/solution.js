const courseNames = {
    fundamentals: 'Java Fundamentals',
    advanced: 'Java Advanced',
    db: 'Java DB',
    web: 'Java Web',
    htmlAndCss: 'HTML & CSS',
};

const availableCourses = [
    { name: courseNames.fundamentals, price: 170 },
    { name: courseNames.advanced, price: 180 },
    { name: courseNames.db, price: 190 },
    { name: courseNames.web, price: 490 }
];

const educationFormNames = {
    onSite: 'On site',
    online: 'Online',
};

const educationForms = [
    { name: educationFormNames.onSite, discount: 0 },
    { name: educationFormNames.online, discount: 0.06 }
];

const getCourseItem = (course) => {
    return $('<label/>')
        .append(
            $('<input/>')
                .attr('type', 'checkbox')
                .val(course.name)
        )
        .append(course.name)
};

const generateFormItem = (form) => {
    return $('<label/>')
        .append(form.name)
        .append(
            $('<input/>')
                .attr('type', 'radio')
                .attr('name', 'education-form')
                .val(form.name)
        )

}

const getMyCourseItem = (course) => {
    return course.name;
};

const generateList = (items, generateItemFunc) =>
    items
        .map(item => generateItemFunc(item))
        .map(itemElement => $('<li/>').append(itemElement));


const generateAvailableCoursesList = () => {
    const items = generateList(availableCourses, getCourseItem);
    items.forEach(item => item.appendTo('#list-courses'));
};

const generateMyCoursesList = (courses) => {
    const items = generateList(courses, getMyCourseItem);
    $('#list-my-courses')
        .html('');
    items.forEach(item => item.appendTo('#list-my-courses'));
};

const generateEducationFormsList = () => {
    const items = generateList(educationForms, generateFormItem);
    items.forEach(item => item.appendTo('#list-forms'));
    $('#list-forms li:first-of-type input')
        .attr('checked', 'checked');
};

const getSelectedCourses = () => {
    const courseNames = Array.from($('#list-courses input:checked'))
        .map(input => $(input).val());
    return courseNames
        .map(courseName => ({...availableCourses.find(course => course.name === courseName)}))
};

const getSelectedForm = () => {
    const educationFormName = $('#list-forms input:checked').val();
    return educationForms.find(form => form.name === educationFormName);
};

const getCourse = (courses, courseName) => {
    courses.find(course => course.name === courseName)
};

const decorateCourses = (courses) => {
    const fundamentalsCourse = getCourse(courses, courseNames.fundamentals);
    const advancedCourse = getCourse(courses, courseNames.advanced);
    const dbCourse = getCourse(courses, courseNames.db);
    const webCourse = getCourse(courses, courseNames.web);
    if (fundamentalsCourse && advancedCourse){
        //discount 10%
        advancedCourse.price *= 0.9;
        if(dbCourse){
            //discount 6%
            fundamentalsCourse.price *= 0.94;
            advancedCourse.price *= 0.94;
            dbCourse.price *= 0.94;
            //bonus course
            if(webCourse){
                courses.push({
                    name: 'courseNames.htmlAndCss',
                    price: 0,
                });
            }
        }
    }
};

const onSignMeUpClick = () => {
    const courses = getSelectedCourses();
    const form = getSelectedForm();
    decorateCourses(courses);
    let totalPrice = courses.reduce((sum, course) => sum + course.price, 0);
    if(form.name === educationFormNames.online){
        //discount 6%
        totalPrice *= 0.94;
    }
    $('#total-price').html(totalPrice.toFixed(2));
    generateMyCoursesList(courses);
};

$(function () {
    generateAvailableCoursesList();
    generateEducationFormsList();

    $('#btn-sign-me-up')
        .on('click', onSignMeUpClick);
});