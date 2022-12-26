package main

import (
	"net/http"

	"github.com/ba1vo/books/handlers"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	FileDirectory := http.Dir("./assets/")
	FileHandler := http.StripPrefix("/assets/", http.FileServer(FileDirectory))
	r.HandleFunc("/login", handlers.Login).Methods("POST")
	r.HandleFunc("/summary", handlers.Summary).Methods("POST")
	r.HandleFunc("/charts", handlers.Charts).Methods("POST")
	r.HandleFunc("/AddUser", handlers.AddUser).Methods("POST")
	r.HandleFunc("/add", handlers.Add_Transaction).Methods("PUT")
	r.HandleFunc("/update", handlers.Modify_Transaction).Methods("PUT")
	r.HandleFunc("/delete", handlers.Delete_Transaction).Methods("DELETE")
	r.HandleFunc("/MAIN", handlers.Main).Methods("GET")
	r.PathPrefix("/assets/").Handler(FileHandler).Methods("GET")
	http.ListenAndServe(":2406", r)
}
