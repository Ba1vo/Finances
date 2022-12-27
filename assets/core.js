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

document.getElementById("Nameinput").addEventListener("input", function(){Check_cred(this)})
document.getElementById("Passinput").addEventListener("input", function(){Check_cred(this)})
document.getElementById("Name_reg").addEventListener("input", function(){Check_cred(this)})
document.getElementById("Pass_reg").addEventListener("input", function(){Check_cred(this)})
document.getElementById("login").addEventListener("click", Login)
document.getElementById("reg").addEventListener("click", Register)
document.getElementById("to_login").addEventListener("click", Show_login)
document.getElementById("to_reg").addEventListener("click", Show_reg)
if( (sessionStorage.getItem("name") != null) && (sessionStorage.getItem("pass") != null)){
    GetSummary()
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