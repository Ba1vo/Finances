package handlers

import (
	"fmt"
	"net/http"

	"github.com/ba1vo/books/misc"
	"github.com/ba1vo/books/queries"
	"github.com/ba1vo/books/regchecks"
)

func Delete_Transaction(w http.ResponseWriter, r *http.Request) {
	var id int
	var d misc.Transact_cred
	if misc.DecodeJSON(&d, r) {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if !(regchecks.Check_Creds(d.Creds) && regchecks.Check_Parameters(d.Transact.Param) && regchecks.Check_Date(d.Transact.Date)) {
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
		kolvo := queries.DeleteTransaction(id, d.Transact)
		switch kolvo {
		case -1:
			w.WriteHeader(http.StatusInternalServerError)
			return
		case 0:
			return //no such trnsct
		default:
			w.WriteHeader(http.StatusNoContent)
			fmt.Println("deleted")
			return
		}
	}
}
