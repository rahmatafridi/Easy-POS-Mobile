
var IsEditMode = false;

// Document Ready Function
$(document).ready(function () {
    GenerateTicketNo();
    LoadPriorityType();
    LoadServiceDDL();
    LoadProducts();
    LoadDepartmentDDL();
    $('.summernote').summernote();
    RecentTickets();
});

// Ticket # Generation Method
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

// Priority Loading Method For Dropdown
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

// Services Loading Method For Dropdown
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

// Product Loading Method For Dropdown By Service Id
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

// Product Loading Method For Dropdown
function LoadProducts() {
    var $el = $('#Product');
    $el.empty();
    $el.append('<option value="0">' + "Select Product" + '</option>');
    $el.trigger("liszt:updated");
    $el.chosen();
}

// Department Loading Method For Dropdown
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

//Save Button Click Event
jQuery('#btn-save').click(function () {
    if (TicketValidation()) {
        SaveTicket();
    }
});

// Ticket Class For Data Sending via POST Method
var Ticket = function () {
    this.Ticketno = '';
    this.Subject = '';
    this.Department = '0';
    this.Service = '0';
    this.Product = '0';
    this.Priority = '0';
    this.Comments = '';
};

// Save Ticket Method For Saving Data.
var SaveTicket = function () {
    var objItemsClass = new Ticket();

    objItemsClass.Ticketno = $('#Ticketno').val();
    objItemsClass.Subject = $('#Subject').val();
    objItemsClass.Department = $('#Department').val();
    objItemsClass.Service = $('#Service').val();
    objItemsClass.Product = $('#Product').val();
    objItemsClass.Priority = $('#Priority').val();
    objItemsClass.Comments = $('#Comments').summernote('code');    

    $.ajax({
        type: "POST",
        url: "../TicketManagement/AddTicket",
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

// Reset Method
function Reset() {
    IsEditMode = false;
    LoadPriorityType();
    LoadServiceDDL();
    LoadProducts();
    LoadDepartmentDDL();    
    $('#Subject').val('');
    $('#Comments').summernote('destroy');
    $('#Comments').val('');
    $('#Comments').summernote();
    $('#Priority').val("").trigger("chosen:updated");
    $('#Department').val("").trigger("chosen:updated");
    $('#Service').val("").trigger("chosen:updated");
    $('#Product').val("").trigger("chosen:updated");
    $('#btn-save').html("<i class='fa fa-save'></i> Save");
}

//Reset Button Click Event
$('#btn-reset').click(function () {
    Reset();
});

// Recent Ticket For Same Client
var RecentTickets = function () {
    $.ajax({
        type: "POST",
        url: "../TicketManagement/RecentTickets",
        async: false,
        success: function (data) {
            if (data != 'error') {
                data = JSON.parse(data);
                var html = '';
                for (var i = 0; i < data.length ; i++) {
                    var obj = data[i];
                    html += '<li class="media event">';
                    html += '<i class="fa fa-ticket"></i> ' + obj.TicketNo;
                    html += '<div class="media-body">';
                    html += '<p><span class="fa fa-flag"></span> ' + obj.Subject;
                    if (obj.Status == 'Reported') {
                        html += '<span class="label label-danger pull-right" style="width: 80px;">' + obj.Status + '</span></p>';
                    }
                    else if (obj.Status == 'Open') {
                        html += '<span class="label label-info pull-right" style="width: 80px;">' + obj.Status + '</span></p>';
                    }
                    else if (obj.Status == 'Under Process') {
                        html += '<span class="label label-primary pull-right" style="width: 80px;">' + obj.Status + '</span></p>';
                    }
                    else if (obj.Status == 'Closed') {
                        html += '<span class="label label-default pull-right" style="width: 80px;">' + obj.Status + '</span></p>';
                    }
                    else if (obj.Status == 'Re Open') {
                        html += '<span class="label label-warning pull-right" style="width: 80px;">' + obj.Status + '</span></p>';
                    }
                    html += '</div>';
                    html += '</li>';
                    html += '<hr style="margin: 0px;">';
                }
                $('#recentticket').append(html);
            }
        },
        error: function () {
            alert("Error");
        }
    });
}

// Form Validation
function TicketValidation() {
    //console.log('Validation');
    var Status = true;

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