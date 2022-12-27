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
let date_in = new Date()
document.getElementById("date_input").value = date_in.getFullYear() +"-"+(date_in.getMonth()+1)
RefreshCollapsibles()
let response;
let clicked_tr;

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

function Exit(){
    sessionStorage.removeItem("name")
    sessionStorage.removeItem("pass")
    document.getElementById("log_page").style.display = "block"
    document.getElementById("summary_page").style.display = "none"
    document.getElementById("Charts_page").style.display = "none"
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

function Check_name(){
    let tr_name = document.getElementById("tr_name").value;
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

function hide_dial(){
    document.getElementById("blur").style.display = "none"
    document.getElementById("crest").style.display = "none"
    document.getElementById("add_dial").style.display = "none"
}
