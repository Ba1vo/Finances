package handlers

import (
	"fmt"
	"net/http"

	"github.com/ba1vo/books/misc"
	"github.com/ba1vo/books/queries"
)

func Modify_Transaction(w http.ResponseWriter, r *http.Request) {
	var id int
	var d misc.Transact_Modify
	if misc.DecodeJSON(&d, r) {
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
		kolvo := queries.UpdateTransaction(id, d.New_tr, d.Old_tr)
		if kolvo == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(nil)
		} else if kolvo > 0 {
			w.WriteHeader(http.StatusNoContent)
			w.Write(nil)
		}
	}
}
