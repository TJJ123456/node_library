$(document).ready(function () {
    $('.nav li').click(function () {
        if ($(this).hasClass('active')) return;
        $('.active').removeClass('active');
        $(this).addClass('active');
    })
    //拉取数据
    $.ajax({
        url: '/catalog',
        type: 'get',
        success: function (data) {
            console.log(data);
            const html = template('main', { data: data });
            $('#content').html(html);
        }
    })

})
//登出
function managerSignout() {
    event.preventDefault();
    $.ajax({
        url: '/manager_signout',
        type: 'get',
        success: function (data) {
            if (data.status === 1 || data.status === 501) {
                window.location.href = '/manager';
            }
        }
    })
}

function getBookList() {
    event.preventDefault();
    $.ajax({
        url: '/catalog/books',
        type: 'get',
        success: function (data) {
            console.log(data);
            const html = template('book_list', { data: data.result });
            $('#content').html(html);
        }
    })
}

function getBookInstanceList() {
    event.preventDefault();
    $.ajax({
        url: '/catalog/bookinstances',
        type: 'get',
        success: function (data) {
            console.log(data);
            // const html = template('bookinstance_list', { data: data.result });
            $('#content').html(data);
        }
    })
}

function getAuthorList() {
    event.preventDefault();
    $.ajax({
        url: '/catalog/authors',
        type: 'get',
        success: function (data) {
            $('#content').html(data);
        }
    })
}

function getGenreList() {
    event.preventDefault();
    $.ajax({
        url: '/catalog/genres',
        type: 'get',
        success: function (data) {
            $('#content').html(data);
        }
    })
}

function getMain() {
    event.preventDefault();
    window.location.href = '/manager';
}