
var IsEditMode = false;

$(document).ready(function () {
    GenerateTicketNo();
    LoadPriorityType();
    LoadServiceDDL();
    LoadProducts();
    LoadDepartmentDDL();
    $('.summernote').summernote();
    LoadStatusType();
    $('#tblTickets').DataTable({ responsive: true });
    LoadGridData();
});

var GenerateTicketNo = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../TicketManagement/GenerateTicketNo?ClientCode=" + $('#ClientCode').val(),
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data);
            $('#Ticketno').val(data);
            $('#Ticketno').attr('disabled', true);
        }
    });
}

// for loading Priority
var LoadPriorityType = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../TicketManagement/LoadPriorityType",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#Priority');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="0">' + "Select Priority" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="0">' + "Select Client" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}

//for loading Services
var LoadServiceDDL = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../TicketManagement/LoadServiceDDL",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#Service');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="0">' + "Select Service" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="0">' + "Select Service" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });

}

//for loading Product
$('#Service').on('change', function () {
    var serviceURL = '../TicketManagement/GetProductByServiceId?Id=' + $('#Service').val();
    $.ajax({
        type: "GET",
        url: serviceURL,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: MysuccessFunc,
        error: MyerrorFunc
    });
    function MysuccessFunc(data) {
        //var sch = JSON.parse(data);
        console.log(data.length);
        var $el = $('#Product');
        $el.empty();
        $el.chosen('destroy');
        if (data.length > 0) {
            $el.append('<option value="0">' + "Select Product" + '</option>');
            $.each(data, function (idx, obj) {
                $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
            });
        }
        else {
            $el.append('<option value="0">' + "Select Product" + '</option>');
        }
        $el.trigger("liszt:updated");
        $el.chosen();
    }
    function MyerrorFunc(data) {
        alert("Error");
    }
})

function GetProductByServiceId() {
    var serviceURL = '../TicketManagement/GetProductByServiceId?Id=' + $('#Service').val();
    $.ajax({
        type: "GET",
        url: serviceURL,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: MysuccessFunc,
        error: MyerrorFunc
    });
    function MysuccessFunc(data) {
        //var sch = JSON.parse(data);
        console.log(data.length);
        var $el = $('#Product');
        $el.empty();
        $el.chosen('destroy');
        if (data.length > 0) {
            $el.append('<option value="0">' + "Select Product" + '</option>');
            $.each(data, function (idx, obj) {
                $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
            });
        }
        else {
            $el.append('<option value="0">' + "Select Product" + '</option>');
        }
        $el.trigger("liszt:updated");
        $el.chosen();
    }
    function MyerrorFunc(data) {
        alert("Error");
    }
}

function LoadProducts() {
    var $el = $('#Product');
    $el.empty();
    $el.append('<option value="0">' + "Select Product" + '</option>');
    $el.trigger("liszt:updated");
    $el.chosen();
}
//for loading Department
var LoadDepartmentDDL = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../TicketManagement/LoadDepartmentDDL",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#Department');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="0">' + "Select Department" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="0">' + "Select Department" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}


jQuery('#btn-save').click(function () {
    if (TicketValidation()) {
        SaveTicket();
    }
});

var Ticket = function () {
    this.UID = '';
    this.Ticketno = '';
    this.Subject = '';
    this.Department = '0';
    this.Service = '0';
    this.Product = '0';
    this.Priority = '0';
    this.Comments = '';
    this.Status = '';
};

var SaveTicket = function () {

    var objItemsClass = new Ticket();

    objItemsClass.Ticketno = $('#Ticketno').val();
    objItemsClass.Subject = $('#Subject').val();
    objItemsClass.Department = $('#Department').val();
    objItemsClass.Service = $('#Service').val();
    objItemsClass.Product = $('#Product').val();
    objItemsClass.Priority = $('#Priority').val();
    objItemsClass.Comments = $('#Comments').summernote('code');
    objItemsClass.UID = $('#UID').val();
    objItemsClass.Status = $('#Status').val();

    if (!IsEditMode) {
        $.ajax({
            type: "POST",
            url: "../TicketManagement/AddAdminTicket",
            data: JSON.stringify(objItemsClass),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                if (data == 'exist') {
                    swal(
                      'Error',
                      'Ticket Already Generated!',
                      'error'
                    )
                    return;
                }
                if (data != 'error') {
                    swal(
                      'Success',
                      'Saved Successfully!',
                      'success'
                    )
                    Reset();
                    $('#btn-save').removeAttr('disabled');
                    $('#tblTickets').DataTable().destroy();

                    data = data[0];

                    html += '';
                    var html = '<tr>';

                    html += '<td class="hidden">' + data.UID + '</td>';

                    if (data.Client != null) {
                        html += '<td>' + data.Client + '</td>';
                    }
                    else {
                        html += '<td>-</td>';
                    }
                    if (data.TicketNo != null) {
                        html += '<td>' + data.TicketNo + '</td>';
                    }
                    else {
                        html += '<td>-</td>';
                    }
                    if (data.Subject != null) {
                        html += '<td>' + data.Subject + '</td>';
                    }
                    else {
                        html += '<td>-</td>';
                    }
                    if (data.Department != null) {
                        html += '<td>' + data.Department + '</td>';
                    }
                    else {
                        html += '<td>-</td>';
                    }
                    if (data.RelatedService != null) {
                        html += '<td>' + data.RelatedService + '</td>';
                    }
                    else {
                        html += '<td>-</td>';
                    }
                    if (data.RelatedProduct != null) {
                        html += '<td>' + data.RelatedProduct + '</td>'
                    }
                    else {
                        html += '<td>-</td>';
                    }
                    if (data.Status == 'Reported') {
                        html += '<td>' + '<span class="label label-danger pull-right" style="width: 90px;">' + data.Status + '</span>' + '</td>';
                    }
                    else if (data.Status == 'Open') {
                        html += '<td>' + '<span class="label label-info pull-right" style="width: 90px;">' + data.Status + '</span>' + '</td>';
                    }
                    else if (data.Status == 'Under Process') {
                        html += '<td>' + '<span class="label label-primary pull-right" style="width: 90px;">' + data.Status + '</span>' + '</td>';
                    }
                    else if (data.Status == 'Closed') {
                        html += '<td>' + '<span class="label label-default pull-right" style="width: 90px;">' + data.Status + '</span>' + '</td>';
                    }
                    else if (data.Status == 'Re Open') {
                        html += '<td>' + '<span class="label label-warning pull-right" style="width: 90px;">' + data.Status + '</span>' + '</td>';
                    }
                    else {
                        html += '<td>-</td>'
                    }
                    html += '<td>'
                    html += '<button id=' + data.UID + ' class="btn btn-warning btn-block btn-xs btn-edit" style="width: 80px;">';
                    html += '<i class="fa fa-edit"></i>';
                    html += ' Edit';
                    html += ' </button>';
                    html += ' </td>';

                    html += ' <td>';
                    html += '<a href="../UserRights/Index/?UID=' + data.UID + '" class="btn btn-info btn-block btn-xs" style="width: 80px;">';
                    html += '<i class="fa fa-users"></i>';
                    html += ' Assign';
                    html += ' </a>';
                    html += ' </td>';

                    html += '</tr>'

                    $('#tblbody').append(html);
                    $('#tblTickets').DataTable().draw();
                }
                else {
                    swal("Error", "Data Not Saved. Please Refresh & Try Again", "error")
                    $('#btn-save').removeAttr('disabled');
                }
            },
            error: function () {
                alert("ERROR!");
            }
        });
    }
    else if (IsEditMode) {
        $.ajax({
            type: "POST",
            url: "../TicketManagement/EditAdminTicket",
            data: JSON.stringify(objItemsClass),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data == 'exist') {
                    swal(
                      'Error',
                      'Ticket Already Generated!',
                      'error'
                    )
                    return;
                };
                if (data != 'error') {
                    swal(
                      'Success',
                      'Updated Successfully!',
                      'success'
                    )

                    Reset();
                    $('#btn-save').removeAttr('disabled');
                    $('#tblTickets').DataTable().destroy();

                    data = data[0];

                    $('#tblTickets tbody tr').each(function (i, obj) {
                        var id = $(this).closest('tr').find('td:first-child').text();
                        //console.log(data[0].UID);
                        if (id == data.UID) {
                            if (data.Client != null) {
                                $(this).closest('tr').find('td:nth-child(2)').text(data.Client);
                            }
                            else {
                                $(this).closest('tr').find('td:nth-child(2)').text("-");
                            }
                            if (data.TicketNo != null) {
                                $(this).closest('tr').find('td:nth-child(3)').text(data.TicketNo);
                            }
                            else {
                                $(this).closest('tr').find('td:nth-child(3)').text("-");
                            }
                            if (data.Subject != null) {
                                $(this).closest('tr').find('td:nth-child(4)').text(data.Subject);
                            }
                            else {
                                $(this).closest('tr').find('td:nth-child(4)').text("-");
                            }

                            if (data.Department != null) {
                                $(this).closest('tr').find('td:nth-child(5)').text(data.Department);
                            }
                            else {
                                $(this).closest('tr').find('td:nth-child(5)').text("-");
                            }
                            if (data.RelatedService != null) {
                                $(this).closest('tr').find('td:nth-child(6)').text(data.RelatedService);
                            }
                            else {
                                $(this).closest('tr').find('td:nth-child(6)').text("-");
                            }
                            if (data.RelatedProduct != null) {
                                $(this).closest('tr').find('td:nth-child(7)').text(data.RelatedProduct);
                            }
                            else {
                                $(this).closest('tr').find('td:nth-child(7)').text("-");
                            }
                            //$(this).closest('tr').find('td:nth-child(8)').text(data.Status);

                            if (data.Status == 'Reported') {
                                $(this).closest('tr').find('td:nth-child(8)').html('<span class="label label-danger pull-right" style="width: 90px;">' + data.Status + '</span>');
                            }
                            else if (data.Status == 'Open') {
                                $(this).closest('tr').find('td:nth-child(8)').html('<span class="label label-info pull-right" style="width: 90px;">' + data.Status + '</span>');
                            }
                            else if (data.Status == 'Under Process') {
                                $(this).closest('tr').find('td:nth-child(8)').html('<span class="label label-primary pull-right" style="width: 90px;">' + data.Status + '</span>');
                            }
                            else if (data.Status == 'Closed') {
                                $(this).closest('tr').find('td:nth-child(8)').html('<span class="label label-default pull-right" style="width: 90px;">' + data.Status + '</span>');
                            }
                            else if (data.Status == 'Re Open') {
                                $(this).closest('tr').find('td:nth-child(8)').html('<span class="label label-warning pull-right" style="width: 90px;">' + data.Status + '</span>');
                            }
                        }
                    });
                    $('#tblTickets').DataTable().draw();
                };
            },
            error: function () {
                alert("ERROR!");
            }
        });
    }

}

function Reset() {
    IsEditMode = false;
    LoadPriorityType();
    LoadServiceDDL();
    LoadDepartmentDDL();
    LoadProducts();
    LoadStatusType();
    $('#Subject').val('');
    $('#Comments').summernote('destroy');
    $('#Comments').val('');
    $('#Comments').html('');
    $('#Comments').summernote();
    $('#Department').val("").trigger("chosen:updated");
    $('#Service').val("").trigger("chosen:updated");
    $('#Product').val("").trigger("chosen:updated");
    $('#Priority').val("").trigger("chosen:updated");
    $('#Status').val("").trigger("chosen:updated");
    $('#btn-save').html("<i class='fa fa-save'></i> Save");
}

$('#btn-reset').click(function () {
    Reset();
});

var LoadStatusType = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../TicketManagement/LoadStatusType",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#Status');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="0">' + "Select Status" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="0">' + "Select Status" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}

//load grid
var LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../TicketManagement/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblTickets').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td class="hidden">' + obj.UID + '</td>';

                if (obj.Client != null) {
                    html += '<td>' + obj.Client + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.TicketNo != null) {
                    html += '<td>' + obj.TicketNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Subject != null) {
                    html += '<td>' + obj.Subject + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Department != null) {
                    html += '<td>' + obj.Department + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.RelatedService != null) {
                    html += '<td>' + obj.RelatedService + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.RelatedProduct != null) {
                    html += '<td>' + obj.RelatedProduct + '</td>'
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Status == 'Reported') {
                    html += '<td>' + '<span class="label label-danger pull-right" style="width: 90px;">' + obj.Status + '</span></p>' + '</td>';
                }
                else if (obj.Status == 'Open') {
                    html += '<td>' + '<span class="label label-info pull-right" style="width: 90px;">' + obj.Status + '</span></p>' + '</td>';
                }
                else if (obj.Status == 'Under Process') {
                    html += '<td>' + '<span class="label label-primary pull-right" style="width: 90px;">' + obj.Status + '</span></p>' + '</td>';
                }
                else if (obj.Status == 'Closed') {
                    html += '<td>' + '<span class="label label-default pull-right" style="width: 90px;">' + obj.Status + '</span></p>' + '</td>';
                }
                else if (obj.Status == 'Re Open') {
                    html += '<td>' + '<span class="label label-warning pull-right" style="width: 90px;">' + obj.Status + '</span></p>' + '</td>';
                }
                else {
                    html += '<td>-</td>'
                }
                html += '<td>'
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit" style="width: 80px;">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Edit';
                html += ' </button>';
                html += ' </td>';

                html += ' <td>';
                html += '<a href="../UserRights/Index/?UID=' + obj.UID + '" class="btn btn-info btn-block btn-xs" style="width: 80px;">';
                html += '<i class="fa fa-users"></i>';
                html += ' Assign';
                html += ' </a>';
                html += ' </td>';

                html += '</tr>'
            }
            $("#tblbody").append(html);
            $('#tblTickets').DataTable().draw();
        }
    });
}

//edit method
$(document).on('click', '.btn-edit', function () {
    var uid = $(this).attr('id');
    var data = new FormData();
    data.append("UID", uid);
    $.ajax({
        type: "POST",
        cache: false,
        url: "../TicketManagement/Edit",
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                //alert(Rdata);
                var data = JSON.parse(Rdata);

                $('#UID').val(data.UID);
                $('#ClientId').val(data.ClientId);
                $('#Ticketno').val(data.Ticketno);
                $('#Subject').val(data.Subject);
                $('#Department').val(data.Department).trigger("chosen:updated");
                $('#Department').prop('disabled', true).trigger("chosen:updated");
                $('#Service').val(data.Service).trigger("chosen:updated");
                $('#Service').prop('disabled', true).trigger("chosen:updated");
                GetProductByServiceId();
                $('#Product').val(data.Product).trigger("chosen:updated");
                $('#Product').prop('disabled', true).trigger("chosen:updated");
                $('#Priority').val(data.Priority).trigger("chosen:updated");
                $('#Status').val(data.Status).trigger("chosen:updated");
                $('#Comments').summernote('destroy');
                $('#Comments').val(data.Comments);
                $('#Comments').html(data.Comments);
                $('#Comments').summernote();
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

// Form Validation
function TicketValidation() {

    var Status = true;

    var StatusDDL = $('#Status').val();
    if (StatusDDL == '0') {
        swal(
            'WARNING',
            'Please select Valid Status to proceed.',
            'warning'
        );
        Status = false;
        return Status;
    }

    var ClientName = $('#Name').val();
    if (ClientName.length <= 0) {
        swal(
            'WARNING',
            'Please refresh your screen to load Client Data properly.',
            'warning'
        );
        Status = false;
        return Status;
    }

    var ClientEmail = $('#Email').val();
    if (ClientEmail.length <= 0) {
        swal(
            'WARNING',
            'Please refresh your screen to load Client Data properly.',
            'warning'
        );
        Status = false;
        return Status;
    }

    var TicketSubject = $('#Subject').val();
    if (TicketSubject.length <= 0) {
        swal(
            'WARNING',
            'Please provide Subject to proceed.',
            'warning'
        );
        Status = false;
        return Status;
    }

    var TicketDepartment = $('#Department').val();
    if (TicketDepartment == '0') {
        swal(
            'WARNING',
            'Please select Valid Department to proceed.',
            'warning'
        );
        Status = false;
        return Status;
    }

    var TicketService = $('#Service').val();
    if (TicketService == '0') {
        swal(
            'WARNING',
            'Please select Valid Service to proceed.',
            'warning'
        );
        Status = false;
        return Status;
    }

    var TicketProduct = $('#Product').val();
    if (TicketProduct == '0') {
        swal(
            'WARNING',
            'Please select Valid Product to proceed.',
            'warning'
        );
        Status = false;
        return Status;
    }

    var TicketPriority = $('#Priority').val();
    if (TicketPriority == '0') {
        swal(
            'WARNING',
            'Please select Valid Priority to proceed.',
            'warning'
        );
        Status = false;
        return Status;
    }

    var TicketComments = $('#Comments').val();
    if (TicketComments == '') {
        swal(
            'WARNING',
            'Please provide Comments to proceed.',
            'warning'
        );
        Status = false;
        return Status;
    }

    return Status;

}