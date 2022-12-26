package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ba1vo/books/misc"
	"github.com/ba1vo/books/queries"
)

func Summary(w http.ResponseWriter, r *http.Request) {
	var id int
	var d misc.JSON_Sum
	if misc.DecodeJSON(&d, r) {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("Fail")
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
		data := queries.GetSummary(id, d.Date)
		if data == nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("fail1")
			return
		} else {
			output, err := json.Marshal(data) //maybe class to write? send w and data, encode and send
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Println("fail2")
				return
			} else {
				w.Write(output)
				return
			}
		}
	}
}
