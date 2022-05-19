import json

class PongGameInterface:
    def __init__(self):
        self.state = {
            'ball_pos': [0, 0],
            'my_pos': 0,
            'mov': 0
        }

    def _request_update(self):
        self.state = json.loads(input())

    def _send_update(self):
        print(json.dumps(self.state))

    def get_my_position(self):
        return self.state['my_pos']

    def get_ball_position(self):
        return self.state['ball_pos']

    def set_movement(self, dir):
        if dir != 0 and dir != 1 and dir != 2:
            raise Exception()
        self.state['mov'] = dir
        
class Pong: 

    ''' 
    Puedes acceder a la API usando la propiedad self.api
    Los metodos disponibles son:
        - get_my_position()
        Regresa un entero representando la posicion en Y de la IA.
        
        - get_ball_position()
        Regresa un arreglo de exactamente dos flotantes, el primero
        representa la posicion en X y el segundo en Y de la bola.

        - set_movement(dir)
        Recibe un entero que indica la direccion a la que debe de
        moverse la IA:
                0 para DETENERSE
                1 para ARRIBA
                2 para ABAJO
        
    '''
    def strategy(self):
        if self.api.get_my_position() > self.api.get_ball_position()[1]:
            self.api.set_movement(1) # move up
        elif self.api.get_my_position() < self.api.get_ball_position()[1]:
            self.api.set_movement(2) # move down
        else: 
            self.api.set_movement(0) # stop
                
    def __init__(self):
        self.api = PongGameInterface()

if __name__ == '__main__':
    gm = Pong()
    while True:
        gm.api._request_update()
        gm.strategy()
        gm.api._send_update()
    