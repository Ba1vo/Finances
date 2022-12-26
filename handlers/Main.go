package handlers

import (
	"fmt"
	"net/http"
	"text/template"
)

func Main(w http.ResponseWriter, r *http.Request) {
	fmt.Println("inuse")
	var tpl *template.Template
	tpl, _ = template.ParseFiles("assets/login.html")
	tpl.ExecuteTemplate(w, "login.html", nil)
}
