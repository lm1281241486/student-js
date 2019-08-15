// 初始化地址的hash值为了触发hashchange事件
location.hash = ''
// 获取新增学生的提交按钮
var addSubmitBtn = document.getElementById('add-submit');

//  获取新增学生的表单元素
var addFormData = document.getElementById('add-student-form');
// 获取左侧导航元素
var menuDL = document.getElementById('menu-list');
// 存储所有学生信息数据
var allStudentData = [];

// 切换导航
function changeMenu(dom) {
    // 初始化导航样式
    initActive();
    // 为当前选中导航添加样式
    dom.classList.add('active');
}
// 获取学生表单数据
function getStudentData(formData) {
    var name = formData.name.value;
    var sex = formData.sex.value;
    var sNo = formData.sNo.value;
    var email = formData.email.value;
    var birth = formData.birth.value;
    var phone = formData.phone.value;
    var address = formData.address.value;
    var student = {
        name: name,
        sex: sex,
        sNo: sNo,
        email: email,
        birth: birth,
        phone: phone,
        address: address,
    }
    return student;
}
// 绑定事件
function bindEvent() {
     // 改变hash值时修改右侧展示内容
     window.onhashchange = function (e) {
        // 获取到右侧内容区展示的内容元素
        var hash = location.hash.slice(1);
        var content = document.getElementsByClassName(hash + '-content')[0];
        // 初始化右侧区域的内容样式
        initActiveContent();
        if(content) {
            content.classList.add('active-content');
        }
      
    }
    // 新增学生信息提交按钮绑定事件
    addSubmitBtn.onclick = function (e) {
        // 阻止默认表单提交事件
        e.preventDefault();
        e.stopPropagation();
        // 获取到学生数据
        var data = getStudentData(addFormData);
        // 数据拼接
        var param = Object.assign({
            appkey: "dongmeiqi_1547441744650"
        }, data);
        // 传给后端存入数据库
        var result = saveData('http://api.duyiedu.com/api/student/addStudent', param);
        // 成功存储 跳转到列表页 重置表单数据
        if (result.status == 'success') {
            alert('添加成功');
            var studentMenu = document.getElementsByClassName('student-list')[0];
            getStudentList();
            studentMenu.click();
            addFormData.reset();
        } else {
            alert(result.msg);
        }
    }
    // 切换导航
    menuDL.onclick = function (e) {
        // 通过事件冒泡查看当前点击的元素是否为dd  若是切换导航 并且改变hash值
        var tag = e.target.tagName.toLowerCase();
        if (tag !== 'dd') {
            return false;
        }
        changeMenu(e.target);
       
        var hash = e.target.getAttribute('data-hash');
        console.log(hash)
        location.hash = hash;
    }
   

}
// 初始化导航样式
function initActive() {
    var active = document.getElementsByClassName('active');
    for (var i = 0; i < active.length; i++) {
        active[i].classList.remove('active');
    }
}
// 初识化内容区样式
function initActiveContent() {
    var active = document.getElementsByClassName('active-content');
    for (var i = 0; i < active.length; i++) {
        active[i].classList.remove('active-content');
    }
}
// 向后端存储数据
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object'){
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}
// 获取学生列表数据
function getStudentList() {
    var result = saveData("http://api.duyiedu.com/api/student/findAll", "appkey=dongmeiqi_1547441744650");
    if (result.status == 'success') {
        allStudentData = result.data;
        renderDom(allStudentData);
      
    } else {
        alert(result.msg);
    }
}
// 编辑按钮  删除按钮绑定事件
function bindBtnEvent () {
    // 编辑按钮
    var editBtn = document.getElementsByClassName('edit');
    // 编辑弹窗
    var modal = document.getElementsByClassName('modal')[0];
    // 编辑内容区
    var modalContent = document.getElementsByClassName('modal-content')[0];
    // 弹窗中的提交按钮
    var submitBtn = document.getElementById('edit-submit');
    // 删除按钮
    var delBtn = document.getElementsByClassName('del');
    // 编辑删除事件
    for (var i = 0; i < editBtn.length; i++) {
        editBtn[i].onclick = function (e) {
            modal.classList.add('active');
            var index = this.getAttribute('data-index');
            renderModalData(allStudentData[index]);
        }
        delBtn[i].onclick = function(e) {
            var isDel = window.confirm('确认删除？');
            var index = this.getAttribute('data-index');
            if (isDel) {
                var result = saveData("http://api.duyiedu.com/api/student/delBySno", {
                    appkey: "dongmeiqi_1547441744650",
                    sNo: allStudentData[index].sNo,
                });
                if (result.status == 'success') {
                    getStudentList();
                    alert('删除成功');
                }
            }
        }
    }
    // 点击弹窗内部不会使弹窗消失
    modalContent.onclick = function (e) {
         e.stopPropagation();
    }
    // 点击遮罩层弹窗消失
    modal.onclick = function (e) {
        modal.classList.remove('active');
    }
    // 编辑按钮点击事件
    submitBtn.onclick = function (e) {
        e.preventDefault();
        var form = document.getElementById('edit-student-form');
        var data = getStudentData(form);
        var param = Object.assign({
            appkey: "dongmeiqi_1547441744650"
        }, data);
         // 传给后端存入数据库
         var result = saveData('http://api.duyiedu.com/api/student/updateStudent', param);
         // 成功存储 跳转到列表页
         if (result.status == 'success') {
             alert('修改成功');
             modal.classList.remove('active');
             getStudentList()

         } else {
             alert(result.msg);
         }
    }
}
// 渲染表格数据
function renderDom(studentData) {
    var str = "";
    for (var i = 0; i < studentData.length; i++) {
        str += ' <tr>\
        <td>' + studentData[i].sNo +'</td>\
        <td>' + studentData[i].name +'</td>\
        <td>'+ (studentData[i].sex ? '女' : '男') +'</td>\
        <td>'+ studentData[i].email +'</td>\
        <td>'+ (new Date().getFullYear() - studentData[i].birth) +'</td>\
        <td>' + studentData[i].phone +'</td>\
        <td>' + studentData[i].address +'</td>\
        <td>\
            <button class="success edit" data-index=' + i +'>编辑</button>\
            <button class="del" data-index=' + i +'>删除</button>\
        </td>\
    </tr>'
    }
    var tbody = document.getElementById('student-list-body');
    tbody.innerHTML = str;
    bindBtnEvent();
}
// 
bindEvent();
var studentMenu = document.getElementsByClassName('student-list')[0];
studentMenu.click();
if (location.hash == '#student-list') {
    getStudentList();
}
// 渲染编辑信息弹窗数据
function renderModalData(studentData) {
    var form = document.getElementById('edit-student-form');
    for (var prop in studentData) {
        form[prop] ? form[prop].value = studentData[prop] : "";
    }
}