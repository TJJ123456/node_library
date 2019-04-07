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
            // console.log(data);
            // const html = template('book_list', { data: data.result });
            $('#content').html(data);
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

//创建种类页面
function createGenre() {
    event.preventDefault();
    $.ajax({
        url: '/catalog/genre/create',
        type: 'get',
        success: function (data) {
            $('#content').html(data);
        }
    })
}

//创建种类请求
function createGenrePost() {
    event.preventDefault();
    $.ajax({
        url: '/catalog/genre/create',
        type: 'post',
        data: {
            genrename: $('#genrename').val()
        },
        success: function (data) {
            // $('#content').html(data);
            console.log(data);
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//更新种类页面
function updateGenreGet(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/genre/${id}/update`,
        type: 'get',
        data: {
            genrename: $('#genrename').val()
        },
        success: function (data) {
            // $('#content').html(data);
            console.log(data);
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//更新种类请求
function updateGenrePost(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/genre/${id}/update`,
        type: 'post',
        data: {
            genrename: $('#genrename').val()
        },
        success: function (data) {
            // $('#content').html(data);
            console.log(data);
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//种类详情页面
function detailGenreGet(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/genre/${id}`,
        type: 'get',
        success: function (data) {
            // $('#content').html(data);
            console.log(data);
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//删除种类页面
function deleteGenreGet(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/genre/${id}/delete`,
        type: 'get',
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//删除种类请求
function deleteGenrePost(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/genre/${id}/delete`,
        type: 'post',
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}


//创建作者页面请求
function createAuthorGet() {
    event.preventDefault();
    $.ajax({
        url: `/catalog/author/create`,
        type: 'get',
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//作者详情页面请求
function detailAuthorGet(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/author/${id}`,
        type: 'get',
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//删除作者页面请求
function deleteAuthorGet(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/author/${id}/delete`,
        type: 'get',
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//删除作者页面请求
function deleteAuthorPost(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/author/${id}/delete`,
        type: 'post',
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//创建作者请求
function createAuthorPost(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/author/create`,
        type: 'post',
        data: {
            first_name: $('#firstname').val(),
            family_name: $('#familyname').val(),
            date_of_birth: $('#birthday').val(),
            date_of_death: $('#deathday').val(),
        },
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//更新作者请求页面
function updateAuthorGet(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/author/${id}/update`,
        type: 'get',
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//更新作者作者请求
function updateAuthorPost(id) {
    event.preventDefault();
    $.ajax({
        url: `/catalog/author/${id}/update`,
        type: 'post',
        data: {
            first_name: $('#firstname').val(),
            family_name: $('#familyname').val(),
            date_of_birth: $('#birthday').val(),
            date_of_death: $('#deathday').val(),
        },
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//创建书本页面
function createBookGet() {
    event.preventDefault();
    $.ajax({
        url: `/catalog/book/create`,
        type: 'get',
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}

//创建书本请求
function createBookPost() {
    event.preventDefault();
    let data = $('#genre_form').serializeArray();
    console.log(data);
    $.ajax({
        url: `/catalog/book/create`,
        type: 'post',
        data: data,
        success: function (data) {
            if (data.error) {
                $('#error p').html(data.msg);
            } else {
                $('#content').html(data);
            }
        }
    })
}