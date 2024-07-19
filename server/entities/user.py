from typing import Any


class User:
    def __init__(self, name, surname, email, password, register_date):
        self.name = name
        self.surname = surname
        self.email = email
        self.password = password
        self.register_date = register_date

    def __setattr__(self, __name: str, __value: Any) -> None:
        super().__setattr__(__name, __value)
        # ejemplo de uso: self.__setattr__("name", "Juan")

    def __str__(self) -> str:
        return f"name: {self.name}, surname: {self.surname}, email: {self.email}, Password: {self.password}, Fecha de registro: {self.register_date}"


