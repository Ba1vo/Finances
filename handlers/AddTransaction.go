package handlers

import (
	"fmt"
	"net/http"

	"github.com/ba1vo/books/misc"
	"github.com/ba1vo/books/queries"
	"github.com/ba1vo/books/regchecks"
)

func Add_Transaction(w http.ResponseWriter, r *http.Request) {
	var id int
	var d misc.Transact_cred
	if misc.DecodeJSON(&d, r) {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("whoops1")
		return
	}
	if !(regchecks.Check_Date(d.Transact.Date) && regchecks.Check_Creds(d.Creds) && regchecks.Check_Parameters(d.Transact.Param)) {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("whoops")
		return
	}
	id = queries.Auth(regchecks.Inject_Creds(d.Creds))
	switch id {
	case -1: //not found
		fmt.Println("fail")
		w.WriteHeader(http.StatusBadRequest)
	case -2: //error
		fmt.Println("fail")
		w.WriteHeader(http.StatusBadRequest)
	default:
		fmt.Println("succ")
		d.Transact.Param = regchecks.Inject_Transaction(d.Transact.Param)
		kolvo := queries.InsertTransaction(id, d.Transact)
		if kolvo == -1 {
			w.WriteHeader(http.StatusInternalServerError)
		} else {
			w.WriteHeader(http.StatusNoContent)
		}
	}
}
