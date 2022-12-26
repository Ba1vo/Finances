package regchecks

import "github.com/ba1vo/books/misc"

var symbols = [...]rune{'/', '*', ';', '=', '"', '\'', '-', '\\', '#', '(', ')'}

func Inject_Transaction(trnsct misc.Transact_Par) misc.Transact_Par {
	trnsct.Name = injectcheck(trnsct.Name)
	trnsct.Categorie = injectcheck(trnsct.Categorie)
	return trnsct
}

func Inject_Creds(creds misc.Credentials) misc.Credentials {
	creds.Nickname = injectcheck(creds.Nickname)
	creds.Password = injectcheck(creds.Password)
	return creds
}

func injectcheck(str string) string {
	var strOut []rune
	for _, char := range str {
		for _, symbol := range symbols {
			if char == symbol {
				strOut = append(strOut, '\\')
				break
			}
		}
		strOut = append(strOut, char)
	}
	return string(strOut)
}
