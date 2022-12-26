package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func GetCategChart(F_Date misc.Transact_Date, S_Date misc.Transact_Date, id int) []misc.Categorie_Det {
	db, err := sql.Open("postgres", PsqlInfo)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	query := fmt.Sprintf(`SELECT COALESCE(T."Categorie", 'Empty_Cat'), ABS(Sum(T."Amount"))
	FROM public."Transactions" as T
    WHERE T."Acc_ID" = %d AND (T."Amount" < 0) AND make_date(T."Year",T."Month",1) BETWEEN make_date(%d,%d,1) AND make_date(%d, %d , 1)
    GROUP BY T."Categorie"
    ORDER BY T."Categorie" Desc;`, id, F_Date.Year, F_Date.Month, S_Date.Year, S_Date.Month)
	row, err := db.Query(query)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	defer row.Close()
	var out []misc.Categorie_Det
	if row.Next() {
		var Temp misc.Categorie_Det
		var Temp_Sum sql.NullString
		row.Scan(&Temp.Categorie, &Temp_Sum)
		Temp.Sum = NullStringVal(Temp_Sum, "0")
		out = append(out, Temp)
		for row.Next() {
			row.Scan(&Temp.Categorie, &Temp_Sum)
			Temp.Sum = NullStringVal(Temp_Sum, "0")
			out = append(out, Temp)
		}
	} else {
		out = nil
	}
	return out
}
