package queries

import "fmt"

const (
	host     = "localhost"
	port     = 5446
	user     = "postgres"
	password = "159753"
	dbname   = "Finances"
)

var PsqlInfo = fmt.Sprintf("host=%s port=%d user=%s "+
	"password=%s dbname=%s sslmode=disable",
	host, port, user, password, dbname)
