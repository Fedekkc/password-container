import json


class Password:
    def __init__(self, id_user, service, password, register_date):
        self.id_user = id_user
        self.service = service
        self.password = password
        self.register_date = register_date
        self.id_user = id_user
        
    def to_dict(self):
        return {
            'id_user': self.id_user,
            'service': self.service,
            'password': self.password,
            'register_date': self.register_date if isinstance(self.register_date, str) else self.register_date.isoformat() if self.register_date else None,
        }
    
    def to_json(self):
        return json.dumps(self.to_dict())