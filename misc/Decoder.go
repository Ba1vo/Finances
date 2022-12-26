package misc

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Transact_Par struct {
	Name      string
	Categorie string
	Amount    string
}
type Transact_Date struct {
	Year  int
	Month int
}
type Credentials struct {
	Nickname string
	Password string
}
type Sum_Data struct {
	Transactions []Transact_Par
}
type Transact_full struct {
	Param Transact_Par
	Date  Transact_Date
}
type Transact_cred struct {
	Creds    Credentials
	Transact Transact_full
}
type Transact_Modify struct {
	Creds  Credentials
	New_tr Transact_full
	Old_tr Transact_full
}
type JSON_Sum struct {
	Creds Credentials
	Date  Transact_Date
}
type Categorie_Det struct {
	Categorie string
	Sum       string
}
type Month_Det struct {
	Date string
	Pos  string
	Neg  string
}
type Chart_Data struct {
	Month_Det     []Month_Det
	Categorie_Det []Categorie_Det
}
type JSON_Charts struct {
	Creds  Credentials
	F_Date Transact_Date
	S_Date Transact_Date
}

type Decodable interface {
	*JSON_Sum | *Credentials | *Transact_Modify | *JSON_Charts | *Transact_cred
}

type Writable interface {
}

func DecodeJSON[JSON Decodable](obj JSON, r *http.Request) bool {
	err := json.NewDecoder(r.Body).Decode(obj)
	if err != nil {
		fmt.Println(err.Error())
		return true
	}
	return false
}
