package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func GetTotalChart(F_Date misc.Transact_Date, S_Date misc.Transact_Date, id int) []misc.Month_Det {
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
	query := fmt.Sprintf(`SELECT  
    T."Year" ||'-'|| T."Month" as Date,
    sum(case when T."Amount">0 then T."Amount" end) as Pos,
    sum(case when T."Amount"<0 then ABS(T."Amount") end) as Neg
	FROM public."Transactions" as T
    WHERE T."Acc_ID" = %d AND make_date(T."Year",T."Month",1) BETWEEN make_date(%d,%d,1) AND make_date(%d, %d , 1) 
    GROUP BY T."Year", T."Month"
    ORDER BY T."Year" ASC, T."Month" ASC;`, id, F_Date.Year, F_Date.Month, S_Date.Year, S_Date.Month)
	row, err := db.Query(query)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	defer row.Close()
	var out []misc.Month_Det
	if row.Next() {
		var Temp misc.Month_Det
		var Temp_Pos sql.NullString
		var Temp_Neg sql.NullString
		row.Scan(&Temp.Date, &Temp_Pos, &Temp_Neg)
		Temp.Pos = NullStringVal(Temp_Pos, "0")
		Temp.Neg = NullStringVal(Temp_Neg, "0")
		out = append(out, Temp)
		for row.Next() {
			row.Scan(&Temp.Date, &Temp_Pos, &Temp_Neg)
			Temp.Pos = NullStringVal(Temp_Pos, "0")
			Temp.Neg = NullStringVal(Temp_Neg, "0")
			out = append(out, Temp)
		}
	} else {
		out = nil
	}
	return out
}
