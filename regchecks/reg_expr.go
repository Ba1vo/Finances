package regchecks

import (
	"fmt"
	"regexp"

	"github.com/ba1vo/books/misc"
)

func Check_Date(date misc.Transact_Date) bool {
	result := (date.Year < 2200 && date.Year > 1920 && date.Month <= 12 && date.Month > 0)
	fmt.Println("date")
	fmt.Println(result)
	return result
}

func Check_Parameters(parameters misc.Transact_Par) bool {
	Name_exp := regexp.MustCompile(`^(\p{L}|\w){1,40}$`)
	Cat_exp := regexp.MustCompile(`^(\p{L}|\w){0,40}$`)
	Amount_exp := regexp.MustCompile(`^-?\d{1,10}(\.\d{1,2})?$`) //-0 ?
	result := (Name_exp.MatchString(parameters.Name) && Cat_exp.MatchString(parameters.Categorie) &&
		Amount_exp.MatchString(parameters.Amount))
	return result
}

func Check_Creds(creds misc.Credentials) bool {
	Cred_exp := regexp.MustCompile(`^(\p{L}|\w){5,20}$`)
	result := (Cred_exp.MatchString(creds.Nickname) && Cred_exp.MatchString(creds.Password))
	fmt.Println("creds")
	fmt.Println(result)
	return result
}
