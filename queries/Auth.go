package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func Auth(Cred misc.Credentials) int {
	var id int
	db, err := sql.Open("postgres", PsqlInfo)
	if err != nil {
		fmt.Println(err.Error())
		return -2
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
		return -2
	}
	query := fmt.Sprintf(`SELECT a."ID"
	FROM "Accounts" AS a
	WHERE a."Name" = '%s' AND a."Password" = '%s';`, Cred.Nickname, Cred.Password)
	row, err := db.Query(query)
	if err != nil {
		fmt.Println(err.Error())
		return -2
	}
	defer row.Close()
	if row.Next() {
		row.Scan(&id)
		return id
	} else {
		return -1
	}
}
