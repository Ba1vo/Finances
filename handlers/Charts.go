package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ba1vo/books/misc"
	"github.com/ba1vo/books/queries"
	"github.com/ba1vo/books/regchecks"
)

func Charts(w http.ResponseWriter, r *http.Request) {
	var id int
	var d misc.JSON_Charts
	if misc.DecodeJSON(&d, r) {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if !(regchecks.Check_Creds(d.Creds) && regchecks.Check_Date(d.F_Date) && regchecks.Check_Date(d.S_Date)) {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	id = queries.Auth(d.Creds)
	switch id {
	case -1: //not found
		fmt.Println("fail")
		w.WriteHeader(http.StatusBadRequest)
	case -2: //error
		fmt.Println("fail")
		w.WriteHeader(http.StatusBadRequest)
	default:
		fmt.Println("succ")
		var out misc.Chart_Data
		out.Month_Det = queries.GetTotalChart(d.F_Date, d.S_Date, id)
		out.Categorie_Det = queries.GetCategChart(d.F_Date, d.S_Date, id)
		output, err := json.Marshal(out)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		} else {
			w.Write(output)
			return
		}
	}
}
