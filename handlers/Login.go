package handlers

import (
	"fmt"
	"net/http"

	"github.com/ba1vo/books/misc"
	"github.com/ba1vo/books/queries"
	"github.com/ba1vo/books/regchecks"
)

func Login(w http.ResponseWriter, r *http.Request) {
	var d misc.Credentials
	var id int
	if misc.DecodeJSON(&d, r) {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if !(regchecks.Check_Creds(d)) {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	id = queries.Auth(d)
	switch id {
	case -1: //not found
		fmt.Println("fail")
		w.WriteHeader(http.StatusBadRequest)
	case -2: //error
		fmt.Println("fail")
		w.WriteHeader(http.StatusBadRequest)
	default:
		fmt.Println("succ")
		w.WriteHeader(http.StatusOK)
	}

}
