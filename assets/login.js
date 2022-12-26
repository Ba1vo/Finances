class Tr_Date{
    constructor(str){
        let dates = str.split('-') 
        this.Year = Number(dates[0]);
        this.Month = Number(dates[1]);
    }
}
class Creds{
    constructor(Nickname, Password){
        this.Nickname = Nickname;
        this.Password = Password;
    }
}
class Tr_Param{
    constructor(Name, Categorie, Amount){
        this.Name = Name;
        this.Categorie = Categorie;
        this.Amount = Amount;
    }
}
let coll = document.getElementsByClassName("collapsible");
document.getElementById("date_input").addEventListener("change", GetSummary)
document.getElementById("add_tr_btn").addEventListener("click", Add_tr)
document.getElementById("remove_tr_btn").addEventListener("click", Delete)

document.getElementById("tr_name").addEventListener("input", Hide_del)
document.getElementById("tr_categorie").addEventListener("input", Hide_del)
document.getElementById("tr_amount").addEventListener("input", Hide_del)
document.getElementById("tr_date").addEventListener("input", Hide_del)

document.getElementById("tr_name").addEventListener("change", Check_name)
document.getElementById("tr_categorie").addEventListener("change", Check_categorie)
document.getElementById("tr_amount").addEventListener("change", Check_amount)

document.getElementById("first_date").addEventListener("change", Chart_date)
document.getElementById("second_date").addEventListener("change", Chart_date)

document.getElementById("Nameinput").addEventListener("input", function(){Check_cred(this)})
document.getElementById("Passinput").addEventListener("input", function(){Check_cred(this)})
document.getElementById("Name_reg").addEventListener("input", function(){Check_cred(this)})
document.getElementById("Pass_reg").addEventListener("input", function(){Check_cred(this)})

document.getElementById("to_login").addEventListener("click", Show_login)
document.getElementById("to_reg").addEventListener("click", Show_reg)
let date_in = new Date()
document.getElementById("date_input").value = date_in.getFullYear() +"-"+(date_in.getMonth()+1)
RefreshCollapsibles()

let response;
let clicked_tr;
if( (sessionStorage.getItem("name") != null) && (sessionStorage.getItem("pass") != null)){
    GetSummary()
}

function RefreshCollapsibles(){
    for (let i = 0; i < coll.length; i++) {
        coll[i].removeEventListener("click",Collapse);
        coll[i].addEventListener("click", Collapse);
    }
}

function Collapse(){
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
}

function Login()
{
    let name = document.getElementById("Nameinput").value;
	let pass = document.getElementById("Passinput").value; 
    let datas = new Creds(name, pass)
    console.log(datas)
    $.ajax({
        url: "http://localhost:2406/login",
        method: 'POST',
        data : JSON.stringify(datas),
        dataType: 'json',
        statusCode:{
            400: function(){
                document.getElementById("wrong_alert").style.display = "inline"
            },
            200: function(){
                sessionStorage.setItem("name", name)
                sessionStorage.setItem("pass", pass)
                document.getElementById("wrong_alert").style.display = "none"
                GetSummary();
            }
        },
    });
}

function GetSummary(){
    let name = sessionStorage.getItem("name")
	let pass = sessionStorage.getItem("pass")
    let names = document.getElementsByClassName("nick_outp")
    for (let i = 0; i< names.length; i++) names[i].innerHTML = name;
    let date_str = document.getElementById("date_input").value;
    let date = new Tr_Date(date_str)
    let cred = new Creds(name, pass)
    let datas = {
        Creds: cred,
        Date: date
    }
    $.ajax({
        url: "http://localhost:2406/summary",
        method: 'POST',
        data : JSON.stringify(datas),
        dataType: 'json',
        success: function(data) {
            Fill_Summary(data);
        },
    });
}

function Fill_Summary(transacts){
    total_inc = document.getElementById("total_income")
    total_exp = document.getElementById("total_expenses")
    document.getElementById("log_page").style.display = "none"
    document.getElementById("reg_page").style.display = "none"
    document.getElementById("Charts_page").style.display = "none"
    document.getElementById("summary_page").style.display = "block"
    total_inc.innerHTML = '<button type="button" class="collapsible"> </button> <div class="content" id="income_detail"> </div> <br> <button type="button" id="add_pos" onclick="Add_Transact(true)">Добавить доход</button>'
    total_exp.innerHTML = '<button type="button" class="collapsible"> </button> <div class="content" id="expenses_detail"> </div> <br> <button type="button" id="add_neg" onclick="Add_Transact(false)">Добавить расход</button>'
    console.log(transacts)
    if (transacts === false){
        console.log("keek")
        sessionStorage.removeItem("name")
        sessionStorage.removeItem("pass")
        document.getElementById("log_page").style.display = "block"
        document.getElementById("summary_page").style.display = "none"
    } else if (transacts.length == 0){
        total_inc.innerHTML ="Всего "+(0) + total_inc.innerHTML;
        document.getElementById("total_expenses").innerHTML ="Всего "+(0) + document.getElementById("total_expenses").innerHTML;
        document.getElementById("Surplus").innerHTML =""+(0)
    } else{
        response = transacts
        let i = 0;
        let income_col = document.getElementById("income_detail");
	    let expenses_col = document.getElementById("expenses_detail");
        for (i = 0; i < response.length; i++) {
            if(Number(response[i].Amount)< 0) break;
        }
        let arr1 = response.slice(0, i)
        let arr2 = response.slice(i, response.length)
        let income = Fill_Categorie(total_inc, income_col, arr1,0)
        let expenses = Fill_Categorie(total_exp, expenses_col, arr2, i)
        let surplus = Number(income)+Number(expenses)
        surplus = surplus.toFixed(2)
        document.getElementById("Surplus").innerHTML =""+(surplus);
        RefreshCollapsibles()
    }
}

function Fill_Categorie(total_div, detail_div, array, counter){
    let total = 0;
    if (array.length>0){
    let curr_categor = array[0].Categorie;
    if (curr_categor != ""){
        detail_div.innerHTML += "Категории: <br>"
    }
    let categor_total = 0;
    let html_insert = "";
    for (i = 0; i<array.length; i++){
        let transact = array[i] 
        if (transact.Categorie != curr_categor){
            detail_div.innerHTML += '<span class="categorie">'+ curr_categor+ ": "+ categor_total + ' <button type="button" class="collapsible"></button> <div class="content">' 
            +"Переводы категории " + curr_categor + html_insert +'</div> </span> <br>';
            categor_total = 0;
            curr_categor = transact.Categorie
            html_insert = `<div class="sing_trnsct" id="${counter}" onclick="redact_trnsct(this.id)"> ${transact.Name}: ${transact.Amount} </div>`
        } else if (transact.Categorie == curr_categor){
            html_insert += `<div class="sing_trnsct" id="${counter}" onclick="redact_trnsct(this.id)"> ${transact.Name}: ${transact.Amount} </div>`
        } 
        categor_total+=Number(transact.Amount)
        total += Number(transact.Amount)
        counter+=1;
    }
    if(curr_categor == ""){
        detail_div.innerHTML += '<div>' +"Транзакции без категорий: " + html_insert+'<div>'
    } else{
        detail_div.innerHTML += '<span class="categorie">'+ curr_categor+ ": "+ categor_total + ' <button type="button" class="collapsible"></button> <div class="content">' 
        +"Переводы категории " + curr_categor + html_insert +'</div> </span> <br>';
    }
    }
    total = total.toFixed(2);
    total_div.innerHTML ="Всего "+(total) + total_div.innerHTML;
    return total
}

function Exit(){
    sessionStorage.removeItem("name")
    sessionStorage.removeItem("pass")
    document.getElementById("log_page").style.display = "block"
    document.getElementById("summary_page").style.display = "none"
}

function Add_Transact(sign){
    clicked_tr = -1;
    document.getElementById("remove_tr_btn").style.display = "none";
    document.getElementById("blur").style.display = "block"
    document.getElementById("crest").style.display = "block"
    document.getElementById("add_dial").style.display = "block"
    document.getElementById("addpage_name").innerHTML = "Добавить перевод"
    document.getElementById("add_tr_btn").innerHTML = "Добавить перевод"
    document.getElementById("tr_name").value = ""
    document.getElementById("tr_categorie").value = ""
    if(!sign){
        document.getElementById("tr_amount").value = "-"
    } else document.getElementById("tr_amount").value = "";
    document.getElementById("tr_date").value =  document.getElementById("date_input").value
    document.getElementById("add_tr_btn").action_par = "add"
}

function redact_trnsct(id){
    document.getElementById("remove_tr_btn").style.display = "";
    clicked_tr = Number(id);
    console.log(clicked_tr)
    document.getElementById("addpage_name").innerHTML = "Редактировать перевод"
    document.getElementById("add_tr_btn").innerHTML = "Изменить перевод"
    document.getElementById("blur").style.display = "block"
    document.getElementById("crest").style.display = "block"
    document.getElementById("add_dial").style.display = "block"
    document.getElementById("tr_name").value = response[id].Name
    document.getElementById("tr_categorie").value = response[id].Categorie
    document.getElementById("tr_amount").value = response[id].Amount
    document.getElementById("tr_date").value =  document.getElementById("date_input").value
    document.getElementById("add_tr_btn").action_par = "update"
}

function Exit_red(){
    document.getElementById("blur").style.display = "none"
    document.getElementById("crest").style.display = "none"
    document.getElementById("add_dial").style.display = "none"
    GetSummary()
}

function Add_tr(evt){
    if(document.getElementById("tr_name").checkValidity() &&
    document.getElementById("tr_categorie").checkValidity() &&
    document.getElementById("tr_amount").checkValidity()){
    let nickname = sessionStorage.getItem("name")
	let password = sessionStorage.getItem("pass")
    let tr_name = document.getElementById("tr_name").value;
    let tr_categorie = document.getElementById("tr_categorie").value;
    let tr_amount= document.getElementById("tr_amount").value;
    let date_str = document.getElementById("tr_date").value;
    let action = evt.currentTarget.action_par 
    let new_date = new Tr_Date(date_str)
    let new_param = new Tr_Param(tr_name, tr_categorie, tr_amount)
    let New_trnsct = {
        Param: new_param,
        Date: new_date
    };
    let cred = new Creds(nickname, password)
    if (action == "update"){
        console.log("update")
        let Old_Tr = response[clicked_tr];
        date_str = document.getElementById("date_input").value;
        let Old_date = new Tr_Date(date_str);
        let Old_Param = new Tr_Param(Old_Tr.Name, Old_Tr.Categorie, Old_Tr.Amount)
        let Old_trnsct = {
            Param: Old_Param, 
            Date: Old_date
        }
        let datas = {
            Creds: cred,  
            New_tr: New_trnsct, 
            Old_tr: Old_trnsct
        };
        $.ajax({
            url: "http://localhost:2406/update", 
            method: 'PUT',
            data : JSON.stringify(datas),
            dataType: 'json',
            statusCode:{
                400: function(){
                    //document.getElementById("taken_alert").style.display = "inline"
                },
                204: function(){
                     hide_dial()
                    console.log("IZM uspeshno")
                }
            },  
            });
    } else if(action == "add"){
        console.log("add")
        let datas = {
            Creds: cred,
            Transact: New_trnsct
        };
        $.ajax({
            url: "http://localhost:2406/add", 
            method: 'PUT',
            data : JSON.stringify(datas),
            dataType: 'json',
            statusCode:{
                400: function(){
                    //document.getElementById("taken_alert").style.display = "inline"
                },
                204: function(){
                     hide_dial()
                    console.log("DOBAVLENO uspeshno")
                }
            },  
            });
    }
    GetSummary()
}
}

function Delete(){ 
    let nickname = sessionStorage.getItem("name")
	let password = sessionStorage.getItem("pass")
    console.log(response)
    let tr = response[clicked_tr]
    let date_str = document.getElementById("date_input").value;
    let date = new Tr_Date(date_str)
    let param = new Tr_Param(tr.Name, tr.Categorie, tr.Amount)
    let cred = new Creds(nickname, password)
    let datas = {
        Creds: cred, 
        Transact: {
            Date: date,
            Param: param
        }
    };
    $.ajax({
        url: "http://localhost:2406/delete", 
        method: 'DELETE',
        data : JSON.stringify(datas),
        statusCode:{
            400: function(){
                //document.getElementById("taken_alert").style.display = "inline"
            },
            204: function(){
                 hide_dial()
                console.log("udaleno uspeshno")
            }
        },  
        });
    GetSummary()
}

function Hide_del(){ 
    if (clicked_tr > -1){
    let name = response[clicked_tr].Name
    let categorie = response[clicked_tr].Categorie
    let amount= response[clicked_tr].Amount
    let date = document.getElementById("date_input").value;
    let name_new = document.getElementById("tr_name").value;
    let categorie_new = document.getElementById("tr_categorie").value;
    let amount_new= document.getElementById("tr_amount").value;
    let date_new = document.getElementById("tr_date").value;
    if (name != name_new || categorie!= categorie_new || amount!= amount_new || date!= date_new){
        document.getElementById("remove_tr_btn").disabled = true;
    } else {
        document.getElementById("remove_tr_btn").disabled = false;
    }
    }
}

function Get_Charts(){
    document.getElementById("Charts_page").style.display = "block"
    document.getElementById("summary_page").style.display = "none"
    document.getElementById("log_page").style.display = "none"
    let first_Date = document.getElementById("first_date").value
    let second_Date = document.getElementById("second_date").value
    if(first_Date != '' && second_Date != '' && first_Date < second_Date){
    let nickname = sessionStorage.getItem("name")
	let password = sessionStorage.getItem("pass")
    let f_Date = new Tr_Date(first_Date)
    let s_Date = new Tr_Date(second_Date)
    let cred = new Creds(nickname, password)
    let datas = {
        Creds: cred,
        F_Date: f_Date,
        s_Date: s_Date
    };
    $.ajax({
        url: "http://localhost:2406/charts",
        method: 'POST',
        data : JSON.stringify(datas),
        dataType: 'json',
        success: function(data, textStatus ,xhr) {

            if(textStatus == "success"){
                Show_Charts(data)
            } else {

                alert("oshibka")
            }
            },
        });
    }
}

function Show_Charts(chart_data){
    console.log(chart_data)
    let Categorie_det = chart_data.Categorie_Det 
    let Month_det = chart_data.Month_Det
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(function(){
    if(Month_det != null){
        let data = [ ['Date', 'Positive', 'Negative'], ];
        for(let i=0; i<Month_det.length; i++ ) {
            data.push([Month_det[i].Date,Number(Month_det[i].Pos),Number(Month_det[i].Neg)])
        }
        let options = {title:'Доходы и расходы за промежуток'};
        data = google.visualization.arrayToDataTable(data)
        let chart = new google.visualization.ColumnChart(document.getElementById('col_chart'));
        chart.draw(data, options);
    } else{ 
        document.getElementById('col_chart').innerHTML = "У вас нет транзакций за этот промежуток"
    }
    if(Categorie_det != null){
        let data = [ ['Categorie', 'Neg'], ];
        for(let i=0; i<Categorie_det.length; i++ ) data.push([Categorie_det[i].Categorie, Number(Categorie_det[i].Sum)])        
        let options = { title:'Расходы по категориям' };
        data = google.visualization.arrayToDataTable(data)
        let chart = new google.visualization.PieChart(document.getElementById('pie_chart'));
        chart.draw(data, options);
    } else{ 
        document.getElementById('pie_chart').innerHTML = "У вас нет транзакций с категориями за этот промежуток"
    }
    });
}

function Register(){
    let name = document.getElementById("Name_reg").value;
	let pass = document.getElementById("Pass_reg").value; 
    let datas = new Creds(name, pass)
    $.ajax({
        url: "http://localhost:2406/AddUser", 
        method: 'POST',
        data : JSON.stringify(datas),
        dataType: 'json',
        statusCode:{
            400: function(){
                document.getElementById("taken_alert").style.display = "inline"
            },
            200: function(){
                document.getElementById("taken_alert").style.display = "none"
                sessionStorage.setItem("name", name)
                sessionStorage.setItem("pass", pass)
                GetSummary();
            }
        },  
        });
}

function Chart_date(){
    let f_Date = document.getElementById("first_date")
    let s_Date = document.getElementById("second_date")
    console.log("Hello")
    if (f_Date.value != "") {
        s_Date.min = f_Date.value
    }
    if (s_Date.value != "") {
        f_Date.max = s_Date.value
    }
    if(f_Date.value && s_Date.value && f_Date.value < s_Date.value){ 
        document.getElementById("show_chrt").disabled = false
    }
}

function Check_name(){
    let tr_name = document.getElementById("tr_name").value; //CHECK HOW IT HANDLES ADD NEW DIV
    let exp_name = /^(\p{Script=Cyrillic}|\w){1,40}$/u;
    if (!exp_name.test(tr_name)){
        document.getElementById("tr_name").setCustomValidity("От 1 до 40 симв");
    } else{
        document.getElementById("tr_name").setCustomValidity("")
    }
}

function Check_categorie(){
    let tr_categorie = document.getElementById("tr_categorie").value
    let exp_cat = /^(\p{Script=Cyrillic}|\w){0,40}$/u;
    if (!exp_cat.test(tr_categorie)){
        document.getElementById("tr_categorie").setCustomValidity("От 1 до 40 симв");
    }else{
        document.getElementById("tr_categorie").setCustomValidity("")
    }
}

function Check_amount(){
    let tr_amount= document.getElementById("tr_amount").value;
    let exp_amount = /^-?\d{1,10}(\.\d{1,2})?$/u
    if (!exp_amount.test(tr_amount)){
        document.getElementById("tr_amount").setCustomValidity("Формат: xxxxxxxxxx.xx")
    } else{
        document.getElementById("tr_amount").setCustomValidity("")
    }
}

function Check_cred(elem){
    if (elem.id == "Nameinput" || elem.id == "Passinput"){
        document.getElementById("login").disabled = !(Reg_Check("Nameinput") && Reg_Check("Passinput"))
    } else document.getElementById("reg").disabled = !(Reg_Check("Name_reg") && Reg_Check("Pass_reg"))
    if (Reg_Check(elem.id)){
        elem.style.borderColor = ""
        Switch_State(elem.id, false)
    } else {
        console.log("set")
        elem.style.borderColor = "red"
        Switch_State(elem.id, true)
    }
}

function Reg_Check(id){
    let reg_exp = /^(\p{Script=Cyrillic}|\w){5,40}$/u;
    let element = document.getElementById(id);
    return reg_exp.test(element.value)
}

function Switch_State(id, state){
    let arg = ""
    console.log(id)
    if (state) arg = "block"
    else arg = "none"
    switch (id) {
        case "Nameinput":
            document.getElementById("name_alert").style.display = arg
            break;
        case "Passinput":
            document.getElementById("pass_alert").style.display = arg
            break;
        case "Name_reg":
            document.getElementById("name_alert_r").style.display = arg
            break;
        case "Pass_reg":
            document.getElementById("pass_alert_r").style.display = arg
            break;
        default:
            break;
    }

}

function Show_reg(){
    document.getElementById("log_page").style.display = "none"
    document.getElementById("reg_page").style.display = "block"
}
function Show_login(){
    document.getElementById("log_page").style.display = "block"
    document.getElementById("reg_page").style.display = "none"
}
function hide_dial(){
    document.getElementById("blur").style.display = "none"
    document.getElementById("crest").style.display = "none"
    document.getElementById("add_dial").style.display = "none"
}