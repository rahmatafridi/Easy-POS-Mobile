
var IsEditMode = false;
$(document).ready(function () {
    $('#tblCustomers').DataTable();
    //GenerateCode();
    Reset();
    handleStaff();
    LoadGridData();

})

var Reset = function () {
    IsEditMode = false;
    $('#UID').val('');
    $('#OpeningBalance').val('');

    $('#Name').val('');
    $('#Code').val(''); 
    $('.clear').val('');
    $('#Contact').val('');
    $('#Email').val('');
    $('#Address').val('');
    $('#SubCategoryName').val('');
    $("#IsActive").iCheck('uncheck');
    $("#IsResaler").iCheck('uncheck');
    GenerateCode();
}

$('#btn-refresh').click(function () {
    Reset();
})

$(".DigitOnlyForPer").keypress(function (e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    // Allow non-printable keys
    if (!charCode || charCode == 8 /* Backspace */) {
        return;
    }

    var typedChar = String.fromCharCode(charCode);

    var v = parseInt(this.value);
    if (v > 99) {
        //alert(this.value);
        return false;
    }

    // Allow numeric characters
    if (/\d/.test(typedChar)) {


        var v = parseInt(this.value);
        if (v + typedChar > 100) {
            return false;
        }

        return;
    }

    // Allow the minus sign (-) if the user enters it first
    if (typedChar == "-" && this.value == "") {
        return false;
    }

    // In all other cases, suppress the event
    return false;
});

$(".DigitOnlyBalance").keypress(function (e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    // Allow non-printable keys
    if (!charCode || charCode == 8 /* Backspace */) {
        return;
    }

    var typedChar = String.fromCharCode(charCode);

   
    // Allow the minus sign (-) if the user enters it first
    if (typedChar == "-" && this.value == "") {
        return ;
    }
    // Allow numeric characters
    if (/\d/.test(typedChar)) {
        return;
    }

    // Allow the minus sign (-) if the user enters it first
    if (typedChar == "-" && this.value == "") {
        return;
    }



    // In all other cases, suppress the event
    return false;
});


$(".DigitOnly").keypress(function (e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    // Allow non-printable keys
    if (!charCode || charCode == 8 /* Backspace */) {
        return;
    }

    var typedChar = String.fromCharCode(charCode);

    // Allow the minus sign () if the user enters it first
    if (typedChar != "2" && this.value == "9") {
        return false;
    }
    // Allow the minus sign (9) if the user enters it first
    if (typedChar != "9" && this.value == "") {
        return false;
    }
    // Allow numeric characters
    if (/\d/.test(typedChar)) {
        return;
    }

    // Allow the minus sign (-) if the user enters it first
    if (typedChar == "-" && this.value == "") {
        return;
    }



    // In all other cases, suppress the event
    return false;
});


var GenerateCode = function () {
    $.ajax({
        type: 'POST',
        url: '../CustomerManagement/GenerateCode',
        contentData: false,
        processData: false,
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
        url: "../CustomerManagement/Edit",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                var obj = JSON.parse(Rdata);

                $('#UID').val(obj.UID);
                $('#Code').val(obj.Code);
                $('#Name').val(obj.Name);
                $('#OpeningBalance').val(obj.OpeningBalance);
                $('#Contact').val(obj.Contact);
                $('#Email').val(obj.Email);
                $('#Address').val(obj.Address);
                $('#btn-save').html("<i class='fa fa-save'></i> Update");
                IsEditMode = true;
                if (obj.IsActive) {
                    $("#IsActive").iCheck('check');
                }
                else {
                    $("#IsActive").iCheck('uncheck');
                }

                if (obj.IsResaler) {
                    $("#IsResaler").iCheck('check');
                }
                else {
                    $("#IsResaler").iCheck('uncheck');
                }

                //nested ajax start

                $.ajax({
                    type: "POST",
                    cache: false,
                    url: "../CustomerManagement/EditDiscount",
                    data: data,
                    processData: false,
                    contentType: false,
                    success: function (Ndata) {
                        if (Ndata != 'error') {
                            Nobj = JSON.parse(Ndata);

                            $.each(Nobj, function (index, value) {
                                var oobjj = value;

                                    var a = "#SC_" + oobjj.SubCatId;
                                    $(a).val(oobjj.Discount);

                                    var b = "#SCH_" + oobjj.SubCatId;
                                    $(b).val(oobjj.SubCatId);

                                //alert(oobjj.SubCatId + " : " + oobjj.Discount);

                            });

                        }
                        else {
                            ShowErrorAlert("Error", "Some Error Occured!");
                            $('#btn-validate').removeAttr('disabled');
                        }
                    },
                    error: function (e) {
                    }
                });





                //nested ajax end

                $(window).scrollTop(0);
            }
            else {
                ShowErrorAlert("Error", "Some Error Occured!");
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

$("#IsResaler").on('ifChecked', function (event) {
    $(".IsReseller").show();

    $(this).closest("input").attr('value', true);
});
$("#IsResaler").on('ifUnchecked', function (event) {
    $(".IsReseller").hide();

    $(this).closest("input").attr('value', false);
});

//handle stuff
var handleStaff = function () {
    $('.frmAddCustomers').validate({
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
            $(".frmAddCustomers :disabled").removeAttr('disabled');
            if (!IsEditMode) {
                $.post("../CustomerManagement/AddCustomer",
                    $(".frmAddCustomers").serialize(),
                    function (value) {
                        //alert(value);
                        if (value != 'error') {
                            if (value == 'Session Expired') {
                                window.location = '../Authentication/Login';
                            }
                            else {
                                swal(
                                  'Success',
                                  'Customer Saved Successfully!',
                                  'success'
                                )

                                Reset();

                                $('#tblCustomers').DataTable().destroy();
                                obj = JSON.parse(value);
                                //obj = obj[0];
                                $('#btn-save').removeAttr('disabled');
                                //alert(obj);
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

                                if (obj.Contact != null) {
                                    html += '<td>' + obj.Contact + '</td>';
                                }
                                else {
                                    html += '<td>-</td>';
                                }


                                if (obj.Address != null) {
                                    html += '<td>' + obj.Address + '</td>';
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

                                html += '<td>';
                                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                                html += '<i class="fa fa-edit"></i>';
                                html += ' Edit';
                                html += ' </button></td>';

                                html += '</tr>'

                                $("#tblbody").append(html);
                                $('#tblCustomers').DataTable().draw();
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
                $.post("../CustomerManagement/EditCustomer",
                $(".frmAddCustomers").serialize(),
                function (value) {
                    if (value != 'error') {
                        if (value == 'Session Expired') {
                            window.location = '../Authentication/Login';
                        }
                        else {
                            swal(
                              'Success',
                              'Customer Updated Successfully!',
                              'success'
                            )
                            Reset();
                            $('#btn-save').removeAttr('disabled');
                            var data = JSON.parse(value);
                            //data = data[0];
                            //alert(data);
                            $('#tblCustomers').DataTable().destroy();

                            $('#tblCustomers tbody tr').each(function (i, obj) {
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
                                    if (data.Contact != null) {
                                        $(this).closest('tr').find('td:nth-child(4)').text(data.Contact);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(4)').text("-");
                                    }

                                    if (data.Address != null) {
                                        $(this).closest('tr').find('td:nth-child(5)').text(data.Address);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(5)').text("-");
                                    }
                                    if (data.IsActive) {
                                        //alert(data.IsActive);
                                        $(this).closest('tr').find('td:nth-child(6)').html('<td><span class="label label-success label-xs">Active</span></td>');
                                    }
                                    else {
                                        //alert(data.IsActive);
                                        $(this).closest('tr').find('td:nth-child(6)').html('<td><span class="label label-danger label-xs">In Active</span></td>');
                                    }

                                }
                            });

                            $('#tblCustomers').DataTable().draw();
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
    $('.frmAddCustomers').keypress(function (e) {
        if (e.which == 13) {

            if ($('.frmAddCustomers').validate().form()) {
                $('.frmAddCustomers').submit();
            }
            return false;
        }
    });
    jQuery('#btn-save').click(function () {
        if ($('.frmAddCustomers').validate().form()) {
            $('.frmAddCustomers').submit();
        }
    });
}


var LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../CustomerManagement/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblCustomers').DataTable().destroy();
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


                if (obj.Contact != null) {
                    html += '<td>' + obj.Contact + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Address != null) {
                    html += '<td>' + obj.Address + '</td>';
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

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Edit';
                html += ' </button></td>';
                html += '</tr>'
            }
            $("#tblbody").append(html);
            $('#tblCustomers').DataTable().draw();
        }
    });
}