package handlers

import (
	"fmt"
	"net/http"

	"github.com/ba1vo/books/misc"
	"github.com/ba1vo/books/queries"
	"github.com/ba1vo/books/regchecks"
)

func AddUser(w http.ResponseWriter, r *http.Request) {
	var d misc.Credentials
	if misc.DecodeJSON(&d, r) {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if !(regchecks.Check_Creds(d)) {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	fmt.Println(d)
	if !(queries.InsertUser(d)) {
		w.WriteHeader(http.StatusBadRequest)
	} else {
		w.WriteHeader(http.StatusOK)
		w.Write(nil)
	}
}
