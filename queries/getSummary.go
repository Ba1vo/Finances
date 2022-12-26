package queries

import (
	"database/sql"
	"fmt"

	"github.com/ba1vo/books/misc"
	_ "github.com/lib/pq"
)

func GetSummary(id int, Date misc.Transact_Date) []misc.Transact_Par {
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
	query := fmt.Sprintf(`SELECT cast(t."Name" as varchar), cast(t."Categorie" as text), cast(t."Amount" as text)
	FROM "Transactions" AS t
	WHERE t."Year" = %d AND t."Month" = %d AND t."Acc_ID" = %d
	ORDER BY (t."Amount" > 0) DESC, t."Categorie" DESC NULLS LAST, t."Name" DESC;`, Date.Year, Date.Month, id)
	row, err := db.Query(query)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	defer row.Close()
	var Output []misc.Transact_Par
	if row.Next() {
		var Temp misc.Transact_Par
		var Temp_string sql.NullString
		row.Scan(&Temp.Name, &Temp_string, &Temp.Amount)
		Temp.Categorie = NullStringVal(Temp_string, "")
		Output = append(Output, Temp)
		for row.Next() {
			row.Scan(&Temp.Name, &Temp_string, &Temp.Amount)
			Temp.Categorie = NullStringVal(Temp_string, "")
			Output = append(Output, Temp)
		}
		return Output
	} else {
		Output = make([]misc.Transact_Par, 0)
		return Output
	}
}
