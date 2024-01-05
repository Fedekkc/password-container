import unittest
from unittest.mock import patch, MagicMock
from ..app import login

class TestLogin(unittest.TestCase):
    @patch('app.userExists')
    @patch('app.cursor')
    def test_login(self, mock_cursor, mock_userExists):
        # Crear un objeto de usuario ficticio
        user = MagicMock()
        user.email = 'asd'
        user.password = 'asd'

        # Configurar los mocks
        mock_userExists.return_value = False
        mock_cursor.execute.return_value = None
        mock_cursor.fetchall.return_value = [('hashed_password',)]

        # Llamar a la función de login
        result = login(user)

        # Verificar que se llamó a los métodos correctos
        mock_userExists.assert_called_once_with(user.email)
        mock_cursor.execute.assert_called_once_with("SELECT `password` FROM `users` WHERE email = %s", (user.email,))
        mock_cursor.fetchall.assert_called_once()

        # Verificar el resultado
        self.assertTrue(result)

if __name__ == '__main__':
    unittest.main()