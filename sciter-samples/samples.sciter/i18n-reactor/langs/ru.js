﻿{
  "UI language": "Язык интерфейса",
  "Matches"    : "Спичек",   
  "{} matches" : function(n) {
      // plurals in Russian are not that simple as in English.
      if( n == 0 ) 
        return "Спичечный коробок пуст"; 
      else if( n == 1 ) 
        return "В коробке́ только одна спичка"; 
      else if( n >= 10 && n <= 20 ) 
        return n + " спичек в коробке́";
      else switch(n % 10) {
        case 1: return n + " спичка в коробке́"; 
        case 2: case 3: case 4: 
                return n + " спички в коробке́"; 
        default:                 
                return n + " спичек в коробке́";                 
      }
    },
    "first test": "Первый тест",
    "second test": "Второй тест",
    "Title test": "Тестовая подсказка",
    "Cut": "Вырезать",
    "Copy": "Копировать",
    "Paste": "Вставить",
    "Undo": "Отменить",
    "Select All": "Выделить всё",
    "type something": "Печатаем что-нибудь",
}