# API
Проект на ASP.NET Core C# 10.0 с авторизацией через JWT, базой данных SQLite и документацией Swagger.

## Описание
Етот проект деманстрирует базовый REST API:
- Авторизация пользователя через JWT токен
- Хранение данных в SQLite с помощью Entity Framework Core
- Swagger UI для тестирования и документации
- Хэширование паролей через BCrypt


## Установка
Для установки необходимо скачать репозиторий и открыть его в Visual Studio 2022, после
чего необходимо восстановить пакеты NuGet, для этого в меню Visual Studio выбрать "Сервис" -> "Диспетчер пакетов NuGet" -> "Консоль диспетчера пакетов" и в открывшейся консоли выполнить команду:
 
```
    dotnet add package BCrypt.Net-Next --version 4.2.0 &&
    dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 10.0.12 &&
    dotnet add package Microsoft.EntityFrameworkCore --version 10.0.11 &&
    dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.11 &&
    dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 10.0.11 &&
    dotnet add package Swashbuckle.AspNetCore --version 10.2.3

```

для установки покетов по отдельности:
```
    dotnet add package BCrypt.Net-Next --version 4.2.0
```
```
    dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 10.0.12
```
```
    dotnet add package Microsoft.EntityFrameworkCore --version 10.0.11
```
```
    dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.11
```
```
    dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 10.0.11
```
```
    dotnet add package Swashbuckle.AspNetCore --version 10.2.3
```

после установки пакетов необходимо выполнить миграцию базы данных, для этого в консоли диспетчера пакетов выполнить команду:
```
    dotnet ef migrations add InitialCreate
```
```
    dotnet ef database update
```


## Запуск

```
    dotnet run
```

## Документация API

```
    http://localhost:5051/swagger/index.html
```
## Структура проекта
```
    API/
    ├── Controllers/          # Контроллеры API
    ├── DataBase/             # Контекст базы данных
    ├── Migrations/           # Миграции базы данных
    ├── Models/               # Модели данных
    │    │
    │    └── DatebaseModels/  # Модели для базы данны
    │
    ├── Services/             # Сервисы для бизнес-логики
    └── Program.cs            # Точка входа в приложение
```

## Структура таблицы User

| Поле           | Тип данных   | Описание                          |
|----------------|--------------|-----------------------------------|
| Id             | int          | Первичный ключ (PK)               |
| Username       | string       | Имя пользователя                  |
| Email          | string       | Электронная почта (уникальная)    |
| Password       | string       | Хэшированный пароль               |
| Age            | int          | Возраст                           |
| Gender         | string       | Пол                               |
| Weight         | string       | Вес (строка, можно уточнить тип)  |
| Height         | decimal      | Рост                              |
| ActivityLevel  | decimal      | Уровень активности                |
| TargetCalories | string       | Целевая калорийность              |
| Products       | List<Product>| Связь «один ко многим» с продуктами|

## Структура таблицы Product

| Поле      | Тип данных   | Описание                                |
|-----------|--------------|-----------------------------------------|
| Id        | int          | Первичный ключ (PK)                     |
| Name      | string       | Название продукта                       |
| Calories  | decimal      | Калорийность                            |
| Proteins  | decimal      | Белки                                   |
| Fats      | decimal      | Жиры                                    |
| Carbs     | decimal      | Углеводы                                |
| UserId    | int          | Внешний ключ (FK) → Users.Id            |
| User      | User         | Навигационное свойство (связь с User)   |
