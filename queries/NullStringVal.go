package queries

import "database/sql"

func NullStringVal(str sql.NullString, replace string) string {
	if str.Valid {
		return str.String
	} else {
		return replace
	}
}
