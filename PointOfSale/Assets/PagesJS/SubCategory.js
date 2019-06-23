
var IsEditMode = false;
$(document).ready(function () {
    $('#tblSubCategory').DataTable();
    LoadCategories();
    CodeGenerate();
    handleStaff();
    LoadGridData();
    Reset();

});

var LoadCategories = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../SubCategory/LoadCategories",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#CategoryId');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select Category" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select Category" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}

//GenerateCode
var CodeGenerate = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../SubCategory/CodeGenerate",
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
        url: "../SubCategory/Edit",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {


            if (Rdata != 'error') {

                var obj = JSON.parse(Rdata);
                $('#UID').val(obj.UID);
                $('#Name').val(obj.Name);
                $('#Code').val(obj.Code);
                $('#CategoryId').val(obj.CategoryId).trigger("chosen:updated");
                $('#CategoryId').attr('disabled', 'true').trigger("chosen:updated");
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
    $('.frmAddSubCategory').validate({
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
            $(".frmAddSubCategory :disabled").removeAttr('disabled');
            //alert($(".frmAddSubCategory").serialize());
            if (!IsEditMode) {
                $.post("../SubCategory/AddSubCategory",
                    $(".frmAddSubCategory").serialize(),
                    function (value) {
                        if (value != 'error') {
                            if (value == 'SESSION EXPIRED') {
                                window.location = '../Authentication/Login';
                            }
                            else {
                                if (value == 'categorymissing') {
                                    swal("warning", "Provide Category to proceed", "warning");
                                    Reset();
                                    return;
                                }
                                if (value == 'exist') {
                                    swal("warning", "Sub Category Already Exist", "warning");
                                    Reset();
                                    return;
                                }
                                swal(
                                  'Success',
                                  'Sub Category Saved Successfully!',
                                  'success'
                                )

                                Reset();

                                $('#tblSubCategory').DataTable().destroy();
                                obj = JSON.parse(value);
                                obj = obj[0];
                                $('#btn-save').removeAttr('disabled');
                                // alert(obj);
                                html += '';
                                var html = '<tr>';

                                html += '<td class="hidden">' + obj.UID + '</td>';

                                if (obj.CategoryName != null) {
                                    html += '<td>' + obj.CategoryName + '</td>';
                                }
                                else {
                                    html += '<td>-</td>';
                                }

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

                                if (obj.Status) {
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
                                $('#tblSubCategory').DataTable().draw();
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
                "../SubCategory/EditCat",
                $(".frmAddSubCategory").serialize(),
                function (value) {
                    if (value != 'error') {
                        if (value == 'SESSION EXPIRED') {
                            window.location = '../Authentication/Login';
                        }
                        else {
                            if (value == 'exist') {
                                swal("warning", "Sub Category Already Exist", "warning");
                                Reset();
                                return;
                            }
                            if (value == 'assigned') {
                                swal("error", " Can't Change Assigned Sub Category", "error");
                                Reset();
                                return;
                            }
                            swal(
                                  'Success',
                                  'Sub Category Updated Successfully!',
                                  'success'
                                )
                            Reset();
                            $('#btn-save').removeAttr('disabled');
                            var data = JSON.parse(value);
                            data = data[0];
                            //alert(data);
                            $('#tblSubCategory').DataTable().destroy();

                            $('#tblSubCategory tbody tr').each(function (i, obj) {
                                var id = $(this).closest('tr').find('td:first-child').text();
                                //alert(id + " | " + data.UID);
                                if (id == data.UID) {
                                    if (data.CategoryName != null) {
                                        $(this).closest('tr').find('td:nth-child(2)').text(data.CategoryName);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(2)').text("-");
                                    }

                                    if (data.Code != null) {
                                        $(this).closest('tr').find('td:nth-child(3)').text(data.Code);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(3)').text("-");
                                    }                                  

                                    if (data.Name != null) {
                                        $(this).closest('tr').find('td:nth-child(4)').text(data.Name);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(4)').text("-");
                                    }

                                    //$(this).closest('tr').find('td:nth-child(4)').text(data.IsActive);

                                    if (data.Status) {
                                        //alert(data.IsActive);
                                        $(this).closest('tr').find('td:nth-child(5)').html('<td><span class="label label-success label-xs">Active</span></td>');
                                    }
                                    else {
                                        //alert(data.IsActive);
                                        $(this).closest('tr').find('td:nth-child(5)').html('<td><span class="label label-danger label-xs">In Active</span></td>');
                                    }

                                }
                            });

                            $('#tblSubCategory').DataTable().draw();
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
    $('.frmAddSubCategory').keypress(function (e) {
        if (e.which == 13) {

            if ($('.frmAddSubCategory').validate().form()) {
                $('.frmAddSubCategory').submit();
            }
            return false;
        }
    });
    jQuery('#btn-save').click(function () {
        if ($('.frmAddSubCategory').validate().form()) {
            $('.frmAddSubCategory').submit();
        }
    });
}

//load grid
LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../SubCategory/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblSubCategory').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td class="hidden">' + obj.UID + '</td>';

                if (obj.CategoryName != null) {
                    html += '<td>' + obj.CategoryName + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

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
                if (obj.Status) {
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
            $('#tblSubCategory').DataTable().draw();
        }
    });
}

//reset values
var Reset = function () {
    IsEditMode = false;
    CodeGenerate();
    $('#Name').val('');
    $('#CategoryId').val("").trigger("chosen:updated");
    $('#btn-save').html("<i class='fa fa-save'></i> Save");
}
$('#btn-refresh').click(function () {
    Reset();
});
