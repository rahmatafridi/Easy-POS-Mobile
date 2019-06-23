
var IsEditMode = false;
$(document).ready(function () {
    $('#tblCategory').DataTable();
    CodeGenerate();
    handleStaff();
    LoadGridData();
    Reset();

});

//GenerateCode
var CodeGenerate = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Category/CodeGenerate",
        processData: false,
        contentType: false,
        success: function (data) {
            $('#Code').removeAttr('disabled');
            $('#Code').val(data);
            $('#Code').attr('disabled', true);
        }
    });
}




//edit method
$(document).on('click', '.btn-edit', function () {
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("Id", uid);

    $.ajax({
        type: "POST",
        cache: false,
        url: "../Category/Edit",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {


            if (Rdata != 'error') {
                
                var obj = JSON.parse(Rdata);
                $('#UID').val(obj.UID);
                $('#Name').val(obj.Name);
                $('#Code').val(obj.Code);
                $('#btn-save').html("<i class='fa fa-save'></i> Update");
                IsEditMode = true;
                if (obj.IsActive) {
                    $("#IsActive").iCheck('check');
                }
                else {
                    $("#IsActive").iCheck('uncheck');
                }
                $(window).scrollTop(0);
            }
            else {
                swal("Error", "Some Error Occured!");
                $('#btn-validate').removeAttr('disabled');
            }
        },
        error: function (e) {
        }
    });
});

$("#IsActive").on('ifChecked', function (event) {
    $(this).closest("input").attr('value', true);
});
$("#IsActive").on('ifUnchecked', function (event) {
    $(this).closest("input").attr('value', false);
});

//handle stuff
var handleStaff = function () {
    $('.frmAddCategory').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",
        rules: {
            Name: {
                required: true,
                maxlength: 50,
            },
        },

        invalidHandler: function (event, validator) { //display error alert on form submit

        },

        highlight: function (element) { // hightlight error inputs            
            $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function (error, element) {
            if (element.closest('.input-icon').size() === 1) {
                error.insertAfter(element.closest('.input-icon'));
            } else {
                error.insertAfter(element);
            }
        },

        submitHandler: function (form) {
            $('#btn-save').attr('disabled', 'true');
            $(".frmAddCategory :disabled").removeAttr('disabled');

            if (!IsEditMode) {
                $.post("../Category/AddCategory",
                    $(".frmAddCategory").serialize(),
                    function (value) {
                        if (value != 'error') {
                            if (value == 'SESSION EXPIRED') {
                                window.location = '../Authentication/Login';
                            }
                            else {
                                if (value == 'exist') {
                                    swal("warning", " Category Already Exist", "warning");
                                    Reset();
                                    return;
                                    }
                                swal(
                                  'Success',
                                  'Category Saved Successfully!',
                                  'success'
                                )

                                Reset();

                                $('#tblCategory').DataTable().destroy();
                                obj = JSON.parse(value);
                                //obj = obj[0];
                                $('#btn-save').removeAttr('disabled');
                                // alert(obj);
                                html += '';
                                var html = '<tr>';

                                html += '<td class="hidden">' + obj.UID + '</td>';

                                if (obj.Code != null) {
                                    html += '<td>' + obj.Code + '</td>';
                                }
                                else {
                                    html += '<td>-</td>';
                                }

                                if (obj.Name != null) {
                                    html += '<td>' + obj.Name + '</td>';
                                }
                                else {
                                    html += '<td>-</td>';
                                }

                                if (obj.IsActive) {
                                    html += '<td><span class="label label-success label-xs">Active</span></td>';
                                }
                                else {
                                    html += '<td><span class="label label-danger label-xs">In Active</span></td>';
                                }

                                //html += '<td>' + obj.IsActive + '</td>';
                                html += '<td>';
                                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                                html += '<i class="fa fa-edit"></i>';
                                html += ' Edit';
                                html += ' </button></td>';

                                html += '</tr>'

                                $("#tbody").append(html);
                                $('#tblCategory').DataTable().draw();
                            }
                        }
                        else {
                            swal("Error", "Data Not Saved. Please Refresh & Try Again", "error")
                            $('#btn-save').removeAttr('disabled');
                        }
                    },
                    "text"
                );
            }
            else {
                $.post(
                "../Category/EditCat",
                $(".frmAddCategory").serialize(),
                function (value) {
                    if (value != 'error') {
                        if (value == 'SESSION EXPIRED') {
                            window.location = '../Authentication/Login';
                        }
                        else {
                            if (value == 'exist') {
                                swal("warning", " Category Already Exist", "warning");
                                Reset();
                                return;
                            }
                            if (value == 'assigned') {
                                swal("error", " Can't Change Assigned Category", "error");
                                Reset();
                                return;
                            }
                            swal(
                                  'Success',
                                  'Category Updated Successfully!',
                                  'success'
                                )
                            Reset();
                            $('#btn-save').removeAttr('disabled');
                            var data = JSON.parse(value);

                            //alert(data);
                            $('#tblCategory').DataTable().destroy();

                            $('#tblCategory tbody tr').each(function (i, obj) {
                                var id = $(this).closest('tr').find('td:first-child').text();
                                if (id == data.UID) {
                                    if (data.Code != null) {
                                        $(this).closest('tr').find('td:nth-child(2)').text(data.Code);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(2)').text("-");
                                    }

                                    if (data.Name != null) {
                                        $(this).closest('tr').find('td:nth-child(3)').text(data.Name);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(3)').text("-");
                                    }

                                    //$(this).closest('tr').find('td:nth-child(4)').text(data.IsActive);

                                    if (data.IsActive) {
                                        //alert(data.IsActive);
                                        $(this).closest('tr').find('td:nth-child(4)').html('<td><span class="label label-success label-xs">Active</span></td>');
                                    }
                                    else {
                                        //alert(data.IsActive);
                                        $(this).closest('tr').find('td:nth-child(4)').html('<td><span class="label label-danger label-xs">In Active</span></td>');
                                    }

                                }
                            });

                            $('#tblCategory').DataTable().draw();
                        }
                    }
                    else {
                        swal("Error", "Data not updated!!", "error")
                        $('#btn-save').removeAttr('disabled');
                    }
                },
                "text"
            );
            }
            return false;

        }

    });
    $('.frmAddCategory').keypress(function (e) {
        if (e.which == 13) {

            if ($('.frmAddCategory').validate().form()) {
                $('.frmAddCategory').submit();
            }
            return false;
        }
    });
    jQuery('#btn-save').click(function () {
        if ($('.frmAddCategory').validate().form()) {
            $('.frmAddCategory').submit();
        }
    });
}

//load grid
LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Category/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            
            data = JSON.parse(data);
            //alert(data[0].Code);
            $('#tblCategory').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td class="hidden">' + obj.UID + '</td>';

                if (obj.Code != null) {
                    html += '<td>' + obj.Code + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Name != null) {
                    html += '<td>' + obj.Name + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                //html += '<td>' + obj.IsActive + '</td>';

                if (obj.IsActive) {
                    html += '<td><span class="label label-success label-xs">Active</span></td>';
                }
                else {
                    html += '<td><span class="label label-danger label-xs">In Active</span></td>';
                }

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Edit';
                html += ' </button></td>';
                html += '</tr>'
            }
            $("#tbody").append(html);
            $('#tblCategory').DataTable().draw();
        }
    });
}

//reset values
var Reset = function () {
    IsEditMode = false;
    CodeGenerate();
    $('#Name').val('');
    $('#btn-save').html("<i class='fa fa-save'></i> Save");
}
$('#btn-refresh').click(function () {
    Reset();
});
