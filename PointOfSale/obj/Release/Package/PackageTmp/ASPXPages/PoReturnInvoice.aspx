﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PoReturnInvoice.aspx.cs" Inherits="PointOfSale.ASPXPages.PoReturnInvoice" %>



<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <script>
        function printpage() 
            var p = getParameterByName('IsPrint');
            console.log(p);
            if (p == 0) {

            } else {
                window.print(true)
                setTimeout(function () { window.close(); }, 1);
            }

        }

        function cl() {
            window.close()
        }

        // Getting Value From Query String By Param Name
        function getParameterByName(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }

    </script>
    <style type="text/css" media="print">
        @page {
            size: auto; /* auto is the current printer page size */
            margin: 0mm; /* this affects the margin in the printer settings */
        }

        body {
            background-color: #FFFFFF;
            /*border: solid 1px black ;*/
            margin: 0px; /* the margin on the content before printing */
        }
    </style>

    <style>
        .format {
            font-size: small;
            font-family: Verdana;
            /*font-weight:bold;*/
        }
    </style>

    <style type="text/css" media="print">
        @page {
            size: landscape; /* auto is the current printer page size */
            margin: 0mm; /* this affects the margin in the printer settings */
        }

        body {
            background-color: #FFFFFF;
            margin: 0px; /* the margin on the content before printing */
        }
    </style>
    <style>
        .ticketprint {
            margin: 0px 0 0 10px;
            width: 790px;
            height: 1300px;
        }

        .most-left {
            float: left;
            margin: 0px 0 0 0px;
            width: 250px;
            height: 300px;
        }

        #srno {
            float: left;
            margin: 0px 0 0 10px;
            width: 100%;
        }

        #filmname {
            float: left;
            margin: 8px 0 0 10px;
            width: 100%;
        }

        #pricetic {
            float: left;
            margin: 110px 0 0 10px;
            width: 100%;
        }

        .left-div {
            float: left;
            margin: 1px 0px 0 90px;
            width: 100px;
            height: 160px;
        }

        #timetic {
            float: left;
            margin: 4px 0 0 15px;
            width: 100%;
        }

        #rownametic {
            float: left;
            margin: 25px 0 5px 15px;
            width: 100%;
        }

        #seatnotic {
            float: left;
            margin: 29px 0 0 15px;
            width: 100%;
        }

        #date {
            float: left;
            margin: 25px 0 5px 15px;
            width: 100%;
        }

        .right-div {
            float: right;
            margin: 4px 0 0 0px;
            width: 72px;
            height: 160px;
        }

        #pricecounter {
            float: left;
            margin: 35px 0 5px 7px;
            width: 100%;
        }

        #timecounter {
            float: left;
            margin: 0px 0 0px 9px;
            width: 100%;
        }

        #rownamecounter {
            float: left;
            margin: 4px 0 0px 9px;
            width: 100%;
        }

        #seatnocounter {
            float: left;
            margin: 10px 0 0px 9px;
            width: 100%;
        }

        #datecounter {
            float: left;
            margin: 10px 0 0px 7px;
            width: 100%;
        }

        .noteclass {
            font-size: 11px;
            text-align: justify;
        }
    </style>


</head>
<body onload="printpage();">
    <form id="form1" runat="server">
        <div>

            <div class="ticketprint">
                <br />
                <table width="100%">
                    <tr>
                        <td>
                           <center><h2 style="margin-bottom: 0px;"><label id="ClientName" runat="server"></label></h2></center>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <center><label id="ClientAddress" runat="server"></label></center>
                        </td>
                    </tr>
                     <tr>
                        <td>
                            <center><label><b>Contact # </b></label><label id="ClientPhone" runat="server" ></label><label><b>    Email :</b> </label><label id="ClientEmail" runat="server" ></label></center>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <center><b><span style="margin-top: 20px; font-size: 15px;">PO Return Invoice</span></b></center>
                        </td>
                    </tr>
                    
                </table>
                <table style="border: 1px solid black; width: 100%">
                    <tr>
                        <td style="padding-left: 1%; text-align: left; width: 60%;">
                            <div id="dvCustomer" runat="server" class="format"></div>
                        </td>
                         
                        <td style="padding-right: 1%; text-align: right; width: 60%;">
                            <div id="dvBillNo" runat="server" class="format"></div>
                        </td>

                    </tr>

                    <tr>
                        <td style="padding-left: 1%; text-align: left; width: 60%;">
                            <div id="CustomerBalance" runat="server" class="format"></div>
                        </td>
                        <td style="padding-right: 1%; text-align: right; width: 60%;">
                            <div id="CusRef" runat="server" class="format"></div>
                        </td>

                    </tr>

                    <tr>
                        <td style="padding-left: 1%; text-align: left; width: 60%;">
                        </td>
                        <td style="padding-right: 1%; text-align: right; width: 60%;">
                            <div id="dvDate" runat="server" class="format">11 Dec 2016</div>
                        </td>
                    </tr>

                </table>
                <br />
                <asp:Repeater runat="server" ID="rptBillItems">
                    <HeaderTemplate>
                        <table cellspacing="0" cellpadding="0" width="100%" style="border-bottom: 1px solid;">
                            <tr style="background-color: black;">
                                <td class="format" style="width: 25%; border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black; padding: 1%;">
                                    <asp:Label ID="Label1" runat="server" Text="Item Description" Style="font-size: smaller; font-weight: bold; color: white;"></asp:Label>
                                </td>
                                 
                                <td class="format" style="width: 11%; border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black; padding: 1%; font-weight: bold; text-align: right;">
                                    <asp:Label ID="lblItem" runat="server" Text="Rate" Style="font-size: smaller; font-weight: bold; color: white;"></asp:Label>
                                </td>
                               <td class="format" style="width: 5%; border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black; padding: 1%; font-weight: bold; text-align: center;">
                                    <asp:Label ID="lblPrice" runat="server" Text="Qty" Style="font-size: smaller; font-weight: bold; color: white;"></asp:Label>
                                </td>
                                <td class="format" style="width: 11%; border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; font-weight: bold; text-align: right;">
                                    <asp:Label ID="lblAmount" runat="server" Text="Net Rate" Style="font-size: smaller; font-weight: bold; color: white;"></asp:Label>
                                </td>
                               <%-- <td class="format" style="width: 10%; border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; font-weight: bold; text-align: right;">
                                    <asp:Label ID="lbliDiscount" runat="server" Text="Discount" Style="font-size: smaller; font-weight: bold; color: white;"></asp:Label>
                                </td>
                                <td class="format" style="width: 11%; border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; font-weight: bold; text-align: right;">
                                    <asp:Label ID="lbliAmountAfterDiscount" runat="server" Text="Value" Style="font-size: smaller; font-weight: bold; color: white;"></asp:Label>
                                </td>--%>
                            </tr>
                        </table>
                    </HeaderTemplate>
                    <ItemTemplate>
                        <table cellspacing="0" cellpadding="0" width="100%" style="border-bottom: 1px solid">
                            <tr>
                                <td class="format" style="width: 25%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; text-align: left">
                                    <asp:Label ID="Label2" CssClass="format" runat="server" Style="font-size: smaller;" Text='<%# Bind("Description")%>'></asp:Label>
                                </td>
                                  
                                 <td class="format" style="width: 11%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; text-align: right">
                                    <asp:Label ID="Item" CssClass="format" runat="server" Style="font-size: 9px;" Text='<%#DataBinder.Eval(Container.DataItem, "Price", "{0:0,0}") %>'></asp:Label>
                                </td>
                             <td class="format" style="width: 5%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; text-align: center;">
                                    <asp:Label ID="Price" CssClass="format" runat="server" Style="font-size: 9px;" Text='<%# Bind("Qty")%>'></asp:Label>
                                </td>
                                <td class="format" style="width: 11%; border-left: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; text-align: right;">
                                    <asp:Label ID="Amount" CssClass="format" runat="server" Style="font-size: 9px;" Text='<%#DataBinder.Eval(Container.DataItem, "Amount", "{0:0,0}")%>'></asp:Label>
                                </td>
                               <%-- <td class="format" style="width: 10%; border-left: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; text-align: right;">
                                    <asp:Label ID="iDiscount" CssClass="format" runat="server" Style="font-size: 9px;" Text='<%#DataBinder.Eval(Container.DataItem, "Discount", "{0:0,0}") %>'></asp:Label>
                                </td>
                                <td class="format" style="width: 11%; border-left: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; text-align: right;">
                                    <asp:Label ID="iAmountAfterDiscount" CssClass="format" runat="server" Style="font-size: 9px;" Text='<%#DataBinder.Eval(Container.DataItem, "AmountAfterDiscount", "{0:0,0}")%>'></asp:Label>
                                </td>--%>
                            </tr>
                        </table>
                    </ItemTemplate>
                </asp:Repeater>
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr id="tr1" runat="server">
                        <td class="format" style="width: 25%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; text-align: left">
                            <asp:Label ID="tProduct" CssClass="format" runat="server" Style="font-size: smaller; font-weight: bold;"></asp:Label>
                        </td>
                        <td class="format" style="width: 11%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; text-align: right">
                            <asp:Label ID="tPrice" CssClass="format" runat="server" Style="font-size: 9px; font-weight: bold;"></asp:Label>
                        </td>
                        <td class="format" style="width: 5%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; text-align: center;">
                            <asp:Label ID="tQty" CssClass="format" runat="server" Style="font-size: 9px; font-weight: bold;"></asp:Label>
                        </td>
                        <td class="format" style="width: 11%; border-left: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; text-align: right;">
                            <asp:Label ID="tAmount" CssClass="format" runat="server" Style="font-size: 9px; font-weight: bold;"></asp:Label>
                        </td>
                       <%-- <td class="format" style="width: 10%; border-left: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; text-align: right;">
                            <asp:Label ID="tDiscount" CssClass="format" runat="server" Style="font-size: 9px; font-weight: bold;"></asp:Label>
                        </td>
                        <td class="format" style="width: 11%; border-left: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; text-align: right;">
                            <asp:Label ID="tAmountAfterDiscount" CssClass="format" runat="server" Style="font-size: 9px; font-weight: bold;"></asp:Label>
                        </td>--%>
                    </tr>
                </table>
                <br />
                <table style="width:100%; border:1px solid #000;" cellpadding="5" cellspacing="0">
                    <tbody>
                        <tr>
                        <td rowspan="2" style="border:1px solid #000;">
                            <small>Amount in words:</small><br>
                            <b><label id="DigitToWords" runat="server">Three Thousand only</label></b>
                        </td>
                        <td style="border:1px solid #000;">&nbsp;</td>
                        <td style="border:1px solid #000;">&nbsp;</td>
                        
                    </tr>
                        <tr>
                        <td style="border:1px solid #000;">Net Total:</td>
                        <td id="NetBill" runat="server" style="border:1px solid #000; text-align:right;">0</td>
                    </tr>
                      <%--  <tr>
                        
                        <td style="border:1px solid #000;">Paid:</td>
                        <td id="Rec" runat="server" style="border:1px solid #000; text-align:right;">0</td>
                    </tr>--%>
                </tbody></table>

                <%--<div style="width:100%; margin-top:40px;">
                    <label style="float:left">Authorized Signature ___________________________</label>
                    <label style="float:right">Receiver's Signature ___________________________</label>
                </div>--%>

                    <hr/>
                <table style="width: 100%;">
                    <tbody><tr>
                        
                    </tr>
                </tbody></table>

            </div>
        </div>
    </form>
</body>
</html>
