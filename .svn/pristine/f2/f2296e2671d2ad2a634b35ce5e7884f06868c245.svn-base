var IsEditMode = false;
$(document).ready(function () {
    LoadPicker();
    LoadGridData();
    handleStaff();


    $('#dFrom').datepicker({
        format: 'mm/dd/yyyy',
        defaultDate: new Date()
    });
    $('#dTo').datepicker({
        format: 'mm/dd/yyyy',
        defaultDate: new Date()
    });
    $("#dFrom").datepicker('setDate', new Date());
    $("#dTo").datepicker('setDate', new Date());
});
function Reset() {
    IsEditMode = false;
    LoadPicker();
    $('#Amount').val('');
    $("#Comments").val('');
    $('#btn-save').html("<i class='fa fa-save'></i> Save");
}

$('#btn-refresh').click(function () {
    Reset();
});



//handle stuff
var handleStaff = function () {
    $('.frmAddExpense').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",
        rules: {
            Amount: {
                required: true,
                digits: true,
            },
            Comments: {
                required:true,
            }

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
            $(".frmAddExpense :disabled").removeAttr('disabled');

            if (!IsEditMode) {
                $.post("../DailyExpenses/AddExpense",
                    $(".frmAddExpense").serialize(),
                    function (value) {
                        if (value != 'error') {
                            if (value == 'SESSION EXPIRED') {
                                window.location = '../Authentication/Login';
                            }
                            else {                                
                                swal(
                                  'Success',
                                  'Daily Expense Saved Successfully!',
                                  'success'
                                )

                                Reset();
                                console.log(value);

                                $('#tblDailyExp').DataTable().destroy();
                                obj = JSON.parse(value);
                               
                                $('#btn-save').removeAttr('disabled');
                           
                                html += '';
                                var html = '<tr>';

                                html += '<td class="hidden">' + obj.UID + '</td>';

                                if (obj.Date != null) {
                                    html += '<td>' + FormatDate(obj.Date) + '</td>';
                                }
                                else {
                                    html += '<td>-</td>';
                                }

                                if (obj.Amount != null) {
                                    html += '<td>' + obj.Amount + '</td>';
                                }
                                else {
                                    html += '<td>-</td>';
                                }
                                if (obj.Comments != null) {
                                    html += '<td>' + obj.Comments + '</td>';
                                }
                                else {
                                    html += '<td>-</td>';
                                }

                                

                                //html += '<td>' + obj.IsActive + '</td>';
                                html += '<td>';
                                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                                html += '<i class="fa fa-edit"></i>';
                                html += ' Edit';
                                html += ' </button></td>';

                                html += '<td>';
                                html += '<button id=' + obj.UID + ' class="btn btn-denger btn-block btn-xs btn-delete">';
                                html += '<i class="fa fa-trash "></i>';
                                html += ' Delete';
                                html += ' </button></td>';

                                html += '</tr>'

                                $("#tbody").append(html);
                                $('#tblDailyExp').DataTable().draw();
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
                "../DailyExpenses/EditExpenses",
                $(".frmAddExpense").serialize(),
                function (value) {
                    if (value != 'error') {
                        if (value == 'SESSION EXPIRED') {
                            window.location = '../Authentication/Login';
                        }
                        else {
                           
                           
                            swal(
                                  'Success',
                                  ' Updated Successfully!',
                                  'success'
                                )
                            Reset();
                            $('#btn-save').removeAttr('disabled');
                            var data = JSON.parse(value);

                            //alert(data);
                            $('#tblDailyExp').DataTable().destroy();

                            $('#tblDailyExp tbody tr').each(function (i, obj) {
                                var id = $(this).closest('tr').find('td:first-child').text();
                                if (id == data.UID) {
                                    if (data.Date != null) {
                                        $(this).closest('tr').find('td:nth-child(2)').text(FormatDate(data.Date));
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(2)').text("-");
                                    }

                                    if (data.Amount != null) {
                                        $(this).closest('tr').find('td:nth-child(3)').text(data.Amount);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(3)').text("-");
                                    }
                                    if (data.Comments != null) {
                                        $(this).closest('tr').find('td:nth-child(4)').text(data.Comments);
                                    }
                                    else {
                                        $(this).closest('tr').find('td:nth-child(4)').text("-");
                                    }
                                    //$(this).closest('tr').find('td:nth-child(4)').text(data.IsActive);

                                    

                                }
                            });

                            $('#tblDailyExp').DataTable().draw();
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
    $('.frmAddExpense').keypress(function (e) {
        if (e.which == 13) {

            if ($('.frmAddExpense').validate().form()) {
                $('.frmAddExpense').submit();
            }
            return false;
        }
    });
    jQuery('#btn-save').click(function () {

        //if ($('#Receive').val() && $('#Paid').val() == 0)
        //{
        //    swal("Warning", "Please ", "warning")

        //}
        if ($('.frmAddExpense').validate().form()) {
            $('.frmAddExpense').submit();
        }
    });
}

var LoadPicker = function () {
    $('#Date').datepicker({
        format: 'mm/dd/yyyy',
        defaultDate: new Date()
    });
    $("#Date").datepicker('setDate', new Date());

}


function FormatDate(Date) {
    var today = Date;
    var yyyy = today.substring(0, 4);
    var mm = today.substring(7, 5);
    var dd = today.substring(10, 8);
    today = yyyy + '/' + mm + '/' + dd;
    return today
}
LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../DailyExpenses/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $('#tblDailyExp').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td class="hidden">' + obj.UID + '</td>';

                if (obj.Date != null) {
                    html += '<td>' +FormatDate( obj.Date) + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Amount != null) {
                    html += '<td>' + obj.Amount + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Comments != null) {
                    html += '<td>' + obj.Comments + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
               
                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Edit';
                html += ' </button></td>';

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-denger btn-block btn-xs btn-delete">';
                html += '<i class="fa fa-trash "></i>';
                html += ' Delete';
                html += ' </button></td>';

                html += '</tr>'


                
            }
            $("#tbody").append(html);
            $('#tblDailyExp').DataTable().draw();
        }
    });
}

$(document).on('click', '.btn-edit', function () {
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("Id", uid);

    $.ajax({
        type: "POST",
        cache: false,
        url: "../DailyExpenses/Edit",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                var obj = JSON.parse(Rdata);

                $('#UID').val(obj.UID);
                $('#Date').val(FormatDate(obj.Date));
                $('#Amount').val(obj.Amount);
                $('#Comments').val(obj.Comments);

                $('#btn-save').html("<i class='fa fa-save'></i> Update");
                IsEditMode = true;
                
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


$(document).on('click', '.btn-delete', function () {
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("Id", uid);

    $.ajax({
        type: "POST",
        cache: false,
        url: "../DailyExpenses/Delete",
        data: data,
        processData: false,
        contentType: false,
        success: function (data) {
            
            
            location.reload();

           
        },
        error: function (e) {
        }
    });
});

$(document).on('click', '.btn-saleReport', function () {


    var fromdate = $("#dFrom").val()
    var todate = $("#dTo").val()
    $("#tblbody").html('');
    $("#fromdate").html('');
    $("#todate").html('');
    $("#fromdate").append(fromdate);
    $("#todate").append(todate);

    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/DailyReport?FromDate=" + fromdate + "&ToDate=" + todate,

        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            //alert(data);
            var html = '';
            var z = 0;
            var UID = "";
            var TotalAmount = 0;

            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                if (UID != obj.UID) {

                    UID = obj.UID;

                    TotalAmount += parseInt(obj.Amount);

                    console.log(TotalAmount);


                    //html += '<tr><td colspan="4" style="background-color:lightgray"  align="center">Invoice No : ' + obj.InvoiceNo + '</td><td colspan="4" style="background-color:lightgray"  align="center">Customer : ' + obj.CustomerName + '</td></tr>';
                    //sr = 0;
                }
                if (obj.Date != null) {
                    html += '<td>' + FormatDate(obj.Date) + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Comments != null) {
                    html += '<td>' + obj.Comments + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Amount != null) {
                    html += '<td style="text-align:right;">' + obj.Amount + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                z += 1;
                if (z == obj.CountRow) {
                    z = 0;

                    html += '<tr>';
                    html += '<td colspan="5"  align="right"><h4><b>Total Bill : <br>';


                    html += '<td colspan="1"  align="right"><h4><b>' + obj.TotalAmount + '<br>';


                    html += '</tr>';



                }



                if (data.length == (i + 1)) {


                    html += '<tr>';
                    html += '<td colspan=""  align="right"><h4><b> <br>';
                    html += '<td colspan=""  align="right"><h4><b>Total Expenses : <br>';


                    html += '<td colspan=""  align="right"><h4><b>' + TotalAmount + '<br>';


                    html += '</tr>';

                }

                html += '</tr>'

            }
            $("#tblbody").append(html);


        }
    });

})