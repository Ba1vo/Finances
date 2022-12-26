package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func DeleteTransaction(id int, Trnsct misc.Transact_full) int64 {
	var sql_insert string
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
	if Trnsct.Param.Categorie == "" {
		sql_insert = `a."Categorie" is null`
	} else {
		sql_insert = fmt.Sprintf(`a."Categorie" = '%s'`, Trnsct.Param.Categorie)
	}
	query := fmt.Sprintf(`DELETE FROM "Transactions" AS a
	WHERE a."Acc_ID" = %d AND a."Name"='%s' AND %s AND a."Amount"= %s AND a."Year"=%d AND a."Month"=%d;`,
		id, Trnsct.Param.Name, sql_insert, Trnsct.Param.Amount, Trnsct.Date.Year, Trnsct.Date.Month)
	fmt.Println(query)
	res, err := db.Exec(query)
	if err != nil {
		fmt.Println(err.Error()) //w.WriteHeader(http.StatusInternalServerError)
		return -1
	}
	kolvo, _ := res.RowsAffected()
	return kolvo
}
