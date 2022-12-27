document.getElementById("first_date").addEventListener("change", Chart_date)
document.getElementById("second_date").addEventListener("change", Chart_date)

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