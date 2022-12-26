package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func InsertUser(Creds misc.Credentials) bool {
	db, err := sql.Open("postgres", PsqlInfo)
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println(Creds)
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
	}
	query := fmt.Sprintf(`INSERT INTO public."Accounts" (
		"Name", "Password")
		VALUES ('%s', '%s');`, Creds.Nickname, Creds.Password)
	_, err = db.Exec(query)
	if err != nil {
		fmt.Println(err.Error())
		return false
	} else {
		return true
	}
}
