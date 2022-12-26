package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func InsertTransaction(id int, Trnsct misc.Transact_full) int64 {
	db, err := sql.Open("postgres", PsqlInfo)
	if err != nil {
		fmt.Println(err.Error())
		return -1
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
		return -1
	}
	query := fmt.Sprintf(`INSERT INTO public."Transactions"(
		"Acc_ID", "Name", "Categorie", "Amount", "Year", "Month")
		VALUES (%d, '%s', NULLIF('%s',''), %s, %d, %d);`, id, Trnsct.Param.Name, Trnsct.Param.Categorie, Trnsct.Param.Amount, Trnsct.Date.Year, Trnsct.Date.Month)
	res, err := db.Exec(query)
	kolvo, _ := res.RowsAffected()
	if err != nil {
		return -1
	} else {
		return kolvo
	}
}
