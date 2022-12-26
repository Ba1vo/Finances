package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func UpdateTransaction(id int, New_tr misc.Transact_full, Old_tr misc.Transact_full) int64 {
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
	var sql_insert1 string
	var sql_insert2 string
	if Old_tr.Param.Categorie == "" {
		sql_insert2 = `a."Categorie" is null`
	} else {
		sql_insert2 = fmt.Sprintf(`a."Categorie" = '%s'`, Old_tr.Param.Categorie)
	}
	if New_tr.Param.Categorie == "" {
		sql_insert1 = "NULL"
	} else {
		sql_insert1 = "'" + New_tr.Param.Categorie + "'"
	}
	query := fmt.Sprintf(`UPDATE "Transactions" AS a
	SET "Name"='%s', "Categorie"= %s, "Amount"=%s, "Year"=%d, "Month"=%d
	WHERE a."Acc_ID" = %d AND a."Name"='%s' AND %s AND a."Amount"=%s AND a."Year"=%d AND a."Month"=%d;`,
		New_tr.Param.Name, sql_insert1, New_tr.Param.Amount, New_tr.Date.Year, New_tr.Date.Month, id, Old_tr.Param.Name, sql_insert2, Old_tr.Param.Amount,
		Old_tr.Date.Year, Old_tr.Date.Month)
	res, err := db.Exec(query)
	kolvo, _ := res.RowsAffected()
	if err != nil {
		fmt.Println(err.Error())
		return -1
	} else {
		return kolvo
	}
}
