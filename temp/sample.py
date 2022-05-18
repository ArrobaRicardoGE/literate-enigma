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
    def __init__(self):
        self.i = PongGameInterface()
        self.mov = 0

    def strategy(self):
        if self.i.get_my_position() > self.i.get_ball_position()[1]:
            self.i.set_movement(1)  # arriba
        else:
            self.i.set_movement(2)


if __name__ == '__main__':
    gm = Pong()
    while True:
        gm.i._request_update()
        gm.strategy()
        gm.i._send_update()
